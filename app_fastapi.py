from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from pyspark.sql import SparkSession
from pyspark.ml.feature import VectorAssembler, StandardScaler, HashingTF
from pyspark.sql import functions as F
from pyspark.ml.linalg import Vectors, VectorUDT
from pyspark.ml.functions import vector_to_array
import numpy as np

# ----------------------------
# Pydantic model for request
# ----------------------------
class SongRequest(BaseModel):
    song_name: str

# ----------------------------
# Initialize FastAPI and Spark
# ----------------------------
app = FastAPI(title="Music Recommendation API")
spark = SparkSession.builder.appName("MusicRecommendation").getOrCreate()

# ----------------------------
# Load dataset once
# ----------------------------
def load_dataset(file_path="hdfs://127.0.0.1:9000/user/hdoop/picassaa/dataset.csv"):
    df = spark.read.csv(file_path, header=True, inferSchema=True)
    first_col = df.columns[0]
    if first_col == "" or first_col.startswith("_c0"):
        df = df.drop(first_col)
    return df

df_global = load_dataset()

# ----------------------------
# Preprocess dataset
# ----------------------------
def preprocess_data(df, hash_dim=100, num_weight=2.0, cat_weight=0.5):
    numeric_features = ["danceability", "energy", "loudness", "speechiness",
                        "acousticness", "instrumentalness", "liveness", "valence", "tempo"]

    # Cast numeric columns
    for col_name in numeric_features:
        df = df.withColumn(col_name, F.col(col_name).cast("double")).fillna({col_name: 0.0})

    # Wrap categorical columns as arrays
    df = df.withColumn("artists_array", F.array(F.col("artists")))
    df = df.withColumn("genre_array", F.array(F.col("track_genre")))

    # HashingTF
    hashing_artist = HashingTF(inputCol="artists_array", outputCol="artist_vec", numFeatures=hash_dim)
    hashing_genre = HashingTF(inputCol="genre_array", outputCol="genre_vec", numFeatures=hash_dim)
    df = hashing_artist.transform(df)
    df = hashing_genre.transform(df)

    # Scale categorical embeddings
    scale_udf = F.udf(lambda v: Vectors.dense([x * cat_weight for x in v.toArray()]), VectorUDT())
    df = df.withColumn("artist_vec_scaled", scale_udf(F.col("artist_vec")))
    df = df.withColumn("genre_vec_scaled", scale_udf(F.col("genre_vec")))

    # Assemble numeric + categorical
    assembler = VectorAssembler(
        inputCols=numeric_features + ["artist_vec_scaled", "genre_vec_scaled"],
        outputCol="raw_features"
    )
    df = assembler.transform(df)

    # Scale numeric features
    scale_numeric_udf = F.udf(lambda v: Vectors.dense([x * num_weight for x in v.toArray()]), VectorUDT())
    df = df.withColumn("raw_features_scaled", scale_numeric_udf(F.col("raw_features")))

    # Standardize
    scaler = StandardScaler(inputCol="raw_features_scaled", outputCol="scaled_features",
                            withMean=True, withStd=True)
    df = scaler.fit(df).transform(df)

    return df

df_global = preprocess_data(df_global)

# ----------------------------
# Cosine similarity
# ----------------------------
def get_recommendations(df, target_features, top_n=10):
    df_array = df.withColumn("features_array", vector_to_array(F.col("scaled_features")))
    target_vec_array = target_features.toArray().tolist()
    target_broadcast = spark.sparkContext.broadcast(target_vec_array)

    df_sim = df_array.withColumn(
        "similarity",
        F.expr(
            f"""
            aggregate(
                zip_with(features_array, array({','.join(map(str, target_vec_array))}), (x,y) -> x*y),
                0D,
                (acc,z) -> acc + z
            ) / 
            ( sqrt(aggregate(transform(features_array, x -> x*x), 0D, (acc,z) -> acc + z)) *
            {np.linalg.norm(target_vec_array)} )
            """
        )
    )

    recommendations = df_sim.select("track_name", "artists", "album_name", "similarity") \
                            .orderBy(F.desc("similarity")) \
                            .limit(top_n)

    return recommendations

# ----------------------------
# API endpoint
# ----------------------------
@app.post("/")
def recommend(song_req: SongRequest, top_n: int = 10):
    # If song exists in dataset, use its features
    row = df_global.filter(F.lower(F.col("track_name")) == song_req.song_name.lower()).select("scaled_features").first()

    if row:
        target_features = row["scaled_features"]
    else:
        mean_features = np.mean(df_global.select("scaled_features").rdd.map(lambda r: r["scaled_features"].toArray()).collect(), axis=0)
        from pyspark.ml.linalg import DenseVector
        target_features = DenseVector(mean_features)  # Spark vector
        
    recommendations = get_recommendations(df_global, target_features, top_n=top_n)
    return {"recommendations": [r.asDict() for r in recommendations.collect()]}

from pyspark.sql import SparkSession

def get_spark_session():
    spark = SparkSession.builder \
        .appName("MusicRecommendationSystem") \
        .config("spark.driver.memory", "6g") \
        .config("spark.executor.memory", "6g") \
        .getOrCreate()

    print("✅ Spark session started successfully!")
    return spark

if __name__ == "__main__":
    get_spark_session()

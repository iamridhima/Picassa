# Picassa: Find music based on your taste

Prerequisites:
- OpenJDK 21, Java 17 or 21
- Hadoop 3.4.0 installed and configured
- Spark 3.5.7 installed


### Switch to Hadoop user
su - username

### Start HDFS
start-dfs.sh

### Check running services
jps

(should show namenode, datanode, secondarynamenode)

### Backend
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

### Frontend
cd frontend
npm install
npm install tailwindcss postcss autoprefixer
npm run dev

Backend runs at http://localhost:8000
Frontend runs at http://localhost:3000

Adjust the dataset and python path accordingly.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from query import router as spotify_router
from app_fastapi import app as recommend_app

app = FastAPI(title="Music Recommendation APIs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(spotify_router, prefix="/spotify", tags=["Spotify"])
app.mount("/recommend", recommend_app)

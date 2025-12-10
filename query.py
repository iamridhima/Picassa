from fastapi import APIRouter, Query
import requests
from spotify_client import spotify_client

router = APIRouter()
SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search"

@router.get("/", tags=["Spotify"])
def search_song(q: str = Query(..., description="Track name to search"), limit: int = 10):
    token = spotify_client.get_token()
    headers = {"Authorization": f"Bearer {token}"}
    params = {"q": q, "type": "track", "limit": limit}

    resp = requests.get(SPOTIFY_SEARCH_URL, headers=headers, params=params)
    if resp.status_code != 200:
        return {"error": resp.json()}

    results = [
        {
            "track_name": item["name"],
            "artists": ", ".join([a["name"] for a in item["artists"]]),
            "album_name": item["album"]["name"],
            "preview_url": item["preview_url"],
            "spotify_url": item["external_urls"]["spotify"],
            "album_image": item["album"]["images"][0]["url"] if item["album"]["images"] else None
        }
        for item in resp.json()["tracks"]["items"]
    ]
    return {"results": results}

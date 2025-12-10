import base64
import time
import requests
from dotenv import load_dotenv
import os

load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

class SpotifyClient:
    def __init__(self):
        self.token = None
        self.expiry = 0

    def get_token(self):
        # If token is still valid
        if self.token and time.time() < self.expiry:
            return self.token

        # Request new token
        auth_str = f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}"
        b64_auth_str = base64.b64encode(auth_str.encode()).decode()

        headers = {
            "Authorization": f"Basic {b64_auth_str}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {"grant_type": "client_credentials"}

        resp = requests.post("https://accounts.spotify.com/api/token", headers=headers, data=data)
        if resp.status_code != 200:
            raise Exception(f"Failed to get token: {resp.text}")

        token_info = resp.json()
        self.token = token_info["access_token"]
        self.expiry = time.time() + token_info["expires_in"] - 10  # Refresh 10s before expiry
        return self.token

spotify_client = SpotifyClient()

import os
import requests
from fastapi import HTTPException

APP_NAME = "vicehub"

MIME_TYPES = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "gif": "image/gif",
    "webp": "image/webp",
}

SUPABASE_BUCKET = os.environ.get("SUPABASE_BUCKET", "blog-images")


def _settings():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise HTTPException(status_code=503, detail="Storage is not configured")
    return url.rstrip("/"), key


def init_storage():
    _settings()


def put_object(path: str, data: bytes, content_type: str):
    supabase_url, service_role_key = _settings()
    url = f"{supabase_url}/storage/v1/object/{SUPABASE_BUCKET}/{path}"

    headers = {
        "Authorization": f"Bearer {service_role_key}",
        "apikey": service_role_key,
        "Content-Type": content_type,
        "x-upsert": "true",
    }

    r = requests.post(url, headers=headers, data=data)

    if r.status_code not in [200, 201]:
        r.raise_for_status()

    public_url = (
        f"{supabase_url}/storage/v1/object/public/"
        f"{SUPABASE_BUCKET}/{path}"
    )

    return {
        "url": public_url
    }


def get_object(path: str):
    supabase_url, _ = _settings()
    url = (
        f"{supabase_url}/storage/v1/object/public/"
        f"{SUPABASE_BUCKET}/{path}"
    )

    r = requests.get(url)
    r.raise_for_status()

    return (
        r.content,
        r.headers.get("Content-Type", "application/octet-stream"),
    )

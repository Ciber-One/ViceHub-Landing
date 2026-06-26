"""ViceHub backend tests for blog admin/public endpoints, auth, image upload, sitemap."""
import os
import io
import uuid
import requests
import pytest

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
API = f"{BASE_URL}/api"
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@vicehub.gg')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'ViceHub@2026')


@pytest.fixture(scope="module")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 20
    assert data.get("email") == ADMIN_EMAIL
    return data["token"]


@pytest.fixture(scope="module")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# --- Auth ---
class TestAuth:
    def test_login_wrong_password_returns_401(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "WRONG_PASSWORD_xxx"}, timeout=15)
        assert r.status_code == 401

    def test_me_without_token_401(self):
        r = requests.get(f"{API}/auth/me", timeout=15)
        assert r.status_code == 401

    def test_me_with_token(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d.get("email") == ADMIN_EMAIL


# --- Blog Admin Auth Requirement ---
class TestBlogAdminAuthRequired:
    def test_admin_list_requires_auth(self):
        r = requests.get(f"{API}/blog/admin/posts", timeout=15)
        assert r.status_code == 401

    def test_create_requires_auth(self):
        r = requests.post(f"{API}/blog/posts", json={"title": "x", "content": "y"}, timeout=15)
        assert r.status_code == 401

    def test_update_requires_auth(self):
        r = requests.put(f"{API}/blog/posts/{uuid.uuid4()}", json={"title": "x", "content": "y"}, timeout=15)
        assert r.status_code == 401

    def test_delete_requires_auth(self):
        r = requests.delete(f"{API}/blog/posts/{uuid.uuid4()}", timeout=15)
        assert r.status_code == 401

    def test_upload_requires_auth(self):
        files = {"file": ("test.png", b"fakepng", "image/png")}
        r = requests.post(f"{API}/blog/upload-image", files=files, timeout=20)
        assert r.status_code == 401


# --- Blog CRUD + slug logic ---
class TestBlogCRUD:
    def test_create_get_slug_unique_and_duplicate_suffix(self, auth_headers):
        title = f"TEST Pytest Blog {uuid.uuid4().hex[:8]}"
        body = {"title": title, "content": "Hello **world**\n\nLine two", "excerpt": "ex", "tags": ["a", "b"]}
        r = requests.post(f"{API}/blog/posts", json=body, headers=auth_headers, timeout=20)
        assert r.status_code == 200, r.text
        p1 = r.json()
        assert p1["title"] == title
        assert p1["slug"]
        assert p1["reading_time"] >= 1
        assert "id" in p1

        # Public GET by slug
        rg = requests.get(f"{API}/blog/posts/{p1['slug']}", timeout=15)
        assert rg.status_code == 200
        full = rg.json()
        assert full["content"].startswith("Hello")
        assert full["slug"] == p1["slug"]

        # Duplicate title -> -2 suffix
        r2 = requests.post(f"{API}/blog/posts", json=body, headers=auth_headers, timeout=20)
        assert r2.status_code == 200
        p2 = r2.json()
        assert p2["slug"] == f"{p1['slug']}-2", f"expected -2 suffix, got {p2['slug']}"

        # Public list contains both slugs
        rl = requests.get(f"{API}/blog/posts", timeout=15)
        assert rl.status_code == 200
        slugs = {p["slug"] for p in rl.json()}
        assert p1["slug"] in slugs and p2["slug"] in slugs

        # Admin list also returns them
        ra = requests.get(f"{API}/blog/admin/posts", headers=auth_headers, timeout=15)
        assert ra.status_code == 200
        admin_slugs = {p["slug"] for p in ra.json()}
        assert p1["slug"] in admin_slugs

        # Update p1
        new_title = title + " UPDATED"
        rb = requests.put(
            f"{API}/blog/posts/{p1['id']}",
            json={"title": new_title, "content": "Updated content", "excerpt": "ex2", "tags": ["c"]},
            headers=auth_headers, timeout=20,
        )
        assert rb.status_code == 200
        updated = rb.json()
        assert updated["title"] == new_title

        # Verify update persisted via public slug
        rgu = requests.get(f"{API}/blog/posts/{updated['slug']}", timeout=15)
        assert rgu.status_code == 200
        assert rgu.json()["content"] == "Updated content"

        # Delete both
        for pid in (p1["id"], p2["id"]):
            rd = requests.delete(f"{API}/blog/posts/{pid}", headers=auth_headers, timeout=15)
            assert rd.status_code == 200
            assert rd.json().get("success") is True

        # Verify deletion (slug should 404 now)
        r404 = requests.get(f"{API}/blog/posts/{updated['slug']}", timeout=15)
        assert r404.status_code == 404

    def test_get_missing_slug_returns_404(self):
        r = requests.get(f"{API}/blog/posts/this-slug-does-not-exist-xyz", timeout=15)
        assert r.status_code == 404


# --- Image upload + public serve ---
class TestImageUpload:
    def test_upload_and_serve(self, auth_headers):
        # 1x1 PNG
        png = bytes.fromhex(
            "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4"
            "890000000D49444154789C6300010000000500010D0A2DB40000000049454E44AE426082"
        )
        files = {"file": ("tiny.png", io.BytesIO(png), "image/png")}
        r = requests.post(f"{API}/blog/upload-image", files=files, headers=auth_headers, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "path" in data and isinstance(data["path"], str) and len(data["path"]) > 0
        path = data["path"]

        # Public fetch
        rg = requests.get(f"{API}/blog/image/{path}", timeout=20)
        assert rg.status_code == 200
        ct = rg.headers.get("content-type", "")
        assert ct.startswith("image/"), f"unexpected content-type: {ct}"
        assert len(rg.content) > 0


# --- Sitemap ---
class TestSitemap:
    def test_sitemap_xml(self):
        r = requests.get(f"{API}/sitemap.xml", timeout=15)
        assert r.status_code == 200
        ct = r.headers.get("content-type", "")
        assert "xml" in ct
        body = r.text
        assert "<urlset" in body
        # Must contain landing + blog index URLs on PUBLIC_SITE_URL host
        public = os.environ.get("PUBLIC_SITE_URL", BASE_URL).rstrip("/")
        assert f"{public}/" in body
        assert f"{public}/blog" in body

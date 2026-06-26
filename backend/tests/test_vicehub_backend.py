"""ViceHub backend API tests covering waitlist + companion SSE chat."""
import os
import uuid
import json
import requests
import pytest

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://gta6-companion-3.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


def _rand_email():
    return f"test_{uuid.uuid4().hex[:12]}@example.com"


# --- Health ---
class TestHealth:
    def test_root(self):
        r = requests.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        assert "ViceHub" in r.json().get("message", "")


# --- Waitlist ---
class TestWaitlist:
    def test_count_returns_integer(self):
        r = requests.get(f"{API}/waitlist/count", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "count" in data and isinstance(data["count"], int)

    def test_join_new_email_success(self):
        email = _rand_email()
        before = requests.get(f"{API}/waitlist/count", timeout=15).json()["count"]

        r = requests.post(f"{API}/waitlist", json={"email": email}, timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["success"] is True
        assert data["already_joined"] is False
        assert "confirmation_sent" in data

        after = requests.get(f"{API}/waitlist/count", timeout=15).json()["count"]
        assert after == before + 1, f"count should grow: before={before} after={after}"

    def test_join_duplicate_returns_already_joined(self):
        email = _rand_email()
        r1 = requests.post(f"{API}/waitlist", json={"email": email}, timeout=20)
        assert r1.status_code == 200
        assert r1.json()["already_joined"] is False

        r2 = requests.post(f"{API}/waitlist", json={"email": email}, timeout=20)
        assert r2.status_code == 200
        d2 = r2.json()
        assert d2["success"] is True
        assert d2["already_joined"] is True

    def test_invalid_email_returns_422(self):
        r = requests.post(f"{API}/waitlist", json={"email": "notanemail"}, timeout=15)
        assert r.status_code == 422

    def test_missing_email_returns_422(self):
        r = requests.post(f"{API}/waitlist", json={}, timeout=15)
        assert r.status_code == 422


# --- Companion Chat (SSE) ---
class TestCompanionChat:
    def test_chat_streams_deltas_and_done(self):
        r = requests.post(
            f"{API}/companion/chat",
            json={"message": "Where should I go next?"},
            timeout=60,
            stream=True,
        )
        assert r.status_code == 200
        ct = r.headers.get("content-type", "")
        assert "text/event-stream" in ct, f"unexpected content-type: {ct}"

        deltas = []
        done_seen = False
        error_seen = None
        for raw_line in r.iter_lines(decode_unicode=True):
            if not raw_line:
                continue
            if not raw_line.startswith("data:"):
                continue
            payload = json.loads(raw_line[5:].strip())
            if "delta" in payload:
                deltas.append(payload["delta"])
            if payload.get("done"):
                done_seen = True
                break
            if "error" in payload:
                error_seen = payload["error"]
                break

        assert error_seen is None, f"stream emitted error: {error_seen}"
        assert len(deltas) > 0, "no delta chunks received"
        assert done_seen, "no done event received"
        full = "".join(deltas).strip()
        assert len(full) > 10, f"response too short: {full!r}"

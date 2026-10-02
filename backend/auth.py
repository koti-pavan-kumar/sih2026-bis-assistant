"""
Authentication — bcrypt password hashing + JWT sessions.

Passwords are hashed with bcrypt (cost factor 12); plaintext never touches
disk. Sessions are signed JWTs (HS256, 30-day expiry) so the API stays
stateless. User records live in a JSON file for the MVP — swap
_load_users/_save_users for PostgreSQL later without touching the API layer.
"""
import json
import os
import threading
import time
import uuid
from pathlib import Path
from typing import Optional

import bcrypt
import jwt

TOKEN_TTL_DAYS = 30
_BCRYPT_ROUNDS = 12
_USERS_FILE = Path(__file__).parent / "data" / "users.json"
_SECRET_FILE = Path(__file__).parent / "data" / ".jwt_secret"
_lock = threading.Lock()


class AuthError(Exception):
    """Raised for auth failures; API layer maps status_code -> HTTPException."""

    def __init__(self, status_code: int, detail: str):
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail


# ---------------------------------------------------------------- secrets

def _jwt_secret() -> str:
    """Env-provided secret, else a persisted dev secret (survives restarts)."""
    env_secret = os.getenv("MM_JWT_SECRET")
    if env_secret:
        return env_secret
    if _SECRET_FILE.exists():
        return _SECRET_FILE.read_text(encoding="utf-8").strip()
    secret = os.urandom(32).hex()
    _SECRET_FILE.parent.mkdir(parents=True, exist_ok=True)
    _SECRET_FILE.write_text(secret, encoding="utf-8")
    return secret


# ---------------------------------------------------------------- storage

def _load_users() -> list:
    if not _USERS_FILE.exists():
        return []
    try:
        return json.loads(_USERS_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []


def _save_users(users: list) -> None:
    _USERS_FILE.parent.mkdir(parents=True, exist_ok=True)
    tmp = _USERS_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(users, indent=2, ensure_ascii=False), encoding="utf-8")
    tmp.replace(_USERS_FILE)


# ---------------------------------------------------------------- crypto

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(_BCRYPT_ROUNDS)).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def create_token(user_id: str) -> str:
    now = int(time.time())
    payload = {
        "sub": user_id,
        "iat": now,
        "exp": now + TOKEN_TTL_DAYS * 86400,
    }
    return jwt.encode(payload, _jwt_secret(), algorithm="HS256")


def _public_user(user: dict) -> dict:
    """Strip secrets — what the API returns to clients."""
    return {k: v for k, v in user.items() if k not in ("password_hash",)}


# ---------------------------------------------------------------- operations

def register_user(
    name: str,
    email: str,
    password: str,
    phone: str = "",
    user_type: str = "individual",
    organization: str = "",
    gst_number: str = "",
    state: str = "",
    district: str = "",
) -> tuple[dict, str]:
    """Create a new user. Returns (public_user, token)."""
    if not name or not name.strip():
        raise AuthError(400, "Full name is required.")
    if not email or "@" not in email or "." not in email.split("@")[-1]:
        raise AuthError(400, "A valid email address is required.")
    if not password or len(password) < 8:
        raise AuthError(400, "Password must be at least 8 characters.")

    email = email.strip().lower()
    with _lock:
        users = _load_users()
        if any(u["email"] == email for u in users):
            raise AuthError(409, "An account with this email already exists. Please sign in instead.")
        user = {
            "id": "u_" + uuid.uuid4().hex[:12],
            "name": name.strip(),
            "email": email,
            "phone": phone or "",
            "password_hash": hash_password(password),
            "user_type": user_type or "individual",
            "organization": organization or "",
            "gst_number": gst_number or "",
            "state": state or "",
            "district": district or "",
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }
        users.append(user)
        _save_users(users)
    return _public_user(user), create_token(user["id"])


def login_user(email: str, password: str) -> tuple[dict, str]:
    """Verify credentials. Returns (public_user, token)."""
    if not email or not email.strip():
        raise AuthError(400, "Email address is required.")
    if not password:
        raise AuthError(400, "Password is required.")

    email = email.strip().lower()
    with _lock:
        users = _load_users()
    user = next((u for u in users if u["email"] == email), None)
    # Same error for unknown email and wrong password — don't leak which
    # emails exist in the user store.
    if user is None or not verify_password(password, user.get("password_hash", "")):
        raise AuthError(401, "Incorrect email or password.")
    return _public_user(user), create_token(user["id"])


def user_from_token(token: str) -> Optional[dict]:
    """Decode a JWT and return the public user, or None if invalid/expired."""
    try:
        payload = jwt.decode(token, _jwt_secret(), algorithms=["HS256"])
    except (jwt.InvalidTokenError, jwt.ExpiredSignatureError):
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    with _lock:
        users = _load_users()
    user = next((u for u in users if u["id"] == user_id), None)
    return _public_user(user) if user else None


def user_from_authorization(header: Optional[str]) -> Optional[dict]:
    """Extract user from an 'Authorization: Bearer <token>' header value."""
    if not header or not header.lower().startswith("bearer "):
        return None
    return user_from_token(header[7:].strip())

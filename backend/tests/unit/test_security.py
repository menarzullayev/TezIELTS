import pytest
from fastapi.security import HTTPAuthorizationCredentials

from core.sec import create_access_token, create_refresh_token, get_current_user, hash_password


def test_password_hash_and_verify():
    plain = "strong-password-123"
    hashed = hash_password(plain)

    assert hashed != plain
    assert "$" in hashed


def test_access_token_roundtrip():
    token = create_access_token({"sub": "user-1", "rol": "user"})
    creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)

    payload = get_current_user(creds)

    assert payload["sub"] == "user-1"
    assert payload["type"] == "access"


def test_refresh_token_is_rejected_for_auth():
    token = create_refresh_token({"sub": "user-1", "rol": "user"})
    creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)

    with pytest.raises(Exception) as exc_info:
        get_current_user(creds)

    assert getattr(exc_info.value, "status_code", None) == 401

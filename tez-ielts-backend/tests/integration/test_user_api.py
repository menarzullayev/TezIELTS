from sqlalchemy import select

from core.sec import create_access_token, hash_password
from usr.inf.usr_orm import UserORM


def test_register_user(client):
    response = client.post(
        "/api/v1/usr/reg",
        json={"eml": "student1@example.com", "pwd": "secret123", "nme": "Student User"},
    )

    assert response.status_code == 201
    body = response.json()
    assert body["eml"] == "student1@example.com"
    assert body["rol"] == "user"


def test_login_user(client):
    client.post(
        "/api/v1/usr/reg",
        json={"eml": "student2@example.com", "pwd": "secret123", "nme": "Student User"},
    )

    response = client.post(
        "/api/v1/usr/lgn",
        json={"eml": "student2@example.com", "pwd": "secret123"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["typ"] == "Bearer"
    assert body["acc_tkn"]
    assert body["ref_tkn"]


def test_register_user_rejects_duplicate_email(client):
    payload = {"eml": "student3@example.com", "pwd": "secret123", "nme": "Student User"}
    client.post("/api/v1/usr/reg", json=payload)
    response = client.post("/api/v1/usr/reg", json=payload)

    assert response.status_code == 400


def test_login_rejects_bad_password(client):
    client.post(
        "/api/v1/usr/reg",
        json={"eml": "student4@example.com", "pwd": "secret123", "nme": "Student User"},
    )

    response = client.post(
        "/api/v1/usr/lgn",
        json={"eml": "student4@example.com", "pwd": "wrong-pass"},
    )

    assert response.status_code == 401


async def test_get_current_user_profile(client, db_session):
    db_session.add(
        UserORM(
            id="profile-user",
            email="student5@example.com",
            name="Student User",
            password_hash=hash_password("secret123"),
            role="user",
        )
    )
    await db_session.commit()

    result = await db_session.execute(select(UserORM).where(UserORM.email == "student5@example.com"))
    user = result.scalar_one()
    token = create_access_token({"sub": user.id, "rol": user.role})

    response = client.get("/api/v1/usr/me", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert response.json()["uid"] == user.id

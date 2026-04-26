import os
import sys
from pathlib import Path

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine


TEST_DB_PATH = Path(__file__).resolve().parent / "test.db"
TEST_DB_URL = f"sqlite+aiosqlite:///{TEST_DB_PATH}"
PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

os.environ.setdefault("APP_ENV", "test")
os.environ.setdefault("DEBUG", "true")
os.environ.setdefault("DB_URL_ASYNC", TEST_DB_URL)
os.environ.setdefault("DB_URL_SYNC", f"sqlite:///{TEST_DB_PATH}")
os.environ.setdefault("JWT_SECRET", "test-secret-key-with-safe-length-123456")
os.environ.setdefault("REDIS_URL", "redis://localhost:6380/1")
os.environ.setdefault("CELERY_TASK_ALWAYS_EAGER", "true")
os.environ.setdefault("GROQ_API_KEY", "test-groq-key")

from core.db import Base  # noqa: E402
from main import app  # noqa: E402
from core.db import get_db_session  # noqa: E402
from tst.inf.tst_orm import QuestionORM, SectionORM, TestORM  # noqa: E402,F401
from usr.inf.usr_orm import UserORM  # noqa: E402,F401
from evl.inf.evl_orm import AnswerORM, ResultORM  # noqa: E402,F401


test_engine = create_async_engine(TEST_DB_URL, future=True)
TestSessionLocal = async_sessionmaker(test_engine, expire_on_commit=False)


async def override_get_db_session():
    async with TestSessionLocal() as session:
        yield session


app.dependency_overrides[get_db_session] = override_get_db_session


@pytest_asyncio.fixture(autouse=True)
async def reset_database():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest_asyncio.fixture
async def db_session():
    async with TestSessionLocal() as session:
        yield session

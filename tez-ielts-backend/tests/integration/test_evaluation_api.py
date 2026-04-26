from datetime import datetime, timezone
from unittest.mock import patch

import pytest

from evl.inf.evl_orm import ResultORM
from tst.inf.tst_orm import QuestionORM, SectionORM, TestORM
from usr.inf.usr_orm import UserORM


async def seed_result(db_session, writing_score=None):
    user = UserORM(
        id="user-1",
        email="candidate@example.com",
        name="Candidate",
        password_hash="hashed",
        role="user",
    )
    test = TestORM(id="test-1", title="Demo Test", type="Academic")
    section = SectionORM(id="section-1", test_id="test-1", name="Writing Task 2")
    question = QuestionORM(
        id="question-1",
        section_id="section-1",
        question_type="essay",
        question_text="Explain your opinion",
        correct_answer="n/a",
    )
    result = ResultORM(
        id="result-1",
        user_id="user-1",
        test_id="test-1",
        writing_score=writing_score,
        completed_at=datetime.now(timezone.utc) if writing_score is not None else None,
    )
    db_session.add_all([user, test, section, question, result])
    await db_session.commit()


@pytest.mark.asyncio
async def test_get_evaluation_status(client, db_session):
    await seed_result(db_session, writing_score=7.0)

    response = client.get("/api/v1/evl/status/result-1")

    assert response.status_code == 200
    assert response.json()["status"] == "DONE"
    assert response.json()["scores"]["writing"] == 7.0


def test_submit_writing_queues_background_task(client):
    with patch("evl.api.evl_router.evaluate_writing_task.delay") as delay_mock:
        delay_mock.return_value.id = "task-123"
        response = client.post(
            "/api/v1/evl/submit/writing",
            json={"result_id": "result-1", "essay_text": "My IELTS essay"},
        )

    assert response.status_code == 200
    assert response.json() == {"task_id": "task-123", "status": "PENDING"}
    delay_mock.assert_called_once_with("result-1", "My IELTS essay")


@pytest.mark.asyncio
async def test_status_returns_not_found_for_missing_result(client):
    response = client.get("/api/v1/evl/status/missing-result")

    assert response.status_code == 404

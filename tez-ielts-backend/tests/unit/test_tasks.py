from sqlalchemy import select

from evl.app.ai_evaluator import EvaluationCriteria, WritingEvaluation, ai_eval
from evl.app.tasks import evaluate_speaking_task, evaluate_writing_task
from evl.inf.evl_orm import ResultORM
from tst.inf.tst_orm import QuestionORM, SectionORM, TestORM
from usr.inf.usr_orm import UserORM


async def seed_result(db_session):
    db_session.add_all(
        [
            UserORM(
                id="task-user",
                email="task@example.com",
                name="Task User",
                password_hash="hashed",
                role="user",
            ),
            TestORM(id="task-test", title="Task Test", type="Academic"),
            SectionORM(id="task-section", test_id="task-test", name="Writing Task"),
            QuestionORM(
                id="task-question",
                section_id="task-section",
                question_type="essay",
                question_text="Write an essay",
                correct_answer="n/a",
            ),
            ResultORM(id="task-result", user_id="task-user", test_id="task-test"),
        ]
    )
    await db_session.commit()


async def fake_evaluate_writing(_text: str):
    return WritingEvaluation(
        overall_band=8.0,
        task_response=EvaluationCriteria(score=8.0, feedback="Zo'r", strengths=["Aniq"], weaknesses=[]),
        coherence_cohesion=EvaluationCriteria(score=8.0, feedback="Yaxshi", strengths=["Mantiq"], weaknesses=[]),
        lexical_resource=EvaluationCriteria(score=8.0, feedback="Boy", strengths=["Lug'at"], weaknesses=[]),
        grammatical_range=EvaluationCriteria(score=8.0, feedback="Toza", strengths=["Grammatika"], weaknesses=[]),
        improved_text="Band 9 sample",
    )


async def test_evaluate_writing_task_updates_database(db_session, monkeypatch):
    await seed_result(db_session)
    monkeypatch.setattr(ai_eval, "evaluate_writing", fake_evaluate_writing)

    async_result = evaluate_writing_task.delay("task-result", "Essay text")
    payload = async_result.get()

    refreshed = await db_session.execute(select(ResultORM).where(ResultORM.id == "task-result"))
    result = refreshed.scalar_one()

    assert payload["overall_band"] == 8.0
    assert result.writing_score == 8.0


def test_evaluate_speaking_task_placeholder():
    payload = evaluate_speaking_task.delay("result-1", "https://cdn.example.com/audio.wav").get()

    assert payload["status"] == "speaking_placeholder_complete"

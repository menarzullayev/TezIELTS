import asyncio
from concurrent.futures import ThreadPoolExecutor
from core.celery_app import celery_app
from core.log import log
from core.db import async_session_maker
from evl.app.ai_evaluator import ai_eval
from sqlalchemy import update
from evl.inf.evl_orm import ResultORM

def run_async(coro):
    """Helper to run async code inside sync celery task."""
    try:
        asyncio.get_running_loop()
    except RuntimeError:
        return asyncio.run(coro)

    with ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(asyncio.run, coro)
        return future.result()

@celery_app.task(bind=True, max_retries=3, name="evl.evaluate_writing")
def evaluate_writing_task(self, result_id: str, essay_text: str):
    log.info(f"task_started: writing_evl result_id={result_id}")
    
    try:
        # Perform evaluation
        evaluation = run_async(ai_eval.evaluate_writing(essay_text))
        
        # Update database with scores
        async def update_db():
            async with async_session_maker() as session:
                stmt = (
                    update(ResultORM)
                    .where(ResultORM.id == result_id)
                    .values(
                        writing_score=evaluation.overall_band,
                        # We could also store the full JSON feedback in a separate column
                        completed_at=None # Update this when all modules are done
                    )
                )
                await session.execute(stmt)
                await session.commit()
        
        run_async(update_db())
        log.info(f"task_success: writing_evl result_id={result_id} band={evaluation.overall_band}")
        return evaluation.model_dump()
        
    except Exception as exc:
        log.error(f"task_failed: writing_evl result_id={result_id} err={str(exc)}")
        self.retry(exc=exc, countdown=10)

@celery_app.task(bind=True, max_retries=3, name="evl.evaluate_speaking")
def evaluate_speaking_task(self, result_id: str, audio_url: str):
    log.info(f"task_started: speaking_evl result_id={result_id}")
    # In real world: download audio from audio_url, transcribe, evaluate matn
    return {"status": "speaking_placeholder_complete"}

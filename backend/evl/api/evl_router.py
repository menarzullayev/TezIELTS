from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.db import get_db_session
from evl.inf.evl_orm import ResultORM
from evl.app.tasks import evaluate_writing_task
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/evl", tags=["Evaluation & AI"])

class WritingSubmitReq(BaseModel):
    result_id: str
    essay_text: str

@router.post("/submit/writing")
async def submit_writing(req: WritingSubmitReq):
    # Trigger background task
    task = evaluate_writing_task.delay(req.result_id, req.essay_text)
    return {"task_id": task.id, "status": "PENDING"}

@router.get("/status/{result_id}")
async def get_evaluation_status(
    result_id: str, 
    session: AsyncSession = Depends(get_db_session)
):
    result = await session.execute(
        select(ResultORM).where(ResultORM.id == result_id)
    )
    db_res = result.scalar_one_or_none()
    
    if not db_res:
        raise HTTPException(status_code=404, detail="Natija topilmadi")
    
    # Check if AI scores are present
    status = "DONE" if db_res.writing_score is not None else "PROCESSING"
    
    return {
        "result_id": result_id,
        "status": status,
        "scores": {
            "listening": db_res.listening_score,
            "reading": db_res.reading_score,
            "writing": db_res.writing_score,
            "speaking": db_res.speaking_score,
            "overall": db_res.overall_band
        }
    }

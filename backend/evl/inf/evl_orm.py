from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from core.db import Base

class ResultORM(Base):
    __tablename__ = "results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    test_id = Column(String(36), ForeignKey("tests.id", ondelete="CASCADE"), nullable=False)
    
    listening_score = Column(Float, nullable=True)
    reading_score = Column(Float, nullable=True)
    writing_score = Column(Float, nullable=True)
    speaking_score = Column(Float, nullable=True)
    overall_band = Column(Float, nullable=True)

    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    answers = relationship("AnswerORM", back_populates="result", cascade="all, delete-orphan")

class AnswerORM(Base):
    __tablename__ = "answers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    result_id = Column(String(36), ForeignKey("results.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    
    user_answer = Column(Text, nullable=True)
    is_correct = Column(Float, default=0.0) # 1.0 for true, 0.0 for false, sometimes partial scoring

    result = relationship("ResultORM", back_populates="answers")

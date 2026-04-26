from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from core.db import Base

class TestORM(Base):
    __tablename__ = "tests"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False) # Academic, General
    is_premium = Column(Boolean, default=False)
    difficulty = Column(String(20), default="Medium")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sections = relationship("SectionORM", back_populates="test", cascade="all, delete-orphan")

class SectionORM(Base):
    __tablename__ = "sections"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    test_id = Column(String(36), ForeignKey("tests.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False) # e.g. "Listening Part 1", "Reading Passage 1"
    content = Column(Text, nullable=True) # E.g. the reading passage text
    media_url = Column(String(500), nullable=True) # e.g. Listening audio URL

    test = relationship("TestORM", back_populates="sections")
    questions = relationship("QuestionORM", back_populates="section", cascade="all, delete-orphan")

class QuestionORM(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    section_id = Column(String(36), ForeignKey("sections.id", ondelete="CASCADE"), nullable=False)
    question_type = Column(String(50), nullable=False) # e.g. "multiple_choice", "fill_in_the_blank"
    question_text = Column(Text, nullable=False)
    options = Column(Text, nullable=True) # JSON string of options if multiple choice
    correct_answer = Column(String(255), nullable=False)

    section = relationship("SectionORM", back_populates="questions")

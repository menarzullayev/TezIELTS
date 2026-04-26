import httpx
from core.cfg import cfg
from core.log import log
from pydantic import BaseModel, Field
from typing import List, Optional

class EvaluationCriteria(BaseModel):
    score: float
    feedback: str
    strengths: List[str]
    weaknesses: List[str]

class WritingEvaluation(BaseModel):
    overall_band: float
    task_response: EvaluationCriteria
    coherence_cohesion: EvaluationCriteria
    lexical_resource: EvaluationCriteria
    grammatical_range: EvaluationCriteria
    improved_text: Optional[str] = None

class AIEvaluator:
    def __init__(self):
        self.api_key = cfg.groq_api_key
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    async def evaluate_writing(self, text: str, task_type: str = "Task 2") -> WritingEvaluation:
        log.info(f"evaluating_writing: len={len(text)}")
        
        prompt = f"""
        You are an expert IELTS examiner. Evaluate the following IELTS Writing {task_type} essay.
        Be strict but fair, following the official IELTS band descriptors.

        ESSAY TEXT:
        \"\"\"{text}\"\"\"

        Return a JSON response with the following structure:
        {{
            "overall_band": float,
            "task_response": {{"score": float, "feedback": str, "strengths": [], "weaknesses": []}},
            "coherence_cohesion": {{"score": float, "feedback": str, "strengths": [], "weaknesses": []}},
            "lexical_resource": {{"score": float, "feedback": str, "strengths": [], "weaknesses": []}},
            "grammatical_range": {{"score": float, "feedback": str, "strengths": [], "weaknesses": []}},
            "improved_text": "A band 9.0 version of this essay"
        }}
        Provide detailed feedback in Uzbek.
        """

        payload = {
            "model": cfg.llm_model,
            "messages": [
                {"role": "system", "content": "You are a professional IELTS examiner. Always return JSON."},
                {"role": "user", "content": prompt},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.1,
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.base_url, headers=self.headers, json=payload, timeout=60.0)
                response.raise_for_status()
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                return WritingEvaluation.model_validate_json(content)
            except Exception as e:
                log.error(f"writing_evl_api_err: {str(e)}")
                raise

    async def transcribe_audio(self, audio_content: bytes) -> str:
        # Placeholder for Whisper API call
        # In real implementation: multipart/form-data to https://api.groq.com/openai/v1/audio/transcriptions
        log.info("transcribing_audio_placeholder")
        return "Transcribed text placeholder"

ai_eval = AIEvaluator()

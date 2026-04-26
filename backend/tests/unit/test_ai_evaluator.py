from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest

from evl.app.ai_evaluator import AIEvaluator


class FakeResponse:
    def raise_for_status(self):
        return None

    def json(self):
        return {
            "choices": [
                {
                    "message": {
                        "content": """
                        {
                          "overall_band": 7.5,
                          "task_response": {"score": 7.0, "feedback": "Yaxshi", "strengths": ["Mavzu yoritilgan"], "weaknesses": ["Xulosa kuchsiz"]},
                          "coherence_cohesion": {"score": 7.5, "feedback": "Mantiqiy", "strengths": ["Paragraflar yaxshi"], "weaknesses": ["Bog'lovchilar kam"]},
                          "lexical_resource": {"score": 8.0, "feedback": "Lug'at yaxshi", "strengths": ["Turli so'zlar"], "weaknesses": ["Ba'zi takrorlar"]},
                          "grammatical_range": {"score": 7.5, "feedback": "Grammatika yaxshi", "strengths": ["Murakkab gaplar"], "weaknesses": ["Mayda xatolar"]},
                          "improved_text": "Band 9 namunasi"
                        }
                        """
                    }
                }
            ]
        }


@pytest.mark.asyncio
async def test_ai_evaluator_parses_mocked_response():
    evaluator = AIEvaluator()
    fake_client = SimpleNamespace(post=AsyncMock(return_value=FakeResponse()))

    with patch("evl.app.ai_evaluator.httpx.AsyncClient") as client_cls:
        client_cls.return_value.__aenter__.return_value = fake_client
        result = await evaluator.evaluate_writing("This is a sample essay.")

    assert result.overall_band == 7.5
    assert result.task_response.feedback == "Yaxshi"

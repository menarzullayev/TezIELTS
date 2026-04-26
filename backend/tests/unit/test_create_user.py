import pytest
from unittest.mock import AsyncMock

from core.exc import DomainException
from usr.app.cmd.crt_usr import CrtUsrCmd, CrtUsrReq
from usr.dom.user import UsrEntity


@pytest.mark.asyncio
async def test_create_user_saves_new_user():
    repo = AsyncMock()
    repo.get_by_eml.return_value = None
    repo.save_usr.return_value = "user-123"

    command = CrtUsrCmd(repo)

    user_id = await command.execute(CrtUsrReq(eml="learner@example.com", pwd="password123"))

    assert user_id == "user-123"
    repo.get_by_eml.assert_awaited_once_with("learner@example.com")
    saved_user = repo.save_usr.await_args.args[0]
    assert isinstance(saved_user, UsrEntity)
    assert saved_user.eml == "learner@example.com"


@pytest.mark.asyncio
async def test_create_user_rejects_existing_email():
    repo = AsyncMock()
    repo.get_by_eml.return_value = UsrEntity(eml="learner@example.com", pwd="hashed")

    command = CrtUsrCmd(repo)

    with pytest.raises(DomainException) as exc_info:
        await command.execute(CrtUsrReq(eml="learner@example.com", pwd="password123"))

    assert exc_info.value.code == 409

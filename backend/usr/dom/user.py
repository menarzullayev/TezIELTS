from dataclasses import dataclass, field
from abc import ABC, abstractmethod

@dataclass
class UsrEntity:
    eml: str
    nme: str = ""
    pwd: str | None = None
    rol: str = "user"
    uid: str | None = None
    setn: dict = field(default_factory=dict)

    def validate(self):
        if "@" not in self.eml:
            from core.exc import DomainException
            raise DomainException("Invalid email format", 400)

class IUsrRepo(ABC):
    @abstractmethod
    async def save_usr(self, usr: UsrEntity) -> str:
        pass
    
    @abstractmethod
    async def get_by_eml(self, eml: str) -> UsrEntity | None:
        pass

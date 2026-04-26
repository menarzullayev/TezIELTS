from pydantic import BaseModel, Field, EmailStr, SecretStr
from typing import Optional

# CQRS: Commands (Requests)
class LgnReq(BaseModel):
    eml: EmailStr = Field(..., description="User's email address")
    pwd: str = Field(..., min_length=8, max_length=128, description="User's password")

class RegReq(BaseModel):
    eml: EmailStr = Field(...)
    pwd: str = Field(..., min_length=8, max_length=128)
    nme: str = Field(..., min_length=2, max_length=50, description="Full name")

# CQRS: Queries (Responses)
class TknRes(BaseModel):
    acc_tkn: str
    ref_tkn: str
    typ: str = "Bearer"

class UsrRes(BaseModel):
    uid: str
    eml: str
    nme: str
    rol: str

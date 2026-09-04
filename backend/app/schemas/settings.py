from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AppSettingsBase(BaseModel):
    agnes_api_key: str = ""


class AppSettingsCreate(AppSettingsBase):
    pass


class AppSettingsUpdate(AppSettingsBase):
    pass


class AppSettingsResponse(AppSettingsBase):
    id: str
    updated_at: datetime

    class Config:
        from_attributes = True

from datetime import date as Date, time as Time, datetime
from typing import Optional

from pydantic import BaseModel, root_validator
from .models import AppointmentStatus


class AppointmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: Date
    start_time: Time
    end_time: Time


class AppointmentCreate(AppointmentBase):
    @root_validator(pre=False, skip_on_failure=True)
    def check_time_order(cls, values):
        start_time = values.get("start_time")
        end_time = values.get("end_time")

        if start_time and end_time and start_time >= end_time:
            raise ValueError("End time must be after start time")

        return values


class AppointmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[Date] = None
    start_time: Optional[Time] = None
    end_time: Optional[Time] = None

    @root_validator(pre=False, skip_on_failure=True)
    def check_time_order(cls, values):
        start_time = values.get("start_time")
        end_time = values.get("end_time")

        if start_time and end_time and start_time >= end_time:
            raise ValueError("End time must be after start time")

        return values


class AppointmentStatusUpdate(BaseModel):
    pass


class Appointment(AppointmentBase):
    id: int
    status: AppointmentStatus
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
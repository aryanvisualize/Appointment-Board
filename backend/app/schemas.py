from datetime import date, time, datetime
from typing import Optional
from pydantic import BaseModel, root_validator
from .models import AppointmentStatus

class AppointmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: date
    start_time: time
    end_time: time

class AppointmentCreate(AppointmentBase):
    @root_validator(pre=False, skip_on_failure=True)
    def check_time_order(cls, values):
        start_time = values.get('start_time')
        end_time = values.get('end_time')
        if start_time and end_time and start_time >= end_time:
            raise ValueError('End time must be after start time')
        return values

class AppointmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None

    @root_validator(pre=False, skip_on_failure=True)
    def check_time_order(cls, values):
        start_time = values.get('start_time')
        end_time = values.get('end_time')
        if start_time and end_time and start_time >= end_time:
            raise ValueError('End time must be after start time')
        return values

class AppointmentStatusUpdate(BaseModel):
    pass # Status is updated via specific patch endpoints

class Appointment(AppointmentBase):
    id: int
    status: AppointmentStatus
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

from pydantic import BaseModel

class AppointmentBase(BaseModel):
    title: str
    description: str | None = None
    # Add other fields

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int

    class Config:
        orm_mode = True

from sqlalchemy.orm import Session
from sqlalchemy import and_
from . import models, schemas

def check_conflict(db: Session, date, start_time, end_time, exclude_id: int = None):
    query = db.query(models.Appointment).filter(
        models.Appointment.date == date,
        models.Appointment.status == models.AppointmentStatus.SCHEDULED,
        models.Appointment.start_time < end_time,
        models.Appointment.end_time > start_time
    )
    if exclude_id is not None:
        query = query.filter(models.Appointment.id != exclude_id)
    return query.first()

def get_appointments(db: Session, date=None, status=None):
    query = db.query(models.Appointment)
    if date:
        query = query.filter(models.Appointment.date == date)
    if status:
        query = query.filter(models.Appointment.status == status)
    return query.order_by(models.Appointment.date, models.Appointment.start_time).all()

def get_appointment(db: Session, appointment_id: int):
    return db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()

def create_appointment(db: Session, appointment: schemas.AppointmentCreate):
    db_appointment = models.Appointment(**appointment.dict())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def update_appointment(db: Session, appointment_id: int, appointment_update: schemas.AppointmentUpdate):
    db_appointment = get_appointment(db, appointment_id)
    if not db_appointment:
        return None

    update_data = appointment_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_appointment, key, value)

    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def update_appointment_status(db: Session, appointment_id: int, status: models.AppointmentStatus):
    db_appointment = get_appointment(db, appointment_id)
    if not db_appointment:
        return None

    db_appointment.status = status
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

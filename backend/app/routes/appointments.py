from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.Appointment])
def read_appointments(
    date: Optional[date] = None,
    status: Optional[models.AppointmentStatus] = None,
    db: Session = Depends(get_db)
):
    return crud.get_appointments(db, date=date, status=status)

@router.post("/", response_model=schemas.Appointment, status_code=status.HTTP_201_CREATED)
def create_appointment(appointment: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    # Check for conflicts
    conflict = crud.check_conflict(
        db, appointment.date, appointment.start_time, appointment.end_time
    )
    if conflict:
        raise HTTPException(
            status_code=400, detail="This time slot conflicts with another appointment."
        )
    return crud.create_appointment(db=db, appointment=appointment)

@router.get("/{appointment_id}", response_model=schemas.Appointment)
def read_appointment(appointment_id: int, db: Session = Depends(get_db)):
    db_appointment = crud.get_appointment(db, appointment_id=appointment_id)
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return db_appointment

@router.put("/{appointment_id}", response_model=schemas.Appointment)
def update_appointment(
    appointment_id: int, appointment: schemas.AppointmentUpdate, db: Session = Depends(get_db)
):
    # Fetch existing to validate the update fields properly
    db_appointment = crud.get_appointment(db, appointment_id=appointment_id)
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Prepare fields for conflict check
    check_date = appointment.date if appointment.date is not None else db_appointment.date
    check_start = appointment.start_time if appointment.start_time is not None else db_appointment.start_time
    check_end = appointment.end_time if appointment.end_time is not None else db_appointment.end_time

    # Validate times natively
    if check_start >= check_end:
        raise HTTPException(status_code=400, detail="End time must be after start time.")

    # Check for conflicts excluding self
    conflict = crud.check_conflict(
        db, check_date, check_start, check_end, exclude_id=appointment_id
    )
    if conflict:
        raise HTTPException(
            status_code=400, detail="This time slot conflicts with another appointment."
        )

    return crud.update_appointment(db=db, appointment_id=appointment_id, appointment_update=appointment)

@router.patch("/{appointment_id}/complete", response_model=schemas.Appointment)
def complete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    db_appointment = crud.update_appointment_status(db, appointment_id, models.AppointmentStatus.COMPLETED)
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return db_appointment

@router.patch("/{appointment_id}/cancel", response_model=schemas.Appointment)
def cancel_appointment(appointment_id: int, db: Session = Depends(get_db)):
    db_appointment = crud.update_appointment_status(db, appointment_id, models.AppointmentStatus.CANCELLED)
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return db_appointment

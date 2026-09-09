from datetime import date, time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import appointments
from .database import engine, Base, SessionLocal
from . import models, schemas, crud

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Appointment Board API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(appointments.router, prefix="/api/appointments", tags=["appointments"])

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        # Seed data if empty
        if not db.query(models.Appointment).first():
            print("Seeding initial appointments...")
            sample_appointments = [
                schemas.AppointmentCreate(
                    title="Team Sync",
                    description="Weekly sync meeting",
                    date=date.today(),
                    start_time=time(10, 0),
                    end_time=time(11, 0)
                ),
                schemas.AppointmentCreate(
                    title="Project Review",
                    description="Reviewing Q3 goals",
                    date=date.today(),
                    start_time=time(13, 0),
                    end_time=time(14, 0)
                )
            ]
            for appt in sample_appointments:
                crud.create_appointment(db, appt)

            completed_appt = models.Appointment(
                title="Client Onboarding",
                description="New client setup",
                date=date.today(),
                start_time=time(9, 0),
                end_time=time(9, 30),
                status=models.AppointmentStatus.COMPLETED
            )
            db.add(completed_appt)

            cancelled_appt = models.Appointment(
                title="Lunch with Bob",
                description="Rescheduled",
                date=date.today(),
                start_time=time(12, 0),
                end_time=time(13, 0),
                status=models.AppointmentStatus.CANCELLED
            )
            db.add(cancelled_appt)
            db.commit()
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Appointment Board API"}

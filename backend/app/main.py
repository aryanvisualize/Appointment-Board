from fastapi import FastAPI
from .routes import appointments

app = FastAPI(title="Appointment Board API")

app.include_router(appointments.router, prefix="/api/appointments", tags=["appointments"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Appointment Board API"}

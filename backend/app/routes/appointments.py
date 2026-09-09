from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_appointments():
    return []

@router.post("/")
def create_appointment():
    return {"message": "Appointment created"}

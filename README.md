# Appointment Board

## 1. Project Overview
A simple, polished full-stack appointment board for a small team, enabling users to schedule, manage, complete, and cancel appointments with built-in time-slot conflict prevention.

## 2. Features
- View, Add, Edit, Complete, and Cancel appointments.
- Filter appointments by date and status.
- Strict time-slot conflict prevention logic.
- Cancelled appointments remain visible without blocking time slots.
- Modern, responsive, and visually appealing user interface.

## 3. Tech Stack
**Frontend:** React, Vite, JavaScript, CSS (Glassmorphism & Gradients).
**Backend:** Python, FastAPI, SQLAlchemy, SQLite (via Pydantic).

## 4. Folder Structure
- `backend/`: FastAPI application, routes, models, schemas, and crud operations.
- `frontend/`: React application containing components, API services, and styles.

## 5. Setup Instructions

### Environment Variables
1. Navigate to the `backend/` directory.
2. The `.env` file is already created. It uses the default: `DATABASE_URL=sqlite:///./sql_app.db` (See `.env.example`).

### 6. How to run backend
1. Open a terminal in the `backend/` directory.
2. Install dependencies: `pip install -r requirements.txt`
3. Run the server: `uvicorn app.main:app --reload`
*(The API will run at http://localhost:8000 and automatically seed sample data on first start)*

### 7. How to run frontend
1. Open a terminal in the `frontend/` directory.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
*(The app will be available at http://localhost:5173 by default)*

## 8. API Endpoints
- `GET /api/appointments`: List appointments (supports `?date=YYYY-MM-DD` and `?status=SCHEDULED`).
- `POST /api/appointments`: Create a new appointment.
- `GET /api/appointments/{id}`: Get appointment details.
- `PUT /api/appointments/{id}`: Update an appointment.
- `PATCH /api/appointments/{id}/complete`: Mark as completed.
- `PATCH /api/appointments/{id}/cancel`: Mark as cancelled.

## 9. Appointment Status Behavior
- **SCHEDULED**: Active appointments that block time slots.
- **COMPLETED**: Finished appointments. They remain on the board but do not conflict.
- **CANCELLED**: Cancelled appointments. They remain visible but free up their time slots for new bookings.

## 10. Time-slot Conflict Logic
Conflicts are evaluated by checking if `new_start < existing_end` AND `new_end > existing_start`. Only `SCHEDULED` appointments are considered active for conflicts. Editing an appointment correctly excludes the current appointment's timeslot from the conflict query.

## 11. Assumptions Made
- A local SQLite database is sufficient for the scope of this project.
- Time is strictly evaluated on a day-by-day basis without cross-timezone complexities.
- `backend/`: FastAPI backend application

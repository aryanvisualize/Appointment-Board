import React from 'react';

const AppointmentCard = ({ appointment, onEdit, onComplete, onCancel }) => {
  const { id, title, description, date, start_time, end_time, status } = appointment;

  const isScheduled = status === 'SCHEDULED';
  const isCompleted = status === 'COMPLETED';
  const isCancelled = status === 'CANCELLED';

  const formatTime = (time) => {
    return time.slice(0, 5); // Format HH:MM:SS to HH:MM
  };

  return (
    <div className="appointment-card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <span className={`badge ${status.toLowerCase()}`}>{status}</span>
      </div>
      
      <div className="card-time">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        {date} &bull; {formatTime(start_time)} - {formatTime(end_time)}
      </div>

      {description && <p className="card-desc">{description}</p>}

      <div className="card-actions">
        {isScheduled && (
          <>
            <button className="btn-secondary" onClick={() => onEdit(appointment)}>Edit</button>
            <button className="btn-success" onClick={() => onComplete(id)}>Complete</button>
            <button className="btn-danger" onClick={() => {
              if(window.confirm('Are you sure you want to cancel this appointment?')) onCancel(id);
            }}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;

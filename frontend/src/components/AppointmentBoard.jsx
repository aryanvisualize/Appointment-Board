import React from 'react';
import AppointmentForm from './AppointmentForm';
import AppointmentCard from './AppointmentCard';
import Filters from './Filters';

const AppointmentBoard = () => {
  return (
    <div className="appointment-board">
      <Filters />
      <AppointmentForm />
      <div className="appointments-list">
        {/* Render AppointmentCards here */}
      </div>
    </div>
  );
};

export default AppointmentBoard;

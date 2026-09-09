import React, { useState, useEffect, useCallback } from 'react';
import AppointmentForm from './AppointmentForm';
import AppointmentCard from './AppointmentCard';
import Filters from './Filters';
import * as api from '../services/appointmentApi';

const AppointmentBoard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({ date: '', status: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchAppointments(filters.date, filters.status);
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ date: '', status: '' });
  };

  const handleFormSubmit = async (data) => {
    setFormError(null);
    try {
      if (editingAppointment) {
        await api.updateAppointment(editingAppointment.id, data);
        showSuccess('Appointment updated successfully.');
      } else {
        await api.createAppointment(data);
        showSuccess('Appointment created successfully.');
      }
      setIsFormOpen(false);
      setEditingAppointment(null);
      loadAppointments();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleComplete = async (id) => {
    try {
      await api.completeAppointment(id);
      showSuccess('Appointment marked as completed.');
      loadAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.cancelAppointment(id);
      showSuccess('Appointment cancelled successfully.');
      loadAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="appointment-board">
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="board-top">
        <Filters filters={filters} onFilterChange={handleFilterChange} onClear={clearFilters} />
        <button onClick={() => { setEditingAppointment(null); setIsFormOpen(true); }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Appointment
        </button>
      </div>

      {isFormOpen && (
        <AppointmentForm 
          editingAppointment={editingAppointment}
          onSubmit={handleFormSubmit}
          onCancel={() => { setIsFormOpen(false); setEditingAppointment(null); setFormError(null); }}
          error={formError}
        />
      )}

      {loading ? (
        <div className="empty-state">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">No appointments found matching your filters.</div>
      ) : (
        <div className="appointments-list">
          {appointments.map(appt => (
            <AppointmentCard 
              key={appt.id} 
              appointment={appt} 
              onEdit={handleEdit}
              onComplete={handleComplete}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentBoard;

import React, { useState, useEffect } from 'react';

const AppointmentForm = ({ editingAppointment, onSubmit, onCancel, error }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: ''
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (editingAppointment) {
      setFormData({
        title: editingAppointment.title,
        description: editingAppointment.description || '',
        date: editingAppointment.date,
        start_time: editingAppointment.start_time.slice(0, 5), // Format HH:MM
        end_time: editingAppointment.end_time.slice(0, 5)
      });
    } else {
      setFormData({ title: '', description: '', date: '', start_time: '', end_time: '' });
    }
    setValidationError('');
  }, [editingAppointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.title || !formData.date || !formData.start_time || !formData.end_time) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    if (formData.start_time >= formData.end_time) {
      setValidationError('End time must be after start time.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="appointment-form-overlay">
      <form className="appointment-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>{editingAppointment ? 'Edit Appointment' : 'Book Appointment'}</h2>
          <button type="button" className="btn-secondary" onClick={onCancel} style={{ padding: '0.2rem 0.5rem', background: 'transparent', border: 'none' }}>&times;</button>
        </div>
        
        {(error || validationError) && (
          <div className="alert alert-error">
            {validationError || error}
          </div>
        )}

        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="title">Title *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" />
          </div>

          <div className="form-group full-width">
            <label htmlFor="date">Date *</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="start_time">Start Time *</label>
            <input type="time" id="start_time" name="start_time" value={formData.start_time} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="end_time">End Time *</label>
            <input type="time" id="end_time" name="end_time" value={formData.end_time} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit">{editingAppointment ? 'Save Changes' : 'Add Appointment'}</button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;

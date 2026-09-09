const API_URL = 'http://localhost:8000/api/appointments';

export const fetchAppointments = async (date, status) => {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (status) params.append('status', status);
  
  const url = `${API_URL}?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to load appointments');
  return response.json();
};

export const createAppointment = async (data) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create appointment');
  }
  return response.json();
};

export const updateAppointment = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update appointment');
  }
  return response.json();
};

export const completeAppointment = async (id) => {
  const response = await fetch(`${API_URL}/${id}/complete`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Failed to complete appointment');
  return response.json();
};

export const cancelAppointment = async (id) => {
  const response = await fetch(`${API_URL}/${id}/cancel`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Failed to cancel appointment');
  return response.json();
};

import React from 'react';

const Filters = ({ filters, onFilterChange, onClear }) => {
  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="date-filter">Date</label>
        <input 
          id="date-filter"
          type="date" 
          value={filters.date} 
          onChange={(e) => onFilterChange('date', e.target.value)} 
        />
      </div>
      <div className="filter-group">
        <label htmlFor="status-filter">Status</label>
        <select 
          id="status-filter"
          value={filters.status} 
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="">All</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      <button className="btn-secondary" onClick={onClear} style={{ alignSelf: 'flex-end' }}>
        Clear Filters
      </button>
    </div>
  );
};

export default Filters;

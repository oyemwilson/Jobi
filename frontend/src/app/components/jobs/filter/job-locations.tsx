import React from 'react';
import { useAppDispatch } from '@/redux/hook';
import { setLocation } from '@/redux/features/filterSlice';

const JobLocations = () => {
  const dispatch = useAppDispatch();

  // Predefined list of locations
  const predefinedLocations = [
    'New York',
    'San Francisco',
    'Los Angeles',
    'Chicago',
    'Boston',
    'Miami',
    'Austin',
    'Seattle',
    'Denver',
    'Washington, D.C.'
  ];

  const handleLocationChange = (event) => {
    const selectedLocation = event.target.value;
    dispatch(setLocation(selectedLocation)); // Dispatch the action with the selected location
  };

  return (
    <select onChange={handleLocationChange}>
      <option value="">Select Location</option>
      {predefinedLocations.map((location, index) => (
        <option key={index} value={location}>
          {location}
        </option>
      ))}
    </select>
  );
};

export default JobLocations;

// src/components/UserSelector.jsx
import { useState, useEffect } from 'react';
import Select from 'react-select'; 
import api from '../services/api';

const UserSelector = ({ label, placeholder, onChange, value = [] }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        const users = response.data.data || response.data;
        
        const formattedOptions = users.map(user => ({
          value: user.id,
          label: `${user.nombre || user.name || ''} ${user.apellido || ''}`.trim() || user.nombre_usuario || user.email || `Usuario ${user.id}`
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const currentValue = options.filter(option => value.includes(option.value));

  const handleChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    onChange(selectedIds);
  };

  return (
    <div className="crear-reporte-field-group">
      <label className="crear-reporte-label">{label}</label>
      <Select
        isMulti
        name="usuarios_asignados"
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder={loading ? "Cargando usuarios..." : placeholder}
        isLoading={loading}
        onChange={handleChange}
        value={currentValue}
        styles={{
          control: (base) => ({
            ...base,
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '2px',
            fontSize: '13.5px',
            boxShadow: 'none',
            '&:hover': { border: '1px solid #cbd5e1' }
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: '#e0f2fe',
            borderRadius: '4px',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: '#0369a1',
            fontWeight: '600',
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: '#0369a1',
            ':hover': { backgroundColor: '#bae6fd', color: '#0369a1' },
          }),
        }}
      />
    </div>
  );
};

export default UserSelector;
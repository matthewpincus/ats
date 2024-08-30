import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    notes: '',
    fitRating: 0,
    techRating: 0,
    schedule: '',
    nextStep: '',
  });
  const [applicants, setApplicants] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterTerm, setFilterTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const response = await fetch('/api/applicants');
      if (response.ok) {
        const data = await response.json();
        setApplicants(data);
      } else {
        console.error('Failed to fetch applicants');
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/applicants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchApplicants();
        setFormData({
          name: '',
          role: '',
          notes: '',
          fitRating: 0,
          techRating: 0,
          schedule: '',
          nextStep: '',
        });
      } else {
        const errorData = await response.json();
        console.error('Submission failed:', errorData);
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (id) => {
    const updatedApplicant = applicants.find(a => a.id === id);
    try {
      const response = await fetch(`/api/applicants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedApplicant),
      });

      if (response.ok) {
        setEditingId(null);
        await fetchApplicants();
      } else {
        console.error('Failed to update applicant');
      }
    } catch (error) {
      console.error('Error updating applicant:', error);
    }
  };

  const handleCellChange = (id, field, value) => {
    setApplicants(prevApplicants =>
      prevApplicants.map(a =>
        a.id === id ? { ...a, [field]: value } : a
      )
    );
  };

  const filteredAndSortedApplicants = applicants
    .filter(applicant => 
      applicant.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
      applicant.role.toLowerCase().includes(filterTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Applicant Tracking System</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className={styles.input} />
        <input name="role" value={formData.role} onChange={handleChange} placeholder="Role" required className={styles.input} />
        <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" className={styles.input} />
        <input type="number" name="fitRating" value={formData.fitRating} onChange={handleChange} placeholder="Fit Rating" min="0" max="10" required className={styles.input} />
        <input type="number" name="techRating" value={formData.techRating} onChange={handleChange} placeholder="Tech Rating" min="0" max="10" required className={styles.input} />
        <input type="date" name="schedule" value={formData.schedule} onChange={handleChange} className={styles.input} />
        <input name="nextStep" value={formData.nextStep} onChange={handleChange} placeholder="Next Step" className={styles.input} />
        <button type="submit" className={styles.button}>Submit</button>
      </form>

      <h2 className={styles.subtitle}>Applicants</h2>
      <input 
        type="text" 
        placeholder="Filter applicants..." 
        value={filterTerm} 
        onChange={(e) => setFilterTerm(e.target.value)} 
        className={styles.input}
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('role')}>Role</th>
            <th onClick={() => handleSort('fitRating')}>Fit Rating</th>
            <th onClick={() => handleSort('techRating')}>Tech Rating</th>
            <th onClick={() => handleSort('schedule')}>Schedule</th>
            <th onClick={() => handleSort('nextStep')}>Next Step</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedApplicants.map((applicant) => (
            <tr key={applicant.id}>
              <td>
                {editingId === applicant.id ? (
                  <input
                    value={applicant.name}
                    onChange={(e) => handleCellChange(applicant.id, 'name', e.target.value)}
                    className={styles.input}
                  />
                ) : applicant.name}
              </td>
              <td>
                {editingId === applicant.id ? (
                  <input
                    value={applicant.role}
                    onChange={(e) => handleCellChange(applicant.id, 'role', e.target.value)}
                    className={styles.input}
                  />
                ) : applicant.role}
              </td>
              <td>
                {editingId === applicant.id ? (
                  <input
                    type="number"
                    value={applicant.fit_rating}
                    onChange={(e) => handleCellChange(applicant.id, 'fit_rating', e.target.value)}
                    className={styles.input}
                  />
                ) : applicant.fit_rating}
              </td>
              <td>
                {editingId === applicant.id ? (
                  <input
                    type="number"
                    value={applicant.tech_rating}
                    onChange={(e) => handleCellChange(applicant.id, 'tech_rating', e.target.value)}
                    className={styles.input}
                  />
                ) : applicant.tech_rating}
              </td>
              <td>
                {editingId === applicant.id ? (
                  <input
                    type="date"
                    value={applicant.schedule}
                    onChange={(e) => handleCellChange(applicant.id, 'schedule', e.target.value)}
                    className={styles.input}
                  />
                ) : applicant.schedule}
              </td>
              <td>
                {editingId === applicant.id ? (
                  <input
                    value={applicant.next_step}
                    onChange={(e) => handleCellChange(applicant.id, 'next_step', e.target.value)}
                    className={styles.input}
                  />
                ) : applicant.next_step}
              </td>
              <td>
                {editingId === applicant.id ? (
                  <button onClick={() => handleSave(applicant.id)} className={styles.button}>Save</button>
                ) : (
                  <button onClick={() => handleEdit(applicant.id)} className={styles.button}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

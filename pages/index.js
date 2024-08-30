import { useState, useEffect } from 'react';

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
        const result = await response.json();
        console.log('Submission successful:', result);
        fetchApplicants();
        // Reset form
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
    <div>
      <h1>Applicant Tracking System</h1>
      <form onSubmit={handleSubmit}>
        <label>Name: <input name="name" value={formData.name} onChange={handleChange} required /></label>
        <label>Role: <input name="role" value={formData.role} onChange={handleChange} required /></label>
        <label>Notes: <textarea name="notes" value={formData.notes} onChange={handleChange} /></label>
        <label>Fit Rating: <input type="number" name="fitRating" value={formData.fitRating} onChange={handleChange} min="0" max="10" /></label>
        <label>Tech Rating: <input type="number" name="techRating" value={formData.techRating} onChange={handleChange} min="0" max="10" /></label>
        <label>Schedule: <input type="date" name="schedule" value={formData.schedule} onChange={handleChange} /></label>
        <label>Next Step: <input name="nextStep" value={formData.nextStep} onChange={handleChange} /></label>
        <button type="submit">Submit</button>
      </form>

      <h2>Applicants</h2>
      <input 
        type="text" 
        placeholder="Filter applicants..." 
        value={filterTerm} 
        onChange={(e) => setFilterTerm(e.target.value)} 
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('role')}>Role</th>
            <th onClick={() => handleSort('fitRating')}>Fit Rating</th>
            <th onClick={() => handleSort('techRating')}>Tech Rating</th>
            <th onClick={() => handleSort('schedule')}>Schedule</th>
            <th onClick={() => handleSort('nextStep')}>Next Step</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedApplicants.map((applicant, index) => (
            <tr key={index}>
              <td>{applicant.name}</td>
              <td>{applicant.role}</td>
              <td>{applicant.fit_rating}</td>
              <td>{applicant.tech_rating}</td>
              <td>{applicant.schedule}</td>
              <td>{applicant.next_step}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

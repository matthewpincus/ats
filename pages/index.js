import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    notes: '',
    fitRating: 0,
    techRating: 0,
    schedule: '',
    nextStep: '',
    resume: null
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      resume: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    const response = await fetch('/api/applicants', {
      method: 'POST',
      body: formDataToSend
    });

    if (response.ok) {
      router.push('/success');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
      <input name="role" value={formData.role} onChange={handleChange} placeholder="Role" required />
      <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" />
      <input type="number" name="fitRating" value={formData.fitRating} onChange={handleChange} placeholder="Fit Rating" min="0" max="10" />
      <input type="number" name="techRating" value={formData.techRating} onChange={handleChange} placeholder="Tech Rating" min="0" max="10" />
      <input type="date" name="schedule" value={formData.schedule} onChange={handleChange} />
      <input name="nextStep" value={formData.nextStep} onChange={handleChange} placeholder="Next Step" />
      <input type="file" name="resume" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
      <button type="submit">Submit</button>
    </form>
  );
}

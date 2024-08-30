import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, role, notes, fitRating, techRating, schedule, nextStep } = req.body;

    try {
      await sql`
        INSERT INTO applicants (name, role, notes, fit_rating, tech_rating, schedule, next_step)
        VALUES (${name}, ${role}, ${notes}, ${fitRating}, ${techRating}, ${schedule}, ${nextStep})
      `;
      res.status(200).json({ message: 'Applicant added successfully' });
    } catch (error) {
      console.error('Error adding applicant:', error);
      res.status(500).json({ error: 'Error adding applicant', details: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const { rows } = await sql`SELECT * FROM applicants`;
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      res.status(500).json({ error: 'Error fetching applicants', details: error.message });
    }
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const { name, role, notes, fitRating, techRating, schedule, nextStep } = req.body;

    try {
      await sql`
        UPDATE applicants 
        SET name = ${name}, role = ${role}, notes = ${notes}, 
            fit_rating = ${fitRating}, tech_rating = ${techRating}, 
            schedule = ${schedule}, next_step = ${nextStep}
        WHERE id = ${id}
      `;
      res.status(200).json({ message: 'Applicant updated successfully' });
    } catch (error) {
      console.error('Error updating applicant:', error);
      res.status(500).json({ error: 'Error updating applicant', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

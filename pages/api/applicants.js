import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, role, notes, fitRating, techRating, schedule, nextStep } = req.body;
    const resumeFile = req.files.resume;

    try {
      await sql`
        INSERT INTO applicants (name, role, notes, fit_rating, tech_rating, schedule, next_step, resume_path)
        VALUES (${name}, ${role}, ${notes}, ${fitRating}, ${techRating}, ${schedule}, ${nextStep}, ${resumeFile.path})
      `;
      res.status(200).json({ message: 'Applicant added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error adding applicant' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

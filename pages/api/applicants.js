else if (req.method === 'PUT') {
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
}

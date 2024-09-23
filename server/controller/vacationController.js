const { dbPool } = require("../db");

async function addVacation(req, res) {
  const { name, location, price, imageUrl } = req.body;

  const insertQuery = `
    INSERT INTO Ex6_vacation (name, location, price, image_url)
    VALUES (?, ?, ?, ?)
  `;
  try {
    const [insertResult] = await dbPool.query(insertQuery, [name, location, price, imageUrl]);
    res.status(201).send({ message: "Vacation added successfully.", vacationId: insertResult.insertId });
  } catch (error) {
    console.error("Error adding vacation:", error);
    res.status(500).send({ error: "Failed to add vacation." });
  }
}



module.exports = {
  addVacation
};
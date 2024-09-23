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

async function deleteVacation(req, res) {
    const { id } = req.params; // Get the id from the URL params
  
    const deleteQuery = `
      DELETE FROM Ex6_vacation
      WHERE id = ?
    `;
  
    try {
      const [deleteResult] = await dbPool.query(deleteQuery, [id]);
      
      if (deleteResult.affectedRows === 0) {
        return res.status(404).send({ message: "Vacation not found." });
      }
  
      res.status(200).send({ message: "Vacation deleted successfully." });
    } catch (error) {
      console.error("Error deleting vacation:", error);
      res.status(500).send({ error: "Failed to delete vacation." });
    }
  }
  

async function editVacation(req, res) {
    const { id } = req.params; // Get the id from the URL params
    const { name, location, price, imageUrl } = req.body;
  
    const updateQuery = `
      UPDATE Ex6_vacation
      SET name = ?, location = ?, price = ?, image_url = ?
      WHERE id = ?
    `;
  
    try {
      const [updateResult] = await dbPool.query(updateQuery, [name, location, price, imageUrl, id]);
      
      if (updateResult.affectedRows === 0) {
        return res.status(404).send({ message: "Vacation not found." });
      }
  
      res.status(200).send({ message: "Vacation updated successfully." });
    } catch (error) {
      console.error("Error updating vacation:", error);
      res.status(500).send({ error: "Failed to update vacation." });
    }
  }
  

async function fetchVacations(req, res) {
  const selectQuery = `SELECT * FROM Ex6_vacation`;
  
  try {
    const [vacations] = await dbPool.query(selectQuery);
    res.status(200).send(vacations);
  } catch (error) {
    console.error("Error fetching vacations:", error);
    res.status(500).send({ error: "Failed to fetch vacations." });
  }
}

module.exports = {
  addVacation,
  fetchVacations,
  deleteVacation,
  editVacation
};
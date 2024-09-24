const { dbPool } = require("../db");

async function addVacation(req, res) {
  const { name, location, price, imageUrl } = req.body;

  const insertQuery = `
    INSERT INTO tbl_63_vacations (name, location, price, image_url)
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

async function fetchVacations(req, res) {
  const selectQuery = `SELECT * FROM tbl_63_vacations`;
  
  try {
    const [vacations] = await dbPool.query(selectQuery);
    res.status(200).send(vacations);
  } catch (error) {
    console.error("Error fetching vacations:", error);
    res.status(500).send({ error: "Failed to fetch vacations." });
  }
}

async function fetchVacationById(req, res) {

  const { id } = req.params;
  const selectQuery = `SELECT * FROM tbl_63_vacations WHERE id = ?`;

  try {
      const [result] = await dbPool.query(selectQuery, [id]);

      if (result.length === 0) {
          return res.status(404).json({ error: 'Vacation not found' });
      }

      res.status(200).json(result[0]);  // Return the vacation details as JSON
  } catch (error) {
      console.error('Error fetching vacation:', error);
      res.status(500).json({ error: 'Failed to fetch vacation' });
  }
}

async function editVacation(req, res) {
  const { id } = req.params; 
  const { name, location, price, imageUrl } = req.body;

  const updateQuery = `
    UPDATE tbl_63_vacations
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

async function deleteVacation(req, res) {
  const { id } = req.params; 

  const deleteQuery = `
    DELETE FROM tbl_63_vacations
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

async function searchVacation(req, res) {
  const { query } = req.query;  // Expecting a single "query" parameter from the frontend

  if (!query || query.length < 3) {
    return res.status(400).send({ error: "Search parameters must contain at least 3 characters." });
  }
  
  const searchQuery = `
    SELECT * FROM tbl_63_vacations 
    WHERE LOWER(name) LIKE LOWER(?) 
    OR LOWER(location) LIKE LOWER(?)
  `;
  const queryParams = [`%${query.toLowerCase()}%`, `%${query.toLowerCase()}%`];  // Use the same query for name and location
  
  try {
    const [results] = await dbPool.query(searchQuery, queryParams);
    res.status(200).send(results);
  } catch (error) {
    console.error("Error searching vacations:", error);
    res.status(500).send({ error: "Failed to search vacations." });
  }
}


module.exports = {
  addVacation,
  fetchVacations,
  fetchVacationById,  
  editVacation,
  deleteVacation,
  searchVacation
};

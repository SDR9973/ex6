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
    const [vacations] = await dbPool.query(selectQuery, [id]);

    if (vacations.length === 0) {
      return res.status(404).send({ message: "Vacation not found." });
    }

    res.status(200).send(vacations[0]); 
  } catch (error) {
    console.error("Error fetching vacation by id:", error);
    res.status(500).send({ error: "Failed to fetch vacation." });
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
  const { name, location } = req.query;

  if ((name && name.length < 3) || (location && location.length < 3)) {
    return res.status(400).send({ error: "Search parameters must contain at least 3 characters." });
  }
  
  let searchQuery = `SELECT * FROM tbl_63_vacations WHERE 1=1`;
  let queryParams = [];
  
  if (name) {
    searchQuery += ` AND LOWER(name) LIKE LOWER(?)`;
    queryParams.push(`%${name.toLowerCase()}%`);
  }
  if (location) {
    searchQuery += ` AND LOWER(location) LIKE LOWER(?)`;
    queryParams.push(`%${location.toLowerCase()}%`);
  }
  
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

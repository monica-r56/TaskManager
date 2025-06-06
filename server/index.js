const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Import your PostgreSQL pool connection

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(express.json());

// Routes

// ➕ Create a Task
app.post("/tasks", async (req, res) => {
  const { title, description, due_date, priority } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, due_date, priority) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description, due_date, priority]
    );
    res.status(201).json(result.rows[0]);
    console.log("Task created: ",result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// 📥 Get All Tasks
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE deleted_at IS NULL ORDER BY id DESC`
    );
    res.json(result.rows);
    console.log("All tasks fetched",result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// ✏️ Update Task
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, priority } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           due_date = $3,
           priority = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND deleted_at IS NULL
       RETURNING *`,
      [title, description, due_date, priority, id]
    );
    res.json(result.rows[0]);
    console.log("Task updated: ",result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// ✅ Toggle Completion
app.patch("/tasks/:id/complete", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tasks
       SET completed = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING *`,
      [completed, id]
    );
    res.json(result.rows[0]);
    console.log("Task completed: ",result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to toggle task" });
  }
});

// 🗑️ Soft Delete Task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      `UPDATE tasks
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id]
    );
    res.json({ message: "Task deleted" });
    console.log("Task deleted: ",id);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

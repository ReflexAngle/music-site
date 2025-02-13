const express = require("express");
const odbc = require("odbc");
const path = require("path");

const app = express();

// 1️⃣ Database Connection String (Adjust Path to Your .accdb File)
const dbFilePath = path.join(__dirname, "MusicSelect.accdb");
const connectionString =
  "Driver={Microsoft Access Driver (*.mdb, *.accdb)};" + `Dbq=${dbFilePath};`;

// 2️⃣ Middleware
app.use(express.json()); // Allows Express to parse JSON request bodies
app.use(express.static(path.join(__dirname, "public"))); // Serves static files like index.html

// 3️⃣ GET Route: Retrieve All Songs
app.get("/songs", async (req, res) => {
  let connection;
  try {
    connection = await odbc.connect(connectionString);
    const result = await connection.query("SELECT * FROM Songs");
    res.json(result);
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ error: "Database query failed." });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// 4️⃣ POST Route: Add a New Song
app.post("/songs", async (req, res) => {
  let connection;
  try {
    const { title, artist, album } = req.body;
    connection = await odbc.connect(connectionString);
    const statement = await connection.createStatement();
    await statement.prepare(
      "INSERT INTO Songs (Title, Artist, Album) VALUES (?, ?, ?)"
    );
    await statement.bind([title, artist, album]);
    const result = await statement.execute();
    res.status(201).json({ success: true, inserted: result.count });
  } catch (error) {
    console.error("Error inserting song:", error);
    res.status(500).json({ error: "Failed to insert song" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// 5️⃣ PUT Route: Update an Existing Song
app.put("/songs/:id", async (req, res) => {
  let connection;
  try {
    const { title, artist, album } = req.body;
    const { id } = req.params;
    connection = await odbc.connect(connectionString);
    const statement = await connection.createStatement();
    await statement.prepare(
      "UPDATE Songs SET Title=?, Artist=?, Album=? WHERE ID=?"
    );
    await statement.bind([title, artist, album, id]);
    const result = await statement.execute();
    res.json({ success: true, updated: result.count });
  } catch (error) {
    console.error("Error updating song:", error);
    res.status(500).json({ error: "Failed to update song" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// 6️⃣ DELETE Route: Remove a Song
app.delete("/songs/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await odbc.connect(connectionString);
    const statement = await connection.createStatement();
    await statement.prepare("DELETE FROM Songs WHERE ID=?");
    await statement.bind([id]);
    const result = await statement.execute();
    res.json({ success: true, deleted: result.count });
  } catch (error) {
    console.error("Error deleting song:", error);
    res.status(500).json({ error: "Failed to delete song" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// 7️⃣ Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

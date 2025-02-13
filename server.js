const express = require("express");
const odbc = require("odbc");
const path = require("path");

const app = express();

// 🔹 Enable JSON Parsing for POST & PUT Requests
app.use(express.json());

// 🔹 Serve Static Files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// 🔗 **Direct Access DB Connection (NO DSN)**
const dbFilePath = path.join(__dirname, "MusicSelect.accdb"); // Corrected path
const connectionString =
  "Driver={Microsoft Access Driver (*.mdb, *.accdb)};" + `Dbq=${dbFilePath};`;

// 📌 **Serve index.html for the root route**
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🎵 **GET All Songs**
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

// 🎵 **POST - Add a New Song**
app.post("/songs", async (req, res) => {
  let connection;
  try {
    const { ArtistName, SongName, Genre, Mood } = req.body;

    if (!ArtistName || !SongName || !Genre || !Mood) {
      return res.status(400).json({ error: "All fields are required." });
    }

    connection = await odbc.connect(connectionString);
    const statement = await connection.createStatement();
    await statement.prepare(
      "INSERT INTO Songs (ArtistName, SongName, Genre, Mood) VALUES (?, ?, ?, ?)"
    );
    await statement.bind([ArtistName, SongName, Genre, Mood]);
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

// 🎵 **PUT - Update an Existing Song**
app.put("/songs/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { ArtistName, SongName, Genre, Mood } = req.body;

    if (!ArtistName || !SongName || !Genre || !Mood) {
      return res.status(400).json({ error: "All fields are required." });
    }

    connection = await odbc.connect(connectionString);
    const statement = await connection.createStatement();
    await statement.prepare(
      "UPDATE Songs SET ArtistName=?, SongName=?, Genre=?, Mood=? WHERE ID=?"
    );
    await statement.bind([ArtistName, SongName, Genre, Mood, id]);
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

// 🎵 **DELETE - Remove a Song**
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

// 🚀 **Start Express Server**
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

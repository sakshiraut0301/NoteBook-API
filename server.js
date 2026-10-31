const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware that lets us read JSON request bodies.
app.use(express.json());
app.use(express.static("public"));

// In-memory data keeps this first API easy to understand.
// The notes will reset whenever the server restarts.
let nextId = 3;
const notes = [
  {
    id: 1,
    title: "Learn REST APIs",
    content: "Practice GET, POST, PUT, and DELETE requests.",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Build a project",
    content: "Create a small Node.js application.",
    createdAt: new Date().toISOString()
  }
];

// A small helper for checking the input shared by POST and PUT.
function validateNote(body) {
  if (!body || typeof body.title !== "string" || body.title.trim() === "") {
    return "title is required and must be a non-empty string";
  }

  if (body.content !== undefined && typeof body.content !== "string") {
    return "content must be a string";
  }

  return null;
}

// GET /api - a quick description of the API.
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Notes API",
    endpoints: {
      listNotes: "GET /api/notes",
      getOneNote: "GET /api/notes/:id",
      createNote: "POST /api/notes",
      updateNote: "PUT /api/notes/:id",
      deleteNote: "DELETE /api/notes/:id"
    }
  });
});

// GET /api/notes - return every note.
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// GET /api/notes/:id - return one note by its number.
app.get("/api/notes/:id", (req, res) => {
  const note = notes.find((item) => item.id === Number(req.params.id));

  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  res.json(note);
});

// POST /api/notes - create a new note.
app.post("/api/notes", (req, res) => {
  const validationError = validateNote(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const note = {
    id: nextId++,
    title: req.body.title.trim(),
    content: (req.body.content || "").trim(),
    createdAt: new Date().toISOString()
  };

  notes.push(note);
  res.status(201).json(note);
});

// PUT /api/notes/:id - replace the title and content of a note.
app.put("/api/notes/:id", (req, res) => {
  const note = notes.find((item) => item.id === Number(req.params.id));

  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  const validationError = validateNote(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  note.title = req.body.title.trim();
  note.content = (req.body.content || "").trim();

  res.json(note);
});

// DELETE /api/notes/:id - remove a note.
app.delete("/api/notes/:id", (req, res) => {
  const noteIndex = notes.findIndex((item) => item.id === Number(req.params.id));

  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  notes.splice(noteIndex, 1);
  res.status(204).send();
});

// Handle malformed JSON instead of returning an HTML error page.
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Request body must contain valid JSON" });
  }

  next(error);
});

app.listen(PORT, () => {
  console.log(`Notes API is running at http://localhost:${PORT}`);
});

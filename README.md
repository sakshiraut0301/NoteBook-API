<<<<<<< ours
# NoteBook-API
A beginner-friendly Notes REST API built with Node.js and Express, supporting CRUD operations for creating, viewing, updating, and deleting notes.
=======
# Simple Notes API

A small REST API built with Node.js and Express. It lets you create, read, update, and delete notes.

## Run the project

```bash
npm install
npm start
```

The API runs at `http://localhost:3000`.

Open `http://localhost:3000` in a browser to use the basic notes UI. You can add, edit, and delete notes from the page.

For development, use `npm run dev` so Node restarts when `server.js` changes.

## API routes

| Method | URL | What it does |
| --- | --- | --- |
| GET | `/api/notes` | Get all notes |
| GET | `/api/notes/1` | Get one note |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/1` | Update a note |
| DELETE | `/api/notes/1` | Delete a note |

## Example requests

Get all notes:

```bash
curl http://localhost:3000/api/notes
```

Create a note:

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy milk\",\"content\":\"Remember to buy milk after class.\"}"
```

Update a note:

```bash
curl -X PUT http://localhost:3000/api/notes/1 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Learn REST APIs well\",\"content\":\"Practice every CRUD route.\"}"
```

Delete a note:

```bash
curl -X DELETE http://localhost:3000/api/notes/1
```

## Important note

This version stores notes in an array in memory, so all notes disappear when the server stops. A database such as MongoDB or PostgreSQL can be added later without changing the route design.
>>>>>>> theirs

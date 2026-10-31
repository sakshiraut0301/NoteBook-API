const form = document.querySelector("#note-form");
const titleInput = document.querySelector("#title");
const contentInput = document.querySelector("#content");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const message = document.querySelector("#message");
const formHeading = document.querySelector("#form-heading");
const saveButton = document.querySelector("#save-button");
const cancelButton = document.querySelector("#cancel-button");
let editingId = null;

function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? "error" : "";
}

async function loadNotes() {
  try {
    const response = await fetch("/api/notes");
    if (!response.ok) throw new Error("Could not load notes");
    const notes = await response.json();
    noteCount.textContent = notes.length;
    notesList.innerHTML = notes.length
      ? notes.map(noteTemplate).join("")
      : '<p class="empty">No notes yet.</p>';
  } catch (error) {
    showMessage(error.message, true);
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[character]));
}

function noteTemplate(note) {
  return `<article class="note">
    <h3>${escapeHtml(note.title)}</h3>
    <p>${escapeHtml(note.content || "No content")}</p>
    <span class="date">Created ${new Date(note.createdAt).toLocaleString()}</span><br>
    <button type="button" onclick="startEditing(${note.id})">Edit</button>
    <button type="button" class="danger" onclick="deleteNote(${note.id})">Delete</button>
  </article>`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const url = editingId ? `/api/notes/${editingId}` : "/api/notes";
  const method = editingId ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: titleInput.value, content: contentInput.value })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not save note");
    showMessage(editingId ? "Note updated." : "Note added.");
    resetForm();
    await loadNotes();
  } catch (error) {
    showMessage(error.message, true);
  }
});

async function startEditing(id) {
  const response = await fetch(`/api/notes/${id}`);
  const note = await response.json();
  editingId = id;
  titleInput.value = note.title;
  contentInput.value = note.content;
  formHeading.textContent = "Edit note";
  saveButton.textContent = "Save changes";
  cancelButton.classList.remove("hidden");
  titleInput.focus();
}

async function deleteNote(id) {
  const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
  if (!response.ok) return showMessage("Could not delete note", true);
  showMessage("Note deleted.");
  await loadNotes();
}

function resetForm() {
  editingId = null;
  form.reset();
  formHeading.textContent = "Add a note";
  saveButton.textContent = "Add note";
  cancelButton.classList.add("hidden");
}

cancelButton.addEventListener("click", resetForm);
loadNotes();

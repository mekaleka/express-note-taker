const express = require("express");
const uuid = require("uuid").v4;
const path = require("path");
const logger = require("morgan");
const fs = require("fs");
const app = express();

// var userNotes = require("db/db.js")
const PORT = process.env.PORT || 8080;
var dataNotes = [];
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(logger("dev"));

// API Routes
app.get("/api/notes", function(req, res) {
  fs.readFile("db/db.json", "utf8", function(err, data) {
    dataNotes = [].concat(JSON.parse(data));
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", function(req, res) {
  const newNote = { id: uuid(), ...req.body };
  // var newData = [...dataNotes, newNote]
  dataNotes.push(newNote);
  // res.redirect
  fs.writeFile("db/db.json", JSON.stringify(dataNotes), function(
    err,
    data
  ) {
    console.log(err, data);
    res.send(newNote);
  });
});

app.delete("/api/notes/:id", function(req, res) {
  var note = dataNotes.find(i => i.id === req.params.id);
  if (!note) return res.send("note not found");
  var index = dataNotes.indexOf(note);
  dataNotes.splice(index, 1);
  // dataNotes => dataNotes.filter (i => i.id != req.params.id)
  fs.writeFile("db/db.json", JSON.stringify(dataNotes), function(
    err,
    data
  ) {
    console.log(err, data);
    res.send(true);
  });
});

// HTML Routes
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

//Requireing dependencies
const express = require("express");
//uuid is the unique identifier for creating the unique id.  
const uuid = require("uuid").v4;
//Used for handling and transforming file paths. 
const path = require("path");
//Logger allows dev to see traffic coming and going. 
const logger = require("morgan");
//responsible for all asynchronous and synchronous file operations.  
const fs = require("fs");
//Uses callback funtions (req, res) and renders html elements based on passing arguments. 
const app = express();

const PORT = process.env.PORT || 8080;
var dataNotes = [];

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(logger("dev"));

// API Routes - gets the file from index.js and reads it with fs.readfile.
app.get("/api/notes", function(req, res) {
  fs.readFile("db/db.json", "utf8", function(err, data) {
    //Concatenates dataNotes to the array.
    dataNotes = [].concat(JSON.parse(data));
    res.json(JSON.parse(data));
  });
});
// Returns the API notes and pushes to to the newNote array.
app.post("/api/notes", function(req, res) {
  const newNote = { id: uuid(), ...req.body };
  dataNotes.push(newNote);
  fs.writeFile("db/db.json", JSON.stringify(dataNotes), function(
    //call back function for when data is loaded .
    err,
    data
  ) {
    console.log(err, data);
    //sends the response to newNote
    res.send(newNote);
  });
});
//function that returns a response of "note not found" if dataNotes does not contain a note.
app.delete("/api/notes/:id", function(req, res) {
  //if dataNotes
  var note = dataNotes.find(i => i.id === req.params.id);
  if (!note) return res.send("note not found");
  var index = dataNotes.indexOf(note);
  dataNotes.splice(index, 1);
  fs.writeFile("db/db.json", JSON.stringify(dataNotes), function(err, data) {
    console.log(err, data);
    res.send(true);
  });
});

// HTML Routes
app.get("/notes", function(req, res) {
  //function requests a response to get a string from notes.
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
//
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
//listens for an assigned port otherwise port 8080 defined at the top.
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

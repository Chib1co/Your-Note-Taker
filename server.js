// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
 
// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

let noteData = [];


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname + "/public")));


// Basic route
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

//api call  
app.get('/api/notes', function(err, res){
  try{
    // reads the notes from json file
    noteData = fs.readFileSync("./db/db.json", "utf8");
    // parse it so notesData is an array of objects
    noteData = JSON.parse(noteData);
    console.log('working')

  }catch(err){
    console.log('error')
  }
  res.json(noteData)
});


// writes the new note to the json file
app.post("/api/notes", function(req, res) {
  try {
    // reads the json file
    noteData = fs.readFileSync("./db/db.json", "utf8");
    console.log(noteData);

    // parse the data to get an array of objects
    noteData = JSON.parse(noteData);
    // Set new notes id
    req.body.id = noteData.length;
    // add the new note to the array of note objects
    noteData.push(req.body); // req.body - user input
    // make it string(stringify)so you can write it to the file
    noteData = JSON.stringify(noteData);
    // writes the new note to file
    fs.writeFile("./db/db.json", noteData, "utf8", function(err) {
      // error handling
      if (err) throw err;
    });
    // changeit back to an array of objects & send it back to the browser(client)
    res.json(JSON.parse(noteData));

    // error Handling
  } catch (err) {
    throw err;
    console.error(err);
  }
});


// Delete a note
app.delete("/api/notes/:id", function(req, res) {
  try {
    //  reads the json file
    noteData = fs.readFileSync("./db/db.json", "utf8");
    // parse the data to get an array of the objects
    noteData = JSON.parse(noteData);
    // delete the old note from the array on note objects
    noteData = noteData.filter(function(note) {
      return note.id != req.params.id;
    });
    // make it string(stringify)so you can write it to the file
    noteData = JSON.stringify(noteData);
    // write the new note to the file
    fs.writeFile("./db/db.json", noteData, "utf8", function(err) {
      // error handling
      if (err) throw err;
    });

    // change it back to an array of objects & send it back to the browser (client)
    res.send(JSON.parse(noteData));

    // error handling
  } catch (err) {
    throw err;
    console.log(err);
  }
});

  // Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

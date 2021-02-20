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
app.use(express.static(path.join(__dirname, "/public")));


// Basic route that sends the user first to the AJAX Page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public', 'notes.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public','index.html')));

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

// Create New notes - takes in JSON input
// app.post('/api/notes', (req, res) => {
//     // req.body hosts is equal to the JSON post sent from the user
//     // This works because of our body parsing middleware
//     const newCharacter = req.body;
  
//     // Using a RegEx Pattern to remove spaces from newCharacter
//     // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
//     newCharacter.routeName = newCharacter.name.replace(/\s+/g, '').toLowerCase();
//     console.log(newCharacter);
  
//     characters.push(newCharacter);
//     res.json(newCharacter);
//   });

  // Starts the server to begin listening

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

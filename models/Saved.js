var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SavedSchema = new mongoose.Schema({
    title: String,
    summary: String,
    url: String
});

// create the Favorites model using the NewsSchema
var Saved = mongoose.model('Saved', SavedSchema);

// export the Favorites model
module.exports = Saved;
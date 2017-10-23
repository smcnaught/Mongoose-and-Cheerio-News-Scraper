var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FavoriteSchema = new mongoose.Schema({
    title: String,
    summary: String
});

// create the Favorites model using the NewsSchema
var Favorite = mongoose.model('Favorites', FavoriteSchema);

// export the Favorites model
module.exports = Favorite;
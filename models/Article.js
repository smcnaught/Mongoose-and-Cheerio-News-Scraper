var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NewsSchema = new mongoose.Schema({
    title: String,
    summary: String
});

// create the Article model using the NewsSchema
var Article = mongoose.model('Article', NewsSchema);

// export the Articles model
module.exports = Article;
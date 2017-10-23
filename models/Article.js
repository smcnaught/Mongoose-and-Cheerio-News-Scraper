var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new mongoose.Schema({
    title: String,
    summary: String
});

// create the Article model using the NewsSchema
var Article = mongoose.model('Article', ArticleSchema);

// export the Articles model
module.exports = Article;
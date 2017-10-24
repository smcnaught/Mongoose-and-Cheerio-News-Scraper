const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new mongoose.Schema({
    title: String,
    summary: String,
    url: String
});

// create the Article model using the NewsSchema
const Article = mongoose.model('Article', ArticleSchema);

// export the Articles model
module.exports = Article;
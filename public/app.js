$(document).ready(function () {
    $('#openModal').click(function () {
        $('.modal').modal('show');
        $('body').removeClass("modal-open");
    })

    function displayResults(articles) {
        $(".mainContent").empty();

        articles.forEach(function (articles) {
            $(".mainContent").append(

                "<div class='row titleAndButton'><div class='col'><h1><span class='articleTitle'>"
                + articles.title +
                "</span><button class='btn btn-success btnSave'>SAVE ARTICLE</button></h1></div></div><div class='row'><div class='col-xs-12'><p class='summary'>"
                + articles.summary +
                "</p></div></div>"

            );
        });
    }

    function displayFavorites(favorites) {
        favorites.forEach(function (favorites) {
            $('.favorites').append(
                "<div class='row titleAndButton'><div class='col'><h1><span class='articleTitle'>"
                + favorites.title +
                "</span></h1></div></div><div class='row'><div class='col-xs-12'><p class='summary'>"
                + favorites.summary +
                "</p></div></div>"
            );
        });
    }

    $.getJSON("/all", function (data) {
        displayResults(data);
    });

    // When the user clicks "Scrape New Articles", display the articles from NYT
    $('#scraper').on("click", function () {
        $.getJSON("/scrape", function (data) {
            displayResults(data);
        });
    });

    // When the user clicks "Save Article", save their article to the db. 
    $('.mainContent').on("click", '.btnSave', function () {
        console.log('This article will be saved to your articles!');
        console.log($('.btnSave').html());
        $.getJSON("/favorite", function(data){
            displayFavorites(data);
        });
    });

});
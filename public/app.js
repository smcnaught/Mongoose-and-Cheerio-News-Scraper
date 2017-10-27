$(document).ready(function () {
    // Function that runs when a user clicks the "save article" button.
    function articleSave(mythis) {
        // get the data-id attribute we assigned initially.
        var articleBeingSaved = mythis.data();
        console.log('im article save and this is the the btn data id', articleBeingSaved);

        // changed the intial value of saved=false to true.
        articleBeingSaved.saved = true;

        // Using an ajax put method.
        $.ajax({
            method: "PUT",
            url: "/save",
            data: articleBeingSaved
        }).then(function (data) {
            if (data.ok) {
                // location.reload();
                console.log('The update worked - your article has been saved');
            }
        });
    }


    $('#openModal').click(function () {
        $('.modal').modal('show');
        $('body').removeClass("modal-open");
    })

    function displayResults(articles) {

        articles.forEach(function (articles) {
            $(".mainContent").append(

                "<div class='row titleAndButton'><div class='col'><h1><span class='articleTitle'><a href='"
                + articles.url +
                "' target='_blank' class='titleHover'>"
                + articles.title +
                "</a></span><button class='btn btn-success btnSave' data-id="
                + articles._id +
                ">SAVE ARTICLE</button></h1></div></div><div class='row'><div class='col-xs-12'><p class='summary'>"
                + articles.summary +
                "</p></div></div>"

            );
        });
    }

    function displaySaved(savedArticles) {
        savedArticles.forEach(function (savedArt) {
            console.log(savedArt);
            $('.savedContent').append(
                "<div class='row titleAndButton'><div class='col'><h1><span class='articleTitle'><a href='"
                + savedArt.url +
                "' target='_blank'>"
                + savedArt.title +
                "</a></span><button class='btn btn-success btnDelete'>DELETE FROM SAVED</button><button class='btn btn-success btnNotes'>ARTICLE NOTES</button></h1></div></div><div class='row'><div class='col-xs-12'><p class='summary'>"
                + savedArt.summary +
                "</p></div></div>"
            );
        });
    };


    $.getJSON("/all", function (data) {
        displayResults(data);
    });

    // $.getJSON('/saved', function(data){
    //     displaySaved(data);
    // });

    // When the user clicks "Scrape New Articles", display the articles from NYT
    $('#scraper').on("click", function () {
        $.getJSON("/scrape", function (data) {
            displayResults(data);
        });
    });

    // When the user clicks "my saved articles, go to the page with their saved articles from the db."
    $('#savedBtn').on("click", function () {
        console.log("data");
        $.get("/getSavedArticles", function (data) {
            displaySaved(data);
        });
    });


    // When the user clicks "Save Article", save their article to the db. 
    $('.mainContent').on("click", '.btnSave', function () {
        var mythis = $(this);
        articleSave(mythis);
    });
});
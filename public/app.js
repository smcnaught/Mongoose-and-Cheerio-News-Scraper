$(document).ready(function () {
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

    function displaySaved(savedArt) {
        savedArt.forEach(function (savedArt) {
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

    // Function that runs when a user clicks the "save article" button.
    function articleSave(){
    // get the data-id attribute we assigned initially.
    var articleBeingSaved = $('.btnSave').data();

    // changed the intial value of saved=false to true.
    articleBeingSaved.saved = true;

    // Using an ajax put method.
    $.ajax({
      method: "PUT",
      url: "/save",
      data: articleBeingSaved
    }).then(function(data) {
      // If successful, mongoose will send back an object containing a key of "ok" with the value of 1
      // (which casts to 'true')
      if (data.ok) {
        // location.reload();
        console.log('The update worked - your article has been saved');
      }
    });
    }

    $.getJSON("/all", function (data) {
        displayResults(data);
    });

    $.getJSON('/saved', function(data){
        displaySaved(data);
    });

    // When the user clicks "Scrape New Articles", display the articles from NYT
    $('#scraper').on("click", function () {
        $.getJSON("/scrape", function (data) {
            displayResults(data);
        });
    });

    // When the user clicks "my saved articles, go to the page with their saved articles from the db."
    $('.nav').on("click", '#savedBtn', function (){
        $.getJSON("/saved", function (data) {
            displaySaved(data);
        });
    });    
    
    
    // When the user clicks "Save Article", save their article to the db. 
    $('.mainContent').on("click", '.btnSave', function () {
        articleSave();
        console.log('This article will be saved to your articles!');
        // console.log($('.btnSave'));
        // console.log($('.btnSave').data({ depth: 1}));
        // console.log($('.btnSave').data());
        
    });



});
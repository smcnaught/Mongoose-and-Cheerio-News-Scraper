$(document).ready(function () {
    // Function that runs when a user clicks the "save article" button.
    function articleSave(mythis) {
        // get the data-id attribute we assigned initially.
        var articleBeingSaved = mythis.data();
        
        // changed the intial value of saved=false to true.
        articleBeingSaved.saved = true;
        
        // Using an ajax put method.
        $.ajax({
            method: "PUT",
            url: "/save",
            data: articleBeingSaved
        }).then(function (data) {
            if (data.ok) {
                console.log('Your article has been saved');
            }
        });
    }
    
    
    // Function that runs when a user clicks the "delete article" button.
    function articleDelete(mythis) {
        // get the data-id attribute we assigned initially.
        var articleBeingDeleted = mythis.data();
        
        // changed the saved value in the db to false.
        articleBeingDeleted.saved = false;
        
        // Using an ajax put method.
        $.ajax({
            method: "PUT",
            url: "/delete",
            data: articleBeingDeleted
        }).then(function (data) {
            if (data.ok) {
                console.log('Your article has been deleted');
            }
        });
    }
    
    // Function that runs when a user clicks the "Article Notes" button.
    function addNote(mythis, userNote) {
        // get the data-id attribute we assigned initially.
        var addingNote = mythis.data();
    
        // Add a note to the database.
        addingNote.note = userNote;
    
        // Using an ajax put method.
        $.ajax({
            method: "PUT",
            url: "/addNote",
            data: addingNote
        }).then(function (data) {
            if (data.ok) {
                console.log('Your note has been added');
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
        $('.deleteOnSave').empty();
        savedArticles.forEach(function (savedArt) {
            $('.savedContent').append(
                "<div class='row titleAndButton'><div class='col'><h1><span class='articleTitle'><a href='"
                + savedArt.url +
                "' target='_blank'>"
                + savedArt.title +
                "</a></span><button class='btn btn-danger savedBtns btnDelete' data-id="
                + savedArt._id +
                ">DELETE FROM SAVED</button><button class='btn btn-success savedBtns btnNotes' data-id="
                + savedArt._id +
                ">ARTICLE NOTES</button></h1></div></div><div class='row'><div class='col-xs-12'><p class='summary'>"
                + savedArt.summary +
                "</p></div></div>"
            );
        });
    };


    $.getJSON("/all", function (data) {
        displayResults(data);
    });

    // When the user clicks "Scrape New Articles", display the articles from NYT
    $('#scraper').on("click", function () {
        $.getJSON("/scrape", function (data) {
            displayResults(data);
        });
    });

    // When the user clicks "my saved articles, go to the page with their saved articles from the db."
    $('#savedBtn').on("click", function () {
        $.get("/getSavedArticles", function (data) {
            displaySaved(data);
        });
    });

    $.get("/getSavedArticles", function (data) {
        displaySaved(data);
    });

    // When the user clicks "Save Article", save their article to the db. 
    $('.mainContent').on("click", '.btnSave', function () {
        var mythis = $(this);
        articleSave(mythis);
    });

    // When the user clicks "DELETE FROM SAVED", change saved status to false.. 
    $('.savedContent').on("click", '.btnDelete', function () {
        var mythis = $(this);
        articleDelete(mythis);
    });

    // When the user clicks "DELETE FROM SAVED", change saved status to false.. 
    $('.savedContent').on("click", '.btnNotes', function () {
        var userNote = prompt("Please enter your note"); 
        console.log(userNote);
        var mythis = $(this);
        addNote(mythis, userNote);
    });


});
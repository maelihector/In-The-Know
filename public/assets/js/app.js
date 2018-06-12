$(document).foundation()

$(function () {

  // Start of sticky header js
  $(window).scroll(function () {
    var winTop = $(window).scrollTop();
    if (winTop >= 30) {
      $("body").addClass("sticky-shrinknav-wrapper");
    } else {
      $("body").removeClass("sticky-shrinknav-wrapper");
    }
  });
//  End of sticky header js

// Scrape button to scrape new unique articles from bbc
$(".new-scrape").on("click", function (event){
  $.ajax("/scrape", {
    method: "GET"
  }).then(
    function () {
      location.reload();
    }
  )
});

  var savedHeadline = $(this).data("id");
  console.log(savedHeadline);

  $(".change-save").on("click", function (event) {
    var _id = $(this).data("id");
    console.log(_id);
    var isSaved = $(this).data("newsave");
    console.log(isSaved);

    var savedHeadline = {
      savedHeadlines: $(document).val().trim()
    };

    console.log(savedHeadline);

 

    if (isSaved === "true") {
      $.ajax("/saveHeadline/" + _id, {
        method: "GET",
        data: newHeadline
      }).then(
        function () {
          console.log("added headline to user's 'savedHeadlines")
          location.reload();
        }
      );

    } else {
      console.log("User did not save an article")
    }
  });


// function changeImageUrl(result) {

  // var unusableUrl = "https://ichef.bbci.co.uk/news/{width}/cpsprodpb/16F90/production/_101969049_mediaitem101969048.jpg";
  // var replace = /{width}/gi;
  // var usableUrl = unusableUrl.replace(replace, '250');
  
  // console.log(usableUrl);
// }

// changeImageUrl(); 
// https://ichef.bbci.co.uk/news/250/cpsprodpb/16F90/production/_101969049_mediaitem101969048.jpg

});
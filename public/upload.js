// let title = $(".recipe-title-edit").val();
// let summary = $(".recipe-summary-edit").val();
// let instructions = $(".recipe-instructions-edit").val();
// let preptime = $(".preptime").val();
// let servings = $(".serving-quantity").val();
// let difficulty = $(".recipe-difficulty-edit").val();

// "use strict";

// $(function () {
//   // Delete Review
// //   $(".upload-del-btn").on("click", ".remove", (event) => {
//   $(".upload-del-btn").on("click", (event) => {
//     // grab the id of the note
//     let noteId = $(event.currentTarget).data("id");
//     console.log("delete recipe");
//     // save the element
//     save(event.currentTarget);
//     // call the delete method
//     axios
//       .delete(`aaaaaa`)
//       .then((response) => {
//         // respond with the notes
//         loadNotes(response.data);
//       })
//       .catch((error) => {
//         save(event.currentTarget);
//         console.log("Error", error);
//       });
//   });
// });

$(document).on("click", ".upload-del-btn", (event) => {
  $(".upload-del-btn").on("click", (event) => {
    // grab the id of the note
    let id = $(event.currentTarget).attr("id");
    let recipeid = $();
    console.log("delete recipe");
    console.log(id);

    // call the delete method

    // axios
    //     .delete(`/upload-recipe-remove/${id}`)
    //     .catch((error) => {
    //         console.log("Error", error);
    //     });

    $.ajax({
      type: "DELETE",
      url: `/upload/upload-recipe-remove/${id}`,
      success: function () {
        console.log("delete success");
      },
    }).done(
      setTimeout(() => {
        window.location.reload();
      }, 200)
    );
  });
});

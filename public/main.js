"use strict";

$(function () {
  //corejs-typeahead
  const recipes = new Bloodhound({
    datumTokenizer: (datum) => Bloodhound.tokenizers.whitespace(datum.value),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url:
        "https://api.spoonacular.com/recipes/complexSearch?query=%QUERY&apiKey=ba0539d66f294cfe98a6984e24c8f8d6",
      // apiKey=ba5aba2ccf0049008995c74dfc10d62a

      wildcard: "%QUERY",
      // Map the remote source JSON array to a JavaScript object array
      filter: (recipes) => {
        console.log(recipes);
        return $.map(recipes.results, function (recipe) {
          return {
            value: recipe.title,
            id: recipe.id,
            image: `https://spoonacular.com/recipeImages/${recipe.id}-312x231.jpg`,
          };
        });
      },
    },
  });

  // Initialize the Bloodhound suggestion engine
  recipes.initialize();

  // Instantiate the Typeahead UI
  $(".typeahead").typeahead(
    {
      minLength: 3,
    },
    {
      displayKey: "value",
      source: recipes.ttAdapter(),
      templates: {
        suggestion: Handlebars.compile(
          "<p style='padding:6px'><img src='{{image}}' height='100px' width='100px'> <strong>{{value}}</strong></b></p>"
        ),
        footer: Handlebars.compile("<b>Searched for '{{query}}'</b>"),
      },
    }
  );

  $(".typeahead").on("typeahead:select", function (event, suggestion) {
    console.log(suggestion);
    console.log(suggestion.value);
    window.location.href = "/recipe/" + suggestion.id;
  });
});

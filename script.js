'use strict'

//constant query parameters for API request
const key = "8486d9ea749948cda3e57cfa94dab980";
const searchURL = 'https://api.spoonacular.com/recipes/findByIngredients';


//function to watch for the recipe search form to be submitted
function formSubmit(){
    $('form').submit(event => {
        event.preventDefault();
        console.log("test");
        var checkedItems = []; 
        $('.foodSelect:checked').each(function(){
            checkedItems.push($(this).val());
        });
        //console.log(checkedItems);
        findRecipe(checkedItems);
    });
}

//function to make call to the "spoonacular" API
function findRecipe(checkedItems){
    const params = {
        ingredients: checkedItems.join(),
        number: "5",
        limitLicense: "true",
        ranking: "1",
        ignorePantry: "true",
        apiKey: key
    };
    //console.log(params);
    const queryString = formatParams(params);
    const url = searchURL + '?' + queryString;
    //console.log(url);

    fetch(url)
    .then(response => {
        if (response.ok){
            return response.json();
        }
        throw new Error(response.statusText)
    })
    .then(responseJson => displayResults(responseJson))
    .catch(error => alert('Something went wrong. Try again.'));
}

//Update the DOM with the recipe search results
function displayResults(response){
    console.log(response);
    $('#results-list').empty();
    $('#results').removeClass('hidden');
    for (let i=0; i<response.length; i++){
        var title = response[i].title.toLowerCase().replace(/\s/g,'-');
        var linkTitle = "https://spoonacular.com/" + title + "-" + response[i].id;
        //Get a list of selected ingredients used in the recipe
        var usedIngredients = Object.keys(response[i].usedIngredients).map(x => `${response[i].usedIngredients[x].name}`)
        //Get a list of missing ingredients used in the recipe
        var missedIngredients = Object.keys(response[i].missedIngredients).map(x => `${response[i].missedIngredients[x].name}`)
        console.log(missedIngredients);
        $('#results-list').append(
            `<li>
                <h3>${response[i].title}</h3>
                <p>Link to Recipe:
                <a href="${linkTitle}" target="_blank">${linkTitle}</a><br>
                <p>Used ingredients: <b>${usedIngredients.join(", ")}</b></p>
                <p>Ingredients still needed: <b>${missedIngredients.join(", ")}</b></p> 
                <img src=${response[i].image}></p>
            </li>`
        )
        

    }

}


//function to format the query parameters into the required string to make the API call
function formatParams(params){
    const query = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return query.join('&');
}

//function to reset selections and results
function resetPage(){
    $("button.js-reset").on("click", function(event){
        event.preventDefault();
        $('#results').addClass('hidden');
        console.log("reset");
        $('input[type="checkbox"]:checked').prop('checked',false);
    })
}

//call function
function callFunctions(){
    formSubmit();
    resetPage();
}

$(callFunctions);
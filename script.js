'use strict'

//constant query parameters for API request
const key = "8486d9ea749948cda3e57cfa94dab980";
const searchURL = 'https://api.spoonacular.com/recipes/findByIngredients';
const STORE = [];

//function to watch for the recipe search form to be submitted
function formSubmit() {
    $('form').submit(event => {
        event.preventDefault();
        var checkedItems = [];
        $(".food option:selected").each(function () {
            checkedItems.push($(this).val());
        });
        console.log(checkedItems);
        var num = $("#num").val();
        if (!checkedItems.length) {
            $("#error").removeClass("hidden");
        }
        else {
            $("#error").addClass("hidden");
            findRecipe(checkedItems, num);
        }
    });
}

//function to make call to the "spoonacular" API
function findRecipe(checkedItems, num) {
    const params = {
        ingredients: checkedItems.join(),
        number: num,
        limitLicense: "true",
        ranking: "1",
        ignorePantry: "true",
        apiKey: key
    };
    const queryString = formatParams(params);
    const url = searchURL + '?' + queryString;
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText)
        })
        .then(responseJson => displayResults(responseJson))
        .catch(error => alert('Something went wrong. Try again.'));
}

//Update the DOM with the recipe search results
function displayResults(response) {
    console.log(response);
    $('#results-list').empty();
    $('#results').removeClass('hidden');

    response.forEach(recipe => {
        //Get a list of selected ingredients used in the recipe
        var usedIngredients = Object.keys(recipe.usedIngredients).map(x => `${recipe.usedIngredients[x].name}`)
        //Get a list of missing ingredients used in the recipe
        var missedIngredients = Object.keys(recipe.missedIngredients).map(x => `${recipe.missedIngredients[x].name}`)
        //call get recipe information endpoint url which will return additional information based on the recipe ID
        var newURL = `https://api.spoonacular.com/recipes/${recipe.id}/information` + `?apiKey=${key}`
        fetch(newURL)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText)
            })
            .then(responseJson =>
                $('#results-list').append(
                    `<li class="recipe">
                        <h3>${recipe.title}</h3>
                        <p>Link to Recipe:
                        <a href="${responseJson.sourceUrl}" target="_blank">Here</a><br>
                        <p>Used ingredients: <b>${usedIngredients.join(", ")}</b></p>
                        <p>Ingredients still needed: <b>${missedIngredients.join(", ")}</b></p>
                        <p>Time to Cook: <b>${responseJson.readyInMinutes} mins</b></p> 
                        <p>Servings: <b>${responseJson.servings}</b></p>
                        <img src=${recipe.image}>
                    </li>`
                )
            )
            .catch(error => alert('Something went wrong. Try again.'));
    })
}


//function to format the query parameters into the required string to make the API call
function formatParams(params) {
    const query = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return query.join('&');
}

//function to reset selections and results
function resetPage() {
    $("button.js-reset").on("click", function (event) {
        $('#results').addClass('hidden');
        $('#error').addClass('hidden');
        $('#selection-review').empty();
        STORE.length = 0;
    })
}

//Section function
function onSelect() {
    $('select').on('click keypress', function (event) {
        if(checkClick(event) === true){
            console.log("clicked")
            var selection = this.value;
        for (let i = 0; i < STORE.length; i++){
            if(STORE[i]===selection){
                STORE.splice(i,1);
                console.log(STORE)
                $(`#${selection}`).remove();
                return 
            }
        }
        STORE.push(selection);
                var formatSelection = selection.replace(/-/g, " ");
                console.log(STORE);
                $("#selection-review").append(
                   `<li id="${selection}">${formatSelection}</li>`);
        }
        
    })
}

function checkClick(event){
    if(event.type === 'click'){
        return true;
    }
    else if(event.type === 'keypress' && event.keyCode === 32){
        return true;
    }
    else{
        return false;
    }
}


//call function
function callFunctions() {
    formSubmit();
    resetPage();
    onSelect();
}

$(callFunctions);
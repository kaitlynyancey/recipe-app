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
        number: "10",
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
        //console.log(linkTitle);
        $('#results-list').append(
            `<li>
                <h3>${response[i].title}</h3>
                <a href="${linkTitle}">${linkTitle}</a><br>
                <img src=${response[i].image}>
            </li>`
        )

    }

}

//function to get the recipe details for each id
/*function getRecipeLink(id){
    console.log(id);
    return fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${key}`)
    .then(response => {
        if (response.ok){
            return response.json();
        }
        throw new Error(response.statusText)
    })
    .then(responseJson => console.log(responseJson.spoonacularSourceUrl))
    .catch(error => alert('Something went wrong. Try again.'));
}
    */

//function to format the query parameters into the required string to make the API call
function formatParams(params){
    const query = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return query.join('&');
}

//call function
$(formSubmit);
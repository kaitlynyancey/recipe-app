'use strict'

//function to watch for the recipe search form to be submitted
function formSubmit(){
    $('form').submit(event => {
        event.preventDefault();
        console.log("test");
        var checkedItems = []; 
        $('.foodSelect:checked').each(function(){
            checkedItems.push($(this).val());
        });
        console.log(checkedItems);
    })
}

//call function
$(formSubmit);
/*index of selected li in autocomplete menu*/
var currentFocus;

/*the autocomplete function takes two arguments,
the text field element and an array of possible autocompleted values:*/
function autocomplete(inp, arr) {

    var a, b, i, val = inp.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
        return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", inp.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    inp.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].Title.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].Title.substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].Title.substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i].Title + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                addLi();
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
        }
    }


    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}

/*gets data list from from open API*/
async function getMovies(searchData) {
    const response = await fetch('http://www.omdbapi.com/?s=' + searchData + '&apikey=1b5c523c');
    const json = await response.json();
    /*console.log(json);*/
    return json;

}

function clearInput() {
    var el = document.getElementById('clear-input');

    el.addEventListener('click', function() {
        var inputEl = document.getElementById('myInput');
        inputEl.value = "";

        hideIfValueEmpty(inputEl, el);

    }, false);

}

function addLi() {
    var ul = document.getElementById("search-list");
    var li = document.createElement("li");
    var divBox = addDiv();

    li.appendChild(divBox);
    ul.appendChild(li);

}

/*creates div for Search History*/
function addDiv() {

    var divBox = document.createElement('div');

    divBox.className = 'row div-box';

    var divText = document.createElement('div');

    divText.className = 'col-12 col-s-12 div-text';

    var inputEl = document.getElementById('myInput');
    //Remove HTML from text
    inputEl.value = inputEl.value.replace(/<\/?[^>]+(>|$)/g, "");

    divText.innerHTML = inputEl.value;

    var divDate = document.createElement('div');

    divDate.className = 'col-12 col-s-12div-date';
    divDate.innerHTML = date();

    var divDelete = document.createElement('div');

    divDelete.className = 'col-12 col-s-12 div-delete';

    divDelete.innerHTML = "x";

    divBox.appendChild(divText);
    divBox.appendChild(divDate);
    divBox.appendChild(divDelete);

    return divBox;

}

function date() {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    return today;
}



function onInputChange() {
    const inputEl = document.getElementById('myInput');
    const clearEl = document.getElementById('clear-input');

    hideIfValueEmpty(inputEl, clearEl);

    inputEl.addEventListener('input', function() {
        update(this.value);
        hideIfValueEmpty(this, clearEl);
    });


    inputEl.addEventListener("keypress", function(e) {

        currentFocus = -1;

        var key = e.which || e.keyCode || 0;

        if (key === 13) {

            addLi();
        }

    });

}

function hideIfValueEmpty(inputEl, clearEl) {

    if (!inputEl.value) {
        clearEl.style.display = 'none';
    } else if (inputEl.value && clearEl.style.display === 'none') {
        clearEl.style.display = 'block';
    }

}

function deleteHistory() {

    document.body.addEventListener('click', function(event) {
        if (event.srcElement.className == 'col-12 col-s-12 div-delete') {
            event.srcElement.parentNode.parentNode.remove();
        };
    });

}

function clearAllHistory() {
    var el = document.getElementById('clear-history');

    el.addEventListener('click', function() {
        var searchListEl = document.getElementById('search-list');
        while (searchListEl.firstChild) {
            searchListEl.removeChild(searchListEl.firstChild);
        }

    }, false);

}

function keypress() {


    /*execute a function presses a key on the keyboard:*/
    document.body.addEventListener('keydown', function(e) {
        if (e.srcElement.id == 'myInput') {

            var x = document.getElementById(e.srcElement.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {

                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();

                if (x !== null) {
                    if (x.length !== undefined && currentFocus > -1) {
                        /*and simulate a click on the "active" item:*/
                        if (x) x[currentFocus].click();
                    } else {
                        addLi();
                    }

                } else {
                    addLi();
                }

            }

        };
    });

}


function addActive(x) {


    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
}

function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
    }
}

function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    var inp = document.getElementById("myInput")
    for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
}



function start() {
    clearInput();
    deleteHistory();
    onInputChange();
    clearAllHistory();
    keypress();
}

window.onload = start;


async function update(searchData) {

    //Remove HTML from text
    searchData = searchData.replace(/<\/?[^>]+(>|$)/g, "");

    var jsonData = await getMovies(searchData);
    var movies = jsonData;
    if (movies['Response'] !== "False") {
        autocomplete(document.getElementById("myInput"), movies['Search']);
    }



}

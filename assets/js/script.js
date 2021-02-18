const API_KEY = "r7eSqXkDRjn7qI7VWTkmReizoGM";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"))

document.getElementById("submit").addEventListener("click", e => processForm(e));
document.getElementById("status").addEventListener("click", e => getStatus(e));

/**
 * Returns a FormData object with the correct options format
 * @function processOptions
 * @param {FormData} form 
 */
function processOptions(form) {
    let optArray = [];

    for (let e of form.entries()) {
        if (e[0] === "options") {
            optArray.push(e[1]);
        }
    }

    form.delete("options");
    
    if (optArray.length > 0) {
        form.append("options", optArray.join())
    }
    
    return form
}

/**
 * Performs a GET request to the API URL and calls the
 * displayStatus function
 * @function getStatus
 * @param {event object} e 
 */
async function getStatus(e) {

    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }

}

/**
 * Performs a POST request to the API URL with the form contents
 * and calls the displayErrors function
 * @function processForm
 * @param {event object} e 
 */
async function processForm(e) {

    const form = processOptions(new FormData(document.getElementById("checksform")));

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    });
        
    const data = await response.json();
    
    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }

}

/**
 * Formats the returned JSON and displays the results
 * @function displayErrors
 * @param {json object} data 
 */
function displayErrors(data) {
    
    let results = "";

    let heading = `JSHint Results for ${data.file}`;
    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}:</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

/**
 * Formats the returned JSON and displays the results
 * @function displayStatus
 * @param {json object} data 
 */
function displayStatus(data) {

    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();

}
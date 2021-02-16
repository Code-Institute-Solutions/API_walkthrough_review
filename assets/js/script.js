const API_KEY = "r7eSqXkDRjn7qI7VWTkmReizoGM";
const API_URL = "https://ci-jshint.herokuapp.com/api"

document.getElementById("submit").addEventListener("click", e => processForm(e));
document.getElementById("status").addEventListener("click", e => getStatus(e));

async function getStatus(e) {

    const queryString = `${API_URL}?api_key=${API_KEY}`;

    console.log(queryString);

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }

}

async function processForm(e) {

    const form = new FormData(document.getElementById("checksform"));

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form
    });
        
    const data = await response.json();
    
    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }

}

function displayErrors(data) {
    
    let results = "";

    let heading = `JSHint Results for ${data.file}`;
    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `
            results += `column <span class="column">${error.col}:</span></div>`
            results += `<div class="error">${error.error}</div>`
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    $('#resultsModal').modal("show");
}

function displayStatus(data) {

    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("status-content").innerHTML = results;
    $("#statusModal").modal("show");

}
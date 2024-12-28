let add = document.getElementById("addButton");
let addEntry = document.getElementById("addEntryButton");
let addTable = document.getElementById("addTable");
let transForm = document.getElementById("transForm")
let back = document.getElementById("backButton")
const rows = document.querySelectorAll("#transTable tbody .row");
const rowcols = document.querySelectorAll("#transTable tbody .row td");
let genre = document.getElementById("genre");

let expOrInc = document.getElementById("addExpense");

for (let i = 0; i < rows.length; i++) {
    rows[i].onmouseover = function() {
        rows[i].style.backgroundColor = "#fee368";
        rows[i].style.cursor = "pointer";
        const rowCells = rows[i].getElementsByTagName("td");
        for (let j = 0; j < rowCells.length; j++) {
            rowCells[j].style.backgroundColor = "transparent";
        }
    };

    rows[i].onmouseout = function() {
        rows[i].style.backgroundColor = "#FFD500";
        const rowCells = rows[i].getElementsByTagName("td");
        for (let j = 0; j < rowCells.length; j++) {
            rowCells[j].style.backgroundColor = "#FFD500";
        }
    };
}


add.onclick = function() {
    addEntry.style.display = "block";
    add.style.display = "none";
    addTable.style.display = "table-row-group";
    back.style.display = "block";
    transForm.reset();
}

back.onclick = function() {
    back.style.display = "none";
    addEntry.style.display = "none";
    add.style.display = "block";
    addTable.style.display = "none";
}

genre.onclick = function() {
    const genrevalue = genre.value === "−" ? "+" : "−";

    
    if (genrevalue === "−") {
        genre.classList.add("expense");
        genre.classList.remove("income");
    } else {
        genre.classList.add("income");
        genre.classList.remove("expense");
    }

    genre.value = genrevalue;
    document.getElementById("genreHidden").value = genrevalue;
}

transForm.onsubmit = function(){
    genre.removeAttribute("readonly");
};

genre.onmousedown = function(event) {
    event.preventDefault();
};
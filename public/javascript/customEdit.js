
function toggleType() {
    const typeInput = document.getElementById("typeToggle");
    const hiddenType = document.getElementById("genreHidden");

    if (typeInput.value === "−") {
        typeInput.value = "+";            
        hiddenType.value = "+";       
        typeInput.classList.add("income");
        typeInput.classList.remove("expense");
    } else {
        typeInput.value = "−";
        hiddenType.value = "−"; 
        typeInput.classList.add("expense");
        typeInput.classList.remove("income");
    }
}


function deleteTransaction(slug) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        fetch(`/deleteTransaction/${slug}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    window.location.href = '/transactions';
                } else {
                    alert('Failed to delete the transaction.');
                }
            });
    }
}


document.getElementById("typeToggle").onmousedown = function(event) {
    event.preventDefault();
};
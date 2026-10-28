// Henter statistik fra API'et og viser tallet på hjemmesiden
function getNumber(url, elementId) {
    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not fetch data");
            }
            return response.json();
        })
        .then(function (data) {

            // Viser tallet fra API'et i HTML
            document.querySelector("#" + elementId).textContent = data.total;
        })
        .catch(function (error) {
            console.log(error);
            document.querySelector("#" + elementId).textContent = "Error loading data";
        });
}


// Henter antal Pokémon fra databasen
getNumber("http://localhost:3000/stats/pokemon", "pokemonCount");

// Henter antal trainers fra databasen
getNumber("http://localhost:3000/stats/trainers", "trainerCount");

// Henter antal Pokémon som er tildelt til trainers
getNumber("http://localhost:3000/stats/assigned-pokemon", "assignedPokemonCount");


// Statistik 1: Viser fordelingen af Pokémon-typer
fetch("http://localhost:3000/stats/pokemon-types")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Could not fetch Pokémon types");
        }
        return response.json();
    })
    .then(function (data) {

        // Laver to lister til typer og antal
        const labels = [];
        const numbers = [];

        // Gennemgår data fra API'et
        data.forEach(function (row) {
            labels.push(row.primary_type);
            numbers.push(row.total);
        });

        // Laver et cirkeldiagram med Chart.js
        new Chart(document.querySelector("#pokemonTypeChart"), {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    label: "Number of Pokémon",
                    data: numbers
                }]
            }
        });
    })
    .catch(function (error) {
        console.log("Could not load Pokémon type chart:", error);
    });


// Statistik 2: Viser gennemsnitlig attack for hver Pokémon-type
fetch("http://localhost:3000/stats/average-attack")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Could not fetch average attack");
        }
        return response.json();
    })
    .then(function (data) {

        // Laver to lister til typer og gennemsnitlig attack
        const labels = [];
        const numbers = [];

        // Gennemgår data fra API'et
        data.forEach(function (row) {
            labels.push(row.primary_type);
            numbers.push(row.average_attack);
        });

        // Laver et søjlediagram med Chart.js
        new Chart(document.querySelector("#pokemonAttackChart"), {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Average attack",
                    data: numbers
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(function (error) {
        console.log("Could not load attack chart:", error);
    });

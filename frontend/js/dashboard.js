function getNumber(url, elementId) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            document.getElementById(elementId).textContent = data.total;
        })
        .catch(function (error) {
            console.log(error);
            document.getElementById(elementId).textContent = "Fejl";
        });
}

getNumber("http://localhost:3000/stats/pokemon", "pokemonCount");
getNumber("http://localhost:3000/stats/trainers", "trainerCount");
getNumber("http://localhost:3000/stats/assigned-pokemon", "assignedPokemonCount");


fetch("http://localhost:3000/stats/pokemon-types")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        const labels = [];
        const numbers = [];

        data.forEach(function (row) {
            labels.push(row.primary_type);
            numbers.push(row.total);
        });

        new Chart(document.getElementById("pokemonTypeChart"), {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    label: "Antal Pokémon",
                    data: numbers
                }]
            }
        });
    })
    .catch(function (error) {
        console.log("Kunne ikke hente type-diagram:", error);
    });


fetch("http://localhost:3000/stats/average-attack")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        const labels = [];
        const numbers = [];

        data.forEach(function (row) {
            labels.push(row.primary_type);
            numbers.push(row.average_attack);
        });

        new Chart(document.getElementById("pokemonAttackChart"), {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Gennemsnitlig attack",
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
        console.log("Kunne ikke hente attack-diagram:", error);
    });
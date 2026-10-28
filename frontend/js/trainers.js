// Henter elementerne fra HTML
const trainerList = document.querySelector("#trainerList");
const trainerPokemonList = document.querySelector("#trainerPokemonList");
const trainerMessage = document.querySelector("#trainerMessage");
const addMessage = document.querySelector("#addMessage");


// Henter alle trainers fra API'et
function getTrainers() {
    fetch("http://localhost:3000/trainers")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not fetch trainers");
            }
            return response.json();
        })
        .then(function (trainers) {

            // Fjerner den gamle liste
            trainerList.textContent = "";

            // Viser alle trainers på hjemmesiden
            trainers.forEach(function (trainer) {
                const li = document.createElement("li");

                li.textContent = trainer.trainer_id + ". " + trainer.trainer_name
                    + " | Age: " + trainer.age
                    + " | Hometown: " + trainer.hometown;

                // Når man klikker på en trainer, vises deres Pokémon
                li.addEventListener("click", function () {
                    getTrainerPokemon(trainer.trainer_id);
                });

                trainerList.appendChild(li);
            });
        })
        .catch(function (error) {
            console.log(error);
            trainerMessage.textContent = "Could not fetch trainers. Check that the backend is running.";
        });
}


// Henter en trainers Pokémon fra API'et
function getTrainerPokemon(id) {
    fetch("http://localhost:3000/trainers/" + id + "/pokemon")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not fetch Pokémon");
            }
            return response.json();
        })
        .then(function (pokemon) {

            // Fjerner den gamle Pokémon-liste
            trainerPokemonList.textContent = "";

            // Viser besked hvis traineren ikke har Pokémon
            if (pokemon.length === 0) {
                trainerPokemonList.textContent = "This trainer has no Pokémon yet.";
                return;
            }

            // Viser trainerens Pokémon
            pokemon.forEach(function (p) {
                const li = document.createElement("li");

                li.textContent = p.name + " - Type: " + p.primary_type;

                trainerPokemonList.appendChild(li);
            });
        })
        .catch(function (error) {
            console.log(error);
            trainerPokemonList.textContent = "Could not fetch Pokémon.";
        });
}


// Opretter en ny trainer når brugeren klikker på knappen
document.querySelector("#createButton").addEventListener("click", function () {

    // Henter værdier fra formularen
    const name = document.querySelector("#trainerName").value;
    const age = document.querySelector("#trainerAge").value;
    const hometown = document.querySelector("#trainerHometown").value;

    // Sender den nye trainer til API'et som JSON
    fetch("http://localhost:3000/trainers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            trainer_name: name,
            age: age,
            hometown: hometown
        })
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not create trainer");
            }
            return response.json();
        })
        .then(function (data) {

            // Viser besked når traineren er oprettet
            trainerMessage.textContent = "Trainer created successfully! ID: " + data.trainer_id;

            // Opdaterer listen med trainers
            getTrainers();
        })
        .catch(function (error) {
            console.log(error);
            trainerMessage.textContent = "Could not create trainer. Check the information.";
        });
});


// Tilføjer en Pokémon til en trainer
document.querySelector("#addButton").addEventListener("click", function () {

    // Henter værdierne fra formularen
    const trainerId = document.querySelector("#trainerId").value;
    const pokemonId = document.querySelector("#pokemonId").value;

    // Sender Pokémon-nummeret til API'et som JSON
    fetch("http://localhost:3000/trainers/" + trainerId + "/pokemon", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pokedex_number: pokemonId
        })
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not add Pokémon");
            }
            return response.json();
        })
        .then(function (data) {

            // Viser besked når Pokémon er tilføjet
            addMessage.textContent = "Pokémon added successfully!";

            // Opdaterer trainerens Pokémon-liste
            getTrainerPokemon(trainerId);
        })
        .catch(function (error) {
            console.log(error);
            addMessage.textContent = "Could not add Pokémon. Check the IDs.";
        });
});


// Henter trainers når siden åbnes
getTrainers();

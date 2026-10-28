const trainerList = document.getElementById("trainerList");
const trainerPokemonList = document.getElementById("trainerPokemonList");
const trainerMessage = document.getElementById("trainerMessage");
const addMessage = document.getElementById("addMessage");


function getTrainers() {
    fetch("http://localhost:3000/trainers")
        .then(function (response) {
            return response.json();
        })
        .then(function (trainers) {
            trainerList.innerHTML = "";

            trainers.forEach(function (trainer) {
                const li = document.createElement("li");
                li.textContent = trainer.trainer_id + ". " + trainer.trainer_name
                    + " | Alder: " + trainer.age
                    + " | Hjemby: " + trainer.hometown;


                li.addEventListener("click", function () {
                    getTrainerPokemon(trainer.trainer_id);
                });

                trainerList.appendChild(li);
            });
        })
        .catch(function (error) {
            console.log(error);
            trainerMessage.textContent = "Kunne ikke hente trainers. Tjek backend.";
        });
}


function getTrainerPokemon(id) {
    fetch("http://localhost:3000/trainers/" + id + "/pokemon")
        .then(function (response) {
            return response.json();
        })
        .then(function (pokemon) {
            trainerPokemonList.innerHTML = "";

            if (pokemon.length === 0) {
                trainerPokemonList.textContent = "Denne trainer har ingen Pokémon endnu.";
                return;
            }

            pokemon.forEach(function (p) {
                const li = document.createElement("li");
                li.textContent = p.name + " - Type: " + p.primary_type;
                trainerPokemonList.appendChild(li);
            });
        })
        .catch(function (error) {
            console.log(error);
            trainerPokemonList.textContent = "Kunne ikke hente Pokémon.";
        });
}


document.getElementById("createButton").addEventListener("click", function () {
    const name = document.getElementById("trainerName").value;
    const age = document.getElementById("trainerAge").value;
    const hometown = document.getElementById("trainerHometown").value;

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
            return response.json();
        })
        .then(function (data) {
            trainerMessage.textContent = data.message;
            getTrainers();
        })
        .catch(function (error) {
            console.log(error);
            trainerMessage.textContent = "Kunne ikke oprette trainer.";
        });
});


document.getElementById("addButton").addEventListener("click", function () {
    const trainerId = document.getElementById("trainerId").value;
    const pokemonId = document.getElementById("pokemonId").value;

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
            return response.json();
        })
        .then(function (data) {
            addMessage.textContent = data.message;
            getTrainerPokemon(trainerId);
        })
        .catch(function (error) {
            console.log(error);
            addMessage.textContent = "Kunne ikke tilføje Pokémon.";
        });
});

getTrainers();

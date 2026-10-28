// Henter elementerne fra HTML
const pokemonList = document.querySelector("#pokemonList");
const nameInput = document.querySelector("#name");
const typeInput = document.querySelector("#type");
const attackInput = document.querySelector("#attack");
const message = document.querySelector("#message");

// Henter Pokémon fra vores API
function getPokemon() {
    const name = nameInput.value;
    const type = typeInput.value;
    const attack = attackInput.value;

    // Laver URL med brugerens filtre
    let url = "http://localhost:3000/pokemon?";
    url = url + "name=" + encodeURIComponent(name);
    url = url + "&type=" + encodeURIComponent(type);
    url = url + "&attack=" + encodeURIComponent(attack);

    // Henter data fra API'et med fetch
    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not load Pokémon");
            }

            // Laver JSON om til JavaScript-data
            return response.json();
        })
        .then(function (pokemon) {
            // Viser de Pokémon, vi har hentet
            showPokemon(pokemon);
        })
        .catch(function (error) {
            console.log(error);
            message.textContent = "Could not load Pokémon. Please check if the server is running.";
        });
}

// Viser Pokémon på hjemmesiden
function showPokemon(pokemon) {
    // Fjerner den gamle liste
    pokemonList.innerHTML = "";

    // Viser hvor mange Pokémon der blev fundet
    message.textContent = "Pokémon found: " + pokemon.length;

    // Besked hvis ingen Pokémon bliver fundet
    if (pokemon.length === 0) {
        message.textContent = "No Pokémon matched your search.";
        return;
    }

    // Gennemgår alle Pokémon og laver en liste
    pokemon.forEach(function (p) {
        const li = document.createElement("li");

        li.textContent = p.pokedex_number + ". " + p.name
            + " | Type: " + p.primary_type
            + (p.secondary_type ? " / " + p.secondary_type : "")
            + " | HP: " + p.hp
            + " | Attack: " + p.attack
            + " | Defence: " + p.defence
            + " | Speed: " + p.speed;

        pokemonList.appendChild(li);
    });
}

// Når brugeren klikker på Filter, hentes Pokémon
document.querySelector("#filterButton").addEventListener("click", getPokemon);

// Nulstiller filtrene og henter alle Pokémon igen
document.querySelector("#resetButton").addEventListener("click", function () {
    nameInput.value = "";
    typeInput.value = "";
    attackInput.value = "";

    getPokemon();
});

// Henter alle Pokémon, når siden åbnes
getPokemon();

// Henter Pokémon og deres sæsoner fra API'et
function getPokemonSeasons() {

    const seasonList = document.querySelector("#seasonList");

    fetch("http://localhost:3000/pokemon/seasons")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not fetch Pokémon seasons");
            }
            return response.json();
        })
        .then(function (seasons) {

            // Tømmer listen før vi viser data
            seasonList.innerHTML = "";

            // Gennemgår alle Pokémon og deres sæsoner
            seasons.forEach(function (season) {

                const li = document.createElement("li");

                li.textContent = season.name + " - " + season.season_name;

                seasonList.appendChild(li);
            });
        })
        .catch(function (error) {
            console.log(error);
            seasonList.textContent = "Could not load Pokémon seasons.";
        });
}

// Henter sæsonerne når siden åbnes
getPokemonSeasons();


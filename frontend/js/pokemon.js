const pokemonList = document.getElementById("pokemonList");
const nameInput = document.getElementById("name");
const typeInput = document.getElementById("type");
const attackInput = document.getElementById("attack");
const message = document.getElementById("message");


function getPokemon() {
    const name = nameInput.value;
    const type = typeInput.value;
    const attack = attackInput.value;


    let url = "http://localhost:3000/pokemon?";
    url = url + "name=" + encodeURIComponent(name);
    url = url + "&type=" + encodeURIComponent(type);
    url = url + "&attack=" + encodeURIComponent(attack);

    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Kunne ikke hente Pokémon");
            }
            return response.json();
        })
        .then(function (pokemon) {
            showPokemon(pokemon);
        })
        .catch(function (error) {
            console.log(error);
            message.textContent = "Kunne ikke hente Pokémon. Tjek, at backend kører.";
        });
}


function showPokemon(pokemon) {
    pokemonList.innerHTML = "";
    message.textContent = "Antal fundet: " + pokemon.length;

    if (pokemon.length === 0) {
        message.textContent = "Ingen Pokémon passede til din søgning.";
        return;
    }

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

document.getElementById("filterButton").addEventListener("click", getPokemon);

document.getElementById("resetButton").addEventListener("click", function () {
    nameInput.value = "";
    typeInput.value = "";
    attackInput.value = "";
    getPokemon();
});


getPokemon();

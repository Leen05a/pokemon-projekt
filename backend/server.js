
// Henter de pakker, vi skal bruge til vores backend
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 3000;

// Gør det muligt for frontend at sende requests til backend
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Tester om serveren virker
app.get("/", function (req, res) {
    res.send("Pokédex backend virker!");
});


// Henter Pokémon fra databasen
// Brugeren kan filtrere efter type, attack og navn
app.get("/pokemon", function (req, res) {
    const type = req.query.type || "";
    const attack = req.query.attack || "";
    const name = req.query.name || "";

    // SQL henter de Pokémon, som passer til filtrene
    const sql = `
    SELECT * FROM pokemon
    WHERE (? = '' OR primary_type = ?)
    AND (? = '' OR attack >= ?)
    AND (? = '' OR name LIKE ?)
    ORDER BY pokedex_number
`;

    // Gør det muligt at søge på en del af navnet
    const searchName = "%" + name + "%";

    connection.query(
        sql,
        [type, type, attack, attack, name, searchName],
        function (error, results) {
            if (error) {
                console.log(error);
                return res.status(500).send("Fejl ved hentning af Pokémon");
            }

            // Sender Pokémon tilbage til frontend
            res.json(results);
        }
    );
});


// Henter Pokémon med en bestemt type
app.get("/pokemon/type", function (req, res) {
    const type = req.query.type || "";

    connection.query(
        "SELECT * FROM pokemon WHERE primary_type = ? ORDER BY pokedex_number",
        [type],
        function (error, results) {
            if (error) {
                console.log(error);
                return res.status(500).send("Fejl ved hentning af Pokémon");
            }

            res.json(results);
        }
    );
});


// Henter alle trainers fra databasen
app.get("/trainers", function (req, res) {
    connection.query("SELECT * FROM trainer ORDER BY trainer_id", function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).send("Fejl ved hentning af trænere");
        }

        res.json(results);
    });
});


// Opretter en ny trainer i databasen
app.post("/trainers", function (req, res) {

    // Henter oplysningerne fra frontend
    const name = req.body.trainer_name;
    const age = req.body.age;
    const hometown = req.body.hometown;

    // Tjekker om alle felter er udfyldt
    if (!name || !age || !hometown) {
        return res.status(400).json({ message: "Udfyld navn, alder og hjemby." });
    }

    // Indsætter den nye trainer i databasen
    const sql = "INSERT INTO trainer (trainer_name, age, hometown) VALUES (?, ?, ?)";

    connection.query(sql, [name, age, hometown], function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Kunne ikke oprette træner" });
        }

        res.status(201).json({
            message: "Træner oprettet",
            trainer_id: results.insertId
        });
    });
});


// Henter de Pokémon, som en bestemt trainer ejer
app.get("/trainers/:id/pokemon", function (req, res) {
    const trainerId = req.params.id;

    // JOIN bruges til at forbinde trainers med deres Pokémon
    const sql = `
        SELECT pokemon.*
        FROM trainer_pokemon
        JOIN pokemon ON trainer_pokemon.pokedex_number = pokemon.pokedex_number
        WHERE trainer_pokemon.trainer_id = ?
        ORDER BY pokemon.pokedex_number
    `;

    connection.query(sql, [trainerId], function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Kunne ikke hente trænerens Pokémon" });
        }

        res.json(results);
    });
});


// Tilføjer en Pokémon til en trainer
app.post("/trainers/:id/pokemon", function (req, res) {
    const trainerId = req.params.id;
    const pokemonId = req.body.pokedex_number;

    // Tjekker om brugeren har angivet et Pokémon-nummer
    if (!pokemonId) {
        return res.status(400).json({ message: "Angiv et Pokédex-nummer." });
    }

    // Gemmer forbindelsen mellem trainer og Pokémon
    const sql = "INSERT INTO trainer_pokemon (trainer_id, pokedex_number) VALUES (?, ?)";

    connection.query(sql, [trainerId, pokemonId], function (error) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Kunne ikke tilføje Pokémon. Kontrollér ID'erne." });
        }

        res.status(201).json({ message: "Pokémon tilføjet til træneren!" });
    });
});


// Henter antal trainers til dashboard
app.get("/stats/trainers", function (req, res) {
    connection.query("SELECT COUNT(*) AS total FROM trainer", function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Fejl ved hentning af statistik" });
        }

        res.json(results[0]);
    });
});


// Henter antal Pokémon til dashboard
app.get("/stats/pokemon", function (req, res) {
    connection.query("SELECT COUNT(*) AS total FROM pokemon", function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Fejl ved hentning af statistik" });
        }

        res.json(results[0]);
    });
});


// Henter antal Pokémon, der er tildelt til trainers
app.get("/stats/assigned-pokemon", function (req, res) {
    connection.query("SELECT COUNT(*) AS total FROM trainer_pokemon", function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Fejl ved hentning af statistik" });
        }

        res.json(results[0]);
    });
});


// Henter antal Pokémon fordelt på deres primære type
// Data bruges til cirkeldiagrammet på dashboard
app.get("/stats/pokemon-types", function (req, res) {
    const sql = `
        SELECT primary_type, COUNT(*) AS total
        FROM pokemon
        GROUP BY primary_type
        ORDER BY total DESC
    `;

    connection.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Fejl ved hentning af Pokémon-typer" });
        }

        res.json(results);
    });
});


// Beregner gennemsnitlig attack for hver Pokémon-type
// Data bruges til søjlediagrammet på dashboard
app.get("/stats/average-attack", function (req, res) {
    const sql = `
        SELECT primary_type, ROUND(AVG(attack), 1) AS average_attack
        FROM pokemon
        GROUP BY primary_type
        ORDER BY average_attack DESC
    `;

    connection.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Fejl ved hentning af gennemsnitlig attack" });
        }

        res.json(results);
    });
});


// Henter Pokémon og de sæsoner, de optræder i
// Bruger vores nye tabeller season og pokemon_has_season
app.get("/pokemon/seasons", function (req, res) {

    // JOIN forbinder Pokémon med deres sæsoner
    const sql = `
        SELECT pokemon.pokedex_number,
               pokemon.name,
               season.season_name
        FROM pokemon_has_season
        JOIN pokemon
        ON pokemon_has_season.pokemon_pokedex_number = pokemon.pokedex_number
        JOIN season
        ON pokemon_has_season.season_season_id = season.season_id
        ORDER BY pokemon.pokedex_number
    `;

    connection.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({
                message: "Could not fetch Pokémon seasons"
            });
        }

        res.json(results);
    });
});


// Starter serveren på port 3000
app.listen(3000, function () {
    console.log("Serveren kører på http://localhost:3000");
});

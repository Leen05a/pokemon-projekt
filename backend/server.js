const express = require("express");
const cors = require("cors");
const connection = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
    res.send("Pokédex backend virker!");
});



app.get("/pokemon", function (req, res) {
    const type = req.query.type || "";
    const attack = req.query.attack || "";
    const name = req.query.name || "";

    const sql = `
        SELECT * FROM pokemon
        WHERE (? = '' OR primary_type = ? OR secondary_type = ?)
        AND (? = '' OR attack >= ?)
        AND (? = '' OR name LIKE ?)
        ORDER BY pokedex_number
    `;

    const searchName = "%" + name + "%";

    connection.query(
        sql,
        [type, type, type, attack, attack, name, searchName],
        function (error, results) {
            if (error) {
                console.log(error);
                return res.status(500).send("Fejl ved hentning af Pokémon");
            }

            res.json(results);
        }
    );
});


app.get("/pokemon/type", function (req, res) {
    const type = req.query.type || "";

    connection.query(
        "SELECT * FROM pokemon WHERE primary_type = ? OR secondary_type = ? ORDER BY pokedex_number",
        [type, type],
        function (error, results) {
            if (error) {
                console.log(error);
                return res.status(500).send("Fejl ved hentning af Pokémon");
            }

            res.json(results);
        }
    );
});

app.get("/trainers", function (req, res) {
    connection.query("SELECT * FROM trainer ORDER BY trainer_id", function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).send("Fejl ved hentning af trænere");
        }

        res.json(results);
    });
});

app.post("/trainers", function (req, res) {
    const name = req.body.trainer_name;
    const age = req.body.age;
    const hometown = req.body.hometown;

    if (!name || !age || !hometown) {
        return res.status(400).json({ message: "Udfyld navn, alder og hjemby." });
    }

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

app.get("/trainers/:id/pokemon", function (req, res) {
    const trainerId = req.params.id;

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

app.post("/trainers/:id/pokemon", function (req, res) {
    const trainerId = req.params.id;
    const pokemonId = req.body.pokedex_number;

    if (!pokemonId) {
        return res.status(400).json({ message: "Angiv et Pokédex-nummer." });
    }

    const sql = "INSERT INTO trainer_pokemon (trainer_id, pokedex_number) VALUES (?, ?)";

    connection.query(sql, [trainerId, pokemonId], function (error) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Kunne ikke tilføje Pokémon. Kontrollér ID'erne." });
        }

        res.status(201).json({ message: "Pokémon tilføjet til træneren!" });
    });
});

app.get("/stats/trainers", function (req, res) {
    connection.query("SELECT COUNT(*) AS total FROM trainer", function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Fejl ved hentning af statistik" });
        }
        res.json(results[0]);
    });
});

app.get("/stats/pokemon", function (req, res) {
    connection.query("SELECT COUNT(*) AS total FROM pokemon", function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Fejl ved hentning af statistik" });
        }
        res.json(results[0]);
    });
});

app.get("/stats/assigned-pokemon", function (req, res) {
    connection.query("SELECT COUNT(*) AS total FROM trainer_pokemon", function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Fejl ved hentning af statistik" });
        }
        res.json(results[0]);
    });
});

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

app.listen(3000, function () {
    console.log("Serveren kører på http://localhost:3000");
});

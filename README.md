
# Pokédex – Tværfagligt midtvejsprojekt

## Om projektet

I dette projekt har vi udviklet en Pokédex-hjemmeside, hvor brugeren kan udforske Pokémon, se trainers og få overblik over forskellige statistikker.

Projektet er lavet som en del af vores tværfaglige midtvejsprojekt på 1. semester.

Vi har arbejdet med både database, backend og frontend.

## Teknologier

Vi har brugt følgende teknologier:

- MySQL til databasen
- Node.js og Express til backend
- HTML til hjemmesidens struktur
- CSS til design
- JavaScript til funktionalitet
- Fetch API til kommunikation med backend
- Chart.js til diagrammer på dashboardet

## Projektets struktur

Projektet er opdelt i to mapper:

### Backend

Backend indeholder:

- `server.js` – vores API og endpoints
- `database.js` – forbindelse til MySQL
- `package.json` – projektets Node.js-pakker
- `pokemon_database.sql` – database med tabeller og data
- `ER-diagram.png` – diagram over database og relationer

### Frontend

Frontend indeholder tre HTML-sider:

- `pokemon.html`
- `trainers.html`
- `dashboard.html`

Derudover har vi JavaScript-filer til funktionaliteten og en CSS-fil til designet.

## 1. Pokémon

På Pokémon-siden kan brugeren:

- Se en liste over Pokémon og deres stats
- Søge efter Pokémon ved hjælp af navn
- Filtrere efter Pokémon-type
- Filtrere efter minimum attack
- Nulstille filtrene
- Se hvilke sæsoner udvalgte Pokémon optræder i

Filtreringen foregår gennem vores API ved hjælp af query-parametre.

## 2. Trainers

På Trainers-siden kan brugeren:

- Se alle trainers
- Klikke på en trainer og se deres Pokémon
- Oprette en ny trainer
- Tilføje Pokémon til en trainer

Vi bruger GET-requests til at hente data og POST-requests til at oprette data.

## 3. Dashboard

På dashboardet viser vi forskellige statistikker fra vores MySQL-database.

Vi viser blandt andet:

- Det samlede antal Pokémon
- Det samlede antal trainers
- Antallet af Pokémon tildelt til trainers
- Fordelingen af Pokémon efter primær type
- Gennemsnitlig attack efter primær type

Vi bruger Chart.js til at vise et cirkeldiagram og et søjlediagram.

Statistikkerne beregnes i databasen og hentes gennem vores API.

## Databasedesign

Vi har videreudviklet Pokémon-databasen med tabeller til trainers og Pokémon-sæsoner.

Databasen indeholder blandt andet:

- `pokemon`
- `trainer`
- `trainer_pokemon`
- `body_shape`
- `season`
- `pokemon_has_season`

Vi har lavet et ER-diagram, der viser tabellerne og deres relationer.

Tabellerne `season` og `pokemon_has_season` bruges til at vise, hvilke sæsoner forskellige Pokémon optræder i.

## API

Vores backend indeholder blandt andet disse endpoints:

### Pokémon

- `GET /pokemon`
- `GET /pokemon/type`
- `GET /pokemon/seasons`

### Trainers

- `GET /trainers`
- `POST /trainers`
- `GET /trainers/:id/pokemon`
- `POST /trainers/:id/pokemon`

### Statistikker

- `GET /stats/pokemon`
- `GET /stats/trainers`
- `GET /stats/assigned-pokemon`
- `GET /stats/pokemon-types`
- `GET /stats/average-attack`

Vi har brugt Insomnia til at teste vores API.

## Sådan starter man projektet

### 1. Database

Importer `backend/pokemon_database.sql` i MySQL.

Opret en `.env`-fil i backend-mappen med databaseoplysninger:

DB_HOST=localhost
DB_USER=dit_brugernavn
DB_PASSWORD=din_adgangskode
DB_NAME=pokemon

### 2. Backend

Åbn terminalen, og gå ind i backend-mappen:

`cd backend`

Installer pakkerne:

`npm install`

Start serveren:

`node server.js`

Backend kører på:

http://localhost:3000

### 3. Frontend

Åbn `frontend/pokemon.html` i browseren gennem WebStorm.

Backend skal køre, for at hjemmesiden kan hente data fra databasen.

## Test

Vi har testet følgende funktioner:

- Hentning af Pokémon fra databasen
- Filtrering efter navn, type og attack
- Hentning af trainers
- Oprettelse af trainers
- Tilføjelse af Pokémon til trainers
- Hentning af Pokémon-sæsoner
- Visning af statistikker på dashboardet

Vi har også testet vores endpoints med Insomnia.

## Dokumentation

Projektet indeholder et ER-diagram og en SQL-fil.

Screenshots af den kørende hjemmeside og API-testene kan tilføjes som dokumentation.

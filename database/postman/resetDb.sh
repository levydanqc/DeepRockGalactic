#!/bin/bash

URL="mongodb://localhost:27017"

mongoimport --uri $URL --db deepRockGalactic --collection contrats --drop --file database/collections/contrats.json --jsonArray

mongoimport --uri $URL --db deepRockGalactic --collection mineurs --drop --file database/collections/mineurs.json --jsonArray

mongoimport --uri $URL --db deepRockGalactic --collection planetes --drop --file database/collections/planetes.json --jsonArray

mongoimport --uri $URL --db deepRockGalactic --collection reservations --drop --file database/collections/reservations.json --jsonArray

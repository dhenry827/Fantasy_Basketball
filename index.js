const express = require('express');
const app = express();
const pg = require('pg-promise')();
const db = pg("postgres://corcoding@localhost:5432/postgres");
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
app.use(express.json())


//GET GET GET GET GET GET GET GET GET -----------------------------------------GET
app.get('/', async (req, res) => {
    let fantasyTeam = await db.any('SELECT * FROM fantasy_basketball_team')
    res.send(fantasyTeam);
})

app.get('/player/:id', async (req, res) => {
    let id = req.params.id
    let fantasyPlayer = await db.one('SELECT * FROM fantasy_basketball_team WHERE id = $1', [id])
    res.send(fantasyPlayer);
})


// POST POST POST POST POST POST POST POST POST POST -------------------------- POST

app.post('/newplayer', async (req, res) => {
    let first_name = req.body.first_name
    let last_name = req.body.last_name
    let position = req.body.position
    let jersey_number = req.body.jersey_number
    let rating = req.body.rating
    let salary = req.body.salary

    //first_name Error Check
    if (typeof req.body.first_name !== 'string') {
        logger.error({
            level: 'error',
            message: `first_name must be a string`,
        });
        return res.status(400).json({
            error: `first_name must be a string`
        })
    }
    //last_name Error Check
    if (typeof req.body.last_name !== 'string') {
        logger.error({
            level: 'error',
            message: `last_name must be a string`
        });
        return res.status(400).json({
            error: `last_name must be a string`
        })
    }



    //Jersey_number Error Check
    if (typeof req.body.jersey_number !== 'number') {
        logger.error({
            level: 'error',
            message: `jersey_number must be a number`
        });
        return res.status(400).json({
            error: `jersey_number must be a number`
        })
    }

    //Rating Error Check
    if (typeof req.body.rating !== 'number') {
        logger.error({
            level: 'error',
            message: `rating must be a number`
        });
        return res.status(400).json({
            error: `rating must be a number`
        })
    } else if (rating < 1 || rating > 5) {
        return res.status(400).send('Rating must be between 1 and 5.');
    }

    //Position Error Check
    if (typeof req.body.position !== 'string') {
        logger.error({
            level: 'error',
            message: `Position must be a string`
        });
        return res.status(400).json({
            error: `Position must be a string`
        })
    } else if (req.body.position !== 'F' && req.body.position !== 'G' && req.body.position !== 'C') {
        logger.error({
            level: 'error',
            message: `Position must be F, G, C`
        });
        return res.status(400).json({
            error: `Position must be F, G, C`

        })
    }
    //Salary Error Check
    if (typeof req.body.salary !== 'string') {
        logger.error({
            level: 'error',
            message: `salary must be a string`
        });
        return res.status(400).json({
            error: `salary must be a string`
        })
    }
    
    
    
    let newPlayer = await db.none("INSERT INTO fantasy_basketball_team(first_name, last_name, position, jersey_number, rating, salary) VALUES($1, $2, $3, $4, $5, $6)", [first_name, last_name, position, jersey_number, rating, salary]);


    res.send(newPlayer)
})

//PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT ------------------------ PUT
app.put('/updatePlayer/:id', async(req, res) => {
    let id = req.params.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let position = req.body.position;
    let jersey_number = req.body.jersey_number;
    let rating = req.body.rating;
    let salary = req.body.salary;

    let updateQuery = `UPDATE fantasy_basketball_team SET `;

    const setClauses = [];

    if (first_name) {
        setClauses.push(`first_name = $1`);
    }
    if (last_name) {
        setClauses.push(`last_name = $2`);
    }
    if (position) {
        setClauses.push(`position = $3`);
    }
    if (jersey_number) {
        setClauses.push(`jersey_number = $4`);
    }
    if (rating) {
        setClauses.push(`rating = $5`);
    }
    if (salary) {
        setClauses.push(`salary = $6`);
    }

    updateQuery += `${setClauses.join(', ')} WHERE id = $7 `;

    
    let updatedPlayer = await db.none(updateQuery, [first_name, last_name, position, jersey_number, rating, salary, id]);
 
    try {
        await db.none(updateQuery, [firstname, lastname, position, jerseyNumber, rating, salary, id]);
        
        res.send('Record updated successfully');
    } catch (error) {
        res.status(500).send('Error updating record: ' + error.message);
    }
 
})



// DELETE DELETE DELETE DELETE DELETE DELETE ------------------------- DELETE
app.delete('/cutplayer/:id', async (req, res) => {
    let playerId = req.params.id;
    let errorCaught = false

    try {
        let player = await db.oneOrNone("SELECT * FROM fantasy_basketball_team WHERE id = $1", [playerId]);
        
        if (player) {
            
            await db.none("DELETE FROM fantasy_basketball_team WHERE id = $1", [playerId]);
            res.send(`Player id ${playerId} has been cut.`);
        } else {
            // Player not found, send 404 response
            res.status(404).send(`Player id ${playerId} not found.`);
        }
    } catch (error) {
        console.error("Error deleting player:", error);
        errorCaught = true
        
        if(errorCaught = true){
            logger.error({
                level: 'error',
                message: `Player id ${playerId} not found.`,
                timestamp: new Date().toISOString(),
            });
        }
        res.status(500).send("An error occurred while deleting the player.");
    }
});



// LISTEN LISTEN LISTEN LISTEN --------------------------------LISTEN
app.listen(3000, () => {
    console.log('Server is running at port 3000');
})
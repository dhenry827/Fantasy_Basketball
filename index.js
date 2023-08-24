const express = require('express');
const app = express();
const pg = require('pg-promise')();
const db = pg("postgres://corcoding@localhost:5432/corcoding");
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
// ------------------------------------------------------------------------------


//GET GET GET GET GET GET GET GET GET -----------------------------------------GET
app.get('/', async(req, res) => {
    let fantasyTeam = await db.any('SELECT * FROM fantasy_basketball_team')
    res.send(fantasyTeam);
})

app.get('/Player/:id', async(req, res) => {
    let fantasyPlayer= await db.one('SELECT * FROM fantasy_basketball_team')
    res.send(fantasyPlayer);
})


// POST POST POST POST POST POST POST POST POST POST -------------------------- POST
// first name, last name, position, jersey number,  rating (1-5) stars, and salary.
app.post('/newplayer', async(req,res)=> {
    let first_name = req.body.first_name
    let last_name = req.body.last_name
    let position = req.body.position
    let jersey_number = req.body.jersey_number
    let rating = req.body.rating
    let salary = req.body.salary
    let postTeam =  await db.none("INSERT INTO accounts(firstName, lastName) VALUES($1, $2)", [firstName, lastName]);

   res.send(postaccounts)

})

// PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT ------------------------ PUT
app.put('/update')


// DELETE DELETE DELETE DELETE DELETE DELETE ------------------------- DELETE
app.delete()


// LISTEN LISTEN LISTEN LISTEN --------------------------------LISTEN
app.listen(3000, () => {
    console.log('Server is running at port 3000');
})
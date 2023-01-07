import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import dotenv from 'dotenv';
//read .env file
dotenv.config();

//set time zone
process.env.TZ = 'America/Toronto';

// set port, listen for requests
const PORT = process.env.PORT || 4500;

//express json cors setup
let app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}.`)
});


app.get('/api/', (req, res) => {

	console.log('hello world...')
	res.send('hello world')

});


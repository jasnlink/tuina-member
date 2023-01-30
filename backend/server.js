import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';
import CSV from 'csv-string';

import dotenv from 'dotenv';
//read .env file
dotenv.config();

//set time zone
process.env.TZ = 'America/Toronto';

// set port, listen for requests
const PORT = process.env.PORT || 4500;
const CSV_URL = "https://docs.google.com/spreadsheets/d/1KWWeBo5LZ8qCjuTW1a_w2tJj8KQr5NWY9hI-LqK2gaQ/export?format=csv"

//express json cors setup
let app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}.`)
});

let memberList = []

app.get('/api/init', async (req, res) => {

  console.log('Initializing member data...')

  const query = await fetch(CSV_URL, {method: 'get'})
  if(!query.ok) {
    console.log('ERROR... Could not fetch member data... ', query)
    res.status(502);
    return res.send('ERROR')
  }

  const parsedQuery = await query.text()
  const data = await CSV.parse(parsedQuery)

  // skip first row
  memberList = data.slice(1)

  console.log('Loaded member data... Sending response...')
  return res.send('ready')

});


app.get('/api/search/:s', (req, res) => {

  console.log('Searching for member data...')

  // error out if member list is not loaded yet by checking the length
  if(!memberList.length) {
    console.log('ERROR... Member list not initialized...')
    res.status(400);
    return res.send('ERROR')
  }

  // get the search param
  let search = req.params['s']

  // replace all whitespace characters
  const regex = /\s*/g;
  let parsedSearch = search.replace(regex, '').toLowerCase()

  for(let member of memberList) {
    let parsedMember = member[0].replace(regex, '').toLowerCase()

    if(parsedMember === parsedSearch) {
      console.log('found!', member)
      return res.send(member)
    }
  }
  console.log(search)
  res.status(204);
  return res.send(null)
});
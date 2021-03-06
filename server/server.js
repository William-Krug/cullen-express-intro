const express = require('express');
// console.log('express', express);

/// deprecated, express covers this these days
// const bodyParser = require('body-parser');

const quotes = require('./modules/quotes');

// Create our app(lication)
const app = express();

const port = 5000;

// INCANTATION:
// Share any files inside the "./server/public" folder
app.use(express.static('server/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for url requests used with our APIs

/// OPTIONAL BODY PARSER USAGE
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// Listen for network requests
// by convention, use 3000 or 5000 as the port number
// in theory, can be any port number
app.listen(port, function () {
  // When the server is ready, call this function
  console.log(`I'm listening....`, port);
});

// setting up a new route
// you MUST end API with 'send' or 'end'
// GET endpoint
app.get('/quotes', function (req, res) {
  // "'/quotes'" is a resource (an address) of what you are going to look for
  console.log('GET Request for quotes');
  res.send(quotes.getNextQuote()); //
});

/**
 * GET /allTheQuotes
 *
 * Return an array with all the quotes in it
 */
app.get('/allTheQuotes', function (req, res) {
  console.log('GET Request for allTheQuotes');
  // Send bak the entire list of quotes
  res.send(quotes.quoteList);
});

app.get('/cool-things', function (req, res) {
  res.send('<h1>Cool things</h1>');
});

// POST endpoint
// use POST to save data on the server
/**
 * POST /quotes endpoint
 *
 * Accepts a body like:
 *
 * {
 *  "quote_to_add": {
 *    "quote": "Something smart",
 *    "author": "Me (hopefully)"
 *   }
 * }
 *
 * Will add to list of quotes
 */
app.post('/quotes', (req, res) => {
  // Server-Side Validation
  if (req.body.quote_to_add === undefined) {
    console.log('oops, missing quote_to_add');
    // 400 === "You messed up"
    res.sendStatus(400);
    return;
  }

  let quote = req.body.quote_to_add; // if ERROR "req.body is undefined", you are missing body-parser
  console.log(quote.author);
  console.log(quote.quote); // sends 200 {quote: '...', author: '...'}

  // ToDo: add to quotesData
  quotes.addQuote(quote);
  // ToDo: Respond with something!
  res.sendStatus(200); // sends back "A-OK"
  // 201 = created  204 = no content 401 = unathorized   406 = coffepot interface
});

// If you see a EADDRINUSE error,
// run:
//    killall -9 node
// ..and try again

// have things separated out into different modules for security, debugging and ease of coding
// body-parser is middlewear: it takes some input, applies business logic, transforms it and spits it out
// ..to be used with the rest of your code

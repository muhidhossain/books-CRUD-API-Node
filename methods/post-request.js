const crypto = require('crypto');
const requestBodyParser = require('../utils/body-parser');
const writeToFile = require('../utils/write-to-file');

module.exports = async (req, res) => {
  if (req.url === '/api/books') {
    try {
      let body = await requestBodyParser(req);
      console.log(body);
      body.id = crypto.randomUUID();
      req.books.push(body);
      writeToFile(req.books);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end();
    } catch (err) {
      console.log(err);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          title: 'Validation Failed',
          message: 'Request body is not valid',
        })
      );
    }
  } else {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ title: 'Not Found', message: 'Rout not found' }));
  }
};

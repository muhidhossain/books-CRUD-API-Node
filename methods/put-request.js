const requestBodyParser = require('../utils/body-parser');
const writeToFile = require('../utils/write-to-file');

module.exports = async (req, res) => {
  let baseUrl = req.url.substring(0, req.url.lastIndexOf('/') + 1);
  let id = req.url.split('/')[3];
  const regexV4 = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  );

  if (id && !regexV4.test(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        title: 'Validation Failed',
        message: 'UUID is not valid',
      })
    );
  } else if (baseUrl === '/api/books/' && regexV4.test(id)) {
    try {
      let body = await requestBodyParser(req);
      const index = req.books.findIndex((book) => {
        return book.id === id;
      });
      if (index === -1) {
        res.statusCode = 404;
        res.write(
          JSON.stringify({ title: 'Not Found', message: 'Books not found' })
        );
        res.end();
      } else {
        req.books[index] = { id, ...body };
        writeToFile(req.books);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(req.books[index]));
      }
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
    res.end(JSON.stringify({ title: 'Not Found', message: 'Route not found' }));
  }
};

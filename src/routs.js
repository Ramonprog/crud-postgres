const express = require("express");
const {
  insertingAuthor,
  findingAuthor,
  insertinBook,
  findBooks,
} = require("./controllers");
const routs = express();

routs.post("/autor", insertingAuthor);
routs.get("/autor/:id", findingAuthor);
routs.post("/autor/:id/livro", insertinBook);
routs.get("/livro", findBooks);

module.exports = routs;

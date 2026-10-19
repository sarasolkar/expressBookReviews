const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const baseURL = "http://127.0.0.1:5000";

public_users.get('/_data/books', (req, res) => {
  return res.json(books);
});

public_users.get('/_data/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (book) return res.json(book);
  return res.status(404).json({ message: "Book not found" });
});

public_users.get('/_data/author/:author', (req, res) => {
  const result = Object.values(books).filter(b => b.author === req.params.author);
  if (result.length > 0) return res.json(result);
  return res.status(404).json({ message: "No books found for this author" });
});

public_users.get('/_data/title/:title', (req, res) => {
  const result = Object.values(books).filter(b => b.title === req.params.title);
  if (result.length > 0) return res.json(result);
  return res.status(404).json({ message: "No books found with this title" });
});

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    }
    return res.status(404).json({ message: "User already exists!" });
  }
  return res.status(400).json({ message: "Unable to register user." });
});

function handleError(error, res, notFoundMsg, genericMsg) {
  if (error.response && error.response.status === 404) {
    return res.status(404).json({ message: notFoundMsg });
  }
  return res.status(500).json({ message: genericMsg });
}

public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/_data/books`);
    return res.status(200).json(response.data);
  } catch (error) {
    return handleError(error, res, "No books found", "Unable to retrieve books");
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/_data/isbn/${encodeURIComponent(req.params.isbn)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return handleError(error, res, "Book not found", "Unable to retrieve book");
  }
});

public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/_data/author/${encodeURIComponent(req.params.author)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return handleError(error, res, "No books found for this author", "Unable to retrieve books");
  }
});

public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/_data/title/${encodeURIComponent(req.params.title)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return handleError(error, res, "No books found with this title", "Unable to retrieve books");
  }
});

public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (book) return res.status(200).json(book.reviews || {});
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
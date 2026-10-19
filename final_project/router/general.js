const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }

  return res.status(400).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (books[isbn]) {
    return res.send(books[isbn]);
  }
  return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let bookKeys = Object.keys(books);
  let result = [];

  bookKeys.forEach((isbn) => {
    if (books[isbn].author === author) {
      result.push(books[isbn]);
    }
  });

  return res.send(JSON.stringify(result, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let bookKeys = Object.keys(books);
  let result = [];

  bookKeys.forEach((isbn) => {
    if (books[isbn].title === title) {
      result.push(books[isbn]);
    }
  });

  return res.send(JSON.stringify(result, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (books[isbn]) {
    return res.send(books[isbn].reviews || {});
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
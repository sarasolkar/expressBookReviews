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
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    const result = await Promise.resolve(books);
    return res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  Promise.resolve(books[isbn])
    .then((result) => {
      if (result) {
        return res.send(result);
      }
      return res.status(404).json({message: "Book not found"});
    })
    .catch(() => {
      return res.status(500).json({message: "Error retrieving book"});
    });
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  let author = req.params.author;

  try {
    const result = await Promise.resolve(
      Object.keys(books)
        .filter((isbn) => books[isbn].author === author)
        .map((isbn) => books[isbn])
    );

    return res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books by author"});
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  let title = req.params.title;

  Promise.resolve(
    Object.keys(books)
      .filter((isbn) => books[isbn].title === title)
      .map((isbn) => books[isbn])
  )
    .then((result) => {
      return res.send(JSON.stringify(result, null, 4));
    })
    .catch(() => {
      return res.status(500).json({message: "Error retrieving books by title"});
    });
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
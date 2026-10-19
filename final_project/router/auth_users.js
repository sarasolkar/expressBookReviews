const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let user = users.find((user) => user.username === username);
    return user === undefined;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let user = users.find((user) => user.username === username && user.password === password);
    return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign(
            {username: username, password: password},
            "access",
            {expiresIn: "1h"}
        );

        req.session.authorization = {
            accessToken: token,
            username: username
        };

        return res.status(200).json({message: "User successfully logged in"});
    }

    return res.status(401).json({message: "Invalid username or password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const review = req.query.review;

    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }

    if (!review) {
        return res.status(400).json({message: "Review is required"});
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }

    if (books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];

        return res.status(200).json({
            message: "Review deleted successfully",
            reviews: books[isbn].reviews
        });
    }

    return res.status(404).json({message: "Review not found for this user"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

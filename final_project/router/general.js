const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) { 
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
          return res.status(404).json({message: "Username already exists!"});    
        }
      } 
      return res.status(404).json({message: "Unable to register user. Missing username or password."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    new Promise((resolve, reject) => {
        res.send(books);
        resolve();
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        resolve(isbn);
    });
    myPromise.then((isbn) => {
        res.send(books[isbn]);
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        const author = req.params.author;
        var foundbooks = [];
        var bookskeys = Object.keys(books);
        for (const key in bookskeys) {
            var book = books[bookskeys[key]];
            if (book["author"] === author) {
                foundbooks.push(bookskeys[key],book)
            }
        }
        resolve(foundbooks);
    });
    myPromise.then((foundbooks) => {
        res.send(foundbooks);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        const title = req.params.title;
        let foundbooks = [];
        let bookskeys = Object.keys(books);
        for (const key in bookskeys) {
            let book = books[bookskeys[key]];
            if (book["title"] === title) {
                foundbooks.push(bookskeys[key],book)
            }
        }
        resolve(foundbooks);
    });
    myPromise.then((foundbooks) => {
        res.send(foundbooks);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"])
});

module.exports.general = public_users;

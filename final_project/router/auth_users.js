const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
          return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 60 });
    
        req.session.authorization = {
          accessToken,username
      }
      return res.status(200).send("User successfully logged in");
      } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
      }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.query["review"];
    const username = req.body.username;
    const isbn = req.params.isbn;
    let bookreviews = books[isbn]["reviews"];
    let alreadyreviewed = false
    for (const reviews in bookreviews) {
        if (bookreviews[reviews]["username"] === username) {
            books[isbn]["reviews"][reviews]["review"] = review;
            alreadyreviewed = true;
            res.send("Review modified\n" + JSON.stringify(books[isbn]));
        }
    }
    if (!alreadyreviewed) {
        let newReview = {"review": review, "username": username}
        if (Object.keys(bookreviews).length === 0) {
            books[isbn]["reviews"] = [newReview];
        }
        else {
            books[isbn]["reviews"].push(newReview);
        }
        res.send("Review added\n"+ JSON.stringify(books[isbn]));
    }
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.body.username;
    const isbn = req.params.isbn;
    let bookreviews = books[isbn]["reviews"];
    for (const reviews in bookreviews) {
        if (bookreviews[reviews]["username"] === username) {
            books[isbn]["reviews"].splice(reviews,1);
            res.send("Review deleted\n" + JSON.stringify(books[isbn]));
        }
      }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
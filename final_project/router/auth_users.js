const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  var isbn = req.params.isbn;
  var review = req.query;
  if (!req.session.authorization) {
    return res.status(401).json({ message: "You did not login" });
  }
  if (! books[isbn] || !review) {
    return res.status(404).json({ message: "Book not found or no review" });
  }

  jwt.verify(req.session.authorization["accessToken"], "access", (err, decoded) => {
    if (err) {
        return res.status(403).json({ message: "Unauthorized access" });
    }
    // Add or update the review for the specified book
    books[isbn].reviews[req.session.authorization["username"]]= review;
    return res.status(200).json({ message: "Review added successfully" });
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  // Check if the user is authenticated
  if (!req.session.authorization) {
      return res.status(403).json({ message: "Unauthorized access" });
  }
  // Check if the book exists
  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }
  // Extract the username from the JWT token
  jwt.verify(req.session.authorization["accessToken"], "access", (err, decoded) => {
      if (err) {
          return res.status(403).json({ message: "Unauthorized access" });
      }
      var username = req.session.authorization["username"];
      // Check if the review exists for the user
      if (!books[isbn].reviews[username]) {
          return res.status(404).json({ message: "Review not found" });
      }

      // Delete the review for the user
      delete books[isbn].reviews[username];

      // Generate and send the success response
      const message = `Review for ISBN ${isbn} by ${username} deleted`;
      return res.status(200).json({ message });
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

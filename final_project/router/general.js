const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/*
public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  //const username = req.body.username;
  //const password = req.body.password;
  const { username, password } = req.body;
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});
*/
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  // Check if both username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }
  // Check if the username already exists
  if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
  }
  // Register the new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

//Asynchronous 

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books[req.params.isbn],null,4));
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  var result = Object.values(books).filter(book => book.author === req.params.author.replace(/-/g, ' '));
  res.send(result);
});



// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  var result = Object.values(books).filter(book => book.title === req.params.title.replace(/-/g, ' '));
  res.send(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(books[req.params.isbn]["reviews"],null,4));
});

//Synchronous
/*

const getAllBooks = async () => {
    return books;
  };
  
// Endpoint to get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
      const bookList = await getAllBooks();
      return res.status(200).json(bookList);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch books" });
    }
});

const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject({ message: "Book not found" });
      }
    });
  };
  
// Endpoint to get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    
    getBookByISBN(isbn)
      .then((book) => {
        return res.status(200).json(book);
      })
      .catch((error) => {
        return res.status(404).json(error);
      });
});

const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const results = [];
  
      // Iterate through the books object
      for (let isbn in books) {
        if (books[isbn].author === author) {
          results.push(books[isbn]);
        }
      }
  
      if (results.length > 0) {
        resolve(results);
      } else {
        reject({ message: "No books found for this author" });
      }
  });
};

public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    
    getBooksByAuthor(author)
      .then((results) => {
        return res.status(200).json(results);
      })
      .catch((error) => {
        return res.status(404).json(error);
      });
});


const getBooksByTitle = async (title) => {
    const results = [];
  
    // Iterate through the books object
    for (let isbn in books) {
      if (books[isbn].title === title) {
        results.push(books[isbn]);
      }
    }
  
    if (results.length > 0) {
      return results;
    } else {
      throw new Error("No books found with this title");
    }
};

public_users.get('/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
      const results = await getBooksByTitle(title);
      return res.status(200).json(results);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
});


*/

module.exports.general = public_users;




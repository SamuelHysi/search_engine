const readline = require('readline');
const fs = require('fs');

const index = {};

// Function to tokenize a document
function tokenizeDocument(document) {
  return document.toLowerCase().split(/\W+/).filter(token => token.length > 0); 
}

// Function to add a document to the index
function addToIndex(docId, tokens) {
  for (const token of tokens) {
    if (!index[token]) {
      index[token] = [];
    }
    index[token].push(docId);
  }
}

// Function to search for a token in the index
function search(token) {
  return index[token] || [];
}

// Function to perform a search query
function performSearch(query) {
  const tokens = tokenizeDocument(query);
  const results = {};

  for (const token of tokens) {
    const docs = search(token);
    for (const doc of docs) {
      if (!results[doc]) {
        results[doc] = 0;
      }
      results[doc]++;
    }
  }

  return results;
}

// Function to save search results to a file
function saveSearchResults(query, results) {
  let output = `Search query: ${query}\n\n`;
  if (Object.keys(results).length !== 0) {
    for (const doc in results) {
      output += `File: ${doc}, Hits: ${results[doc]}\n`;
    }
  } else {
    output += `${query} doesn\'t exist`;
  }
 

  fs.appendFile('results.txt', output, err => {
    if (err) {
      console.error('Error saving search results:', err);
    }
  });
}

// Read files and build the index
function buildIndex() {
  const files = fs.readdirSync('documents');
  for (const file of files) {
    const docId = file;
    const data = fs.readFileSync(`documents/${file}`, 'utf8');
    const tokens = tokenizeDocument(data);
    addToIndex(docId, tokens);
  }
}

// Main function to handle user input and perform searches
function searchEngine() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter search query (or "exit" to quit): ', query => {
    if (query === 'exit') {
      rl.close();
      return;
    }

    const results = performSearch(query);
    saveSearchResults(query, results);

    console.log('Search results:');
    if (Object.keys(results).length !== 0) {
      for (const doc in results) {
        console.log(`File: ${doc}, Hits: ${results[doc]}`);
      }
    } else {
      console.log('Input doesn\'t exist');
    }

    searchEngine(); // Recursive call to continue searching
  });
}

// Initialize the search engine
buildIndex();
searchEngine();

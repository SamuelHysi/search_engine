# search_engine
This is a search engine where the user searches for a word from a group of documents and the output is the document where the word is and its frequency.

## Technical explanation

In the provided code each function has a specific purpose. The main logic is in the **`searchEngine`** function, which allows users to enter search queries and displays the results. Here is a quick rundown of the program:

   **Command to start your program using the terminal:** node search_engine.js

```jsx
const readline = require('readline');
const fs = require('fs');
```

1. These lines import the necessary modules: **`readline`** for reading user input from the console and **`fs`** for file system operations.

```jsx
const index = {};
```

1. This creates an empty object called **`index`** which will be used to store the search engine index.

```jsx
function tokenizeDocument(document) {
return document.toLowerCase().split(/\W+/).filter(token => token.length > 0);
}
```

1. The **`tokenizeDocument`** function takes a **`document`** string as input and performs three steps: converting the document to lowercase, splitting it into tokens based on non-word characters, and filtering out any empty tokens. The output is an array of tokens representing the words in the document that will be used for indexing and searching in the search engine.

```jsx
function addToIndex(docId, tokens) {
  for (const token of tokens) {
    if (!index[token]) {
      index[token] = [];
    }
    index[token].push(docId);
  }
}
```

1. The **`addToIndex`** function is responsible for adding a document to the search engine index. It takes two parameters: **`docId`**, which represents the document ID (file name), and **`tokens`**, which is an array of tokens representing the words in the document.

By iterating through the **`tokens`** array and adding the **`docId`** to the appropriate arrays in the **`index`** object, the **`addToIndex`** function effectively builds the inverted index. The inverted index allows for efficient retrieval of documents based on the presence of specific tokens.

In summary, the **`addToIndex`** function adds a document to the search engine index by iterating over the tokens, checking if each token exists in the index, creating a new array if necessary, and then appending the document ID to the array associated with the token in the index object. This process ensures that the search engine can later retrieve documents based on the tokens they contain.

```jsx
function search(token) {
  return index[token] || [];
}
```

1. This is a function named **`search`** that takes a **`token`** as input and returns an array of document IDs (file names) that contain that **`token`**.
It retrieves the array associated with the **`token`** key in the **`index`** object. If the **`token`** is not found, it returns an empty array.

```jsx
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
```

1. The **`performSearch`** function takes a **`query`** as input, tokenizes it into individual words, performs a search for each token, and generates a results object that stores the document IDs and their frequencies in the search results. The function utilizes the **`tokenizeDocument`** function to tokenize the query and the **`search`** function to retrieve the document IDs associated with each token.

```jsx
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
```

1. The **`saveSearchResults`** function takes the search **`query`** and the **`results`** object as inputs. It generates a formatted output string that includes the search query and the document IDs with their corresponding hit counts. The function then appends this output string to a file named 'results.txt'. If there is an error during the file-saving process, it logs an error message to the console.

```jsx
function buildIndex() {
  const files = fs.readdirSync('documents');
  for (const file of files) {
    const docId = file;
    const data = fs.readFileSync(`documents/${file}`, 'utf8');
    const tokens = tokenizeDocument(data);
    addToIndex(docId, tokens);
  }
}
```

1. The **`buildIndex`** function reads the file names from the 'documents' directory, iterates over each file, reads its content, tokenizes the content into tokens, and adds the document (identified by its document ID) along with its tokens to the search engine index using the **`addToIndex`** function. This process is performed for each file present in the 'documents' directory, effectively building the search engine index.

```jsx
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
```

1. The **`searchEngine`** function sets up an interface to interact with the user, prompts the user for a search query, performs the search using the **`performSearch`** function, saves the search results to a file using the **`saveSearchResults`** function, displays the search results in the console, and then recursively calls itself to continue the search process. It provides a user-friendly way to interact with the search engine and retrieve search results.

```jsx
buildIndex();
searchEngine();
```

1. These lines initialize the search engine by calling the **`buildIndex`** function to read files and build the index, and then calling the **`searchEngine`** function to start the search engine program.

Each function has a specific purpose, such as tokenizing documents, adding documents to the index, performing searches, saving search results, and handling user input. The main logic is in the **`searchEngine`** function, which allows users to enter search queries and displays the results.

**Bonus:** In this case, we use a **`TrieNode`** class representing each node in the trie. The **`SearchEngine`** class uses the trie data structure to store the inverted index. The tokens are inserted into the trie while keeping track of hits and file names at each node.

The search process remains the same, but it now performs searches using the trie structure, navigating through the nodes based on the characters of the search token. The search results are then written to the 'results.txt.

Overall, the Trie data structure is well-suited for search engines because it offers efficient prefix-based searching, reduced memory usage, and improved query performance compared to simple array-based approaches. It is particularly advantageous when dealing with larger document collections and frequent search queries.


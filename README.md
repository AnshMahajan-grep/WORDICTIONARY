# Dictionary Web App

A simple dictionary web application that allows users to search for words, bookmark them, and view recent searches. The app fetches word definitions using an API and stores bookmarked words in local storage.

## Features
- Search for word definitions using an external dictionary API
- Bookmark words for later reference
- View recent searches
- Responsive UI with a clean and elegant design
- Local storage support for persisting bookmarks
- Fetch and display random quotes from external APIs

## Requirements
- **Node.js** (for development & running the project)
- **API Key** for the dictionary API (if required)
- **Bootstrap** for UI styling

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AnshMahajan-grep/WORDICTIONARY.git
   cd WORDICTIONARY
   ```

## API Usage

### Dictionary API
This application fetches word definitions from an external dictionary API.

- Example API Endpoint:
  ```bash
  https://api.dictionaryapi.dev/api/v2/entries/en/<word>
  ```
- Sample Response:
  ```json
  [
    {
      "word": "example",
      "meanings": [
        {
          "partOfSpeech": "noun",
          "definitions": [
            {
              "definition": "A thing characteristic of its kind."
            }
          ]
        }
      ]
    }
  ]
  ```
- API Call in JavaScript:
  ```javascript
  async function fetchWord(word) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    console.log(data);
  }
  ```

### Quote API
This application fetches random quotes from external APIs as a supplementary feature.

- Primary API Endpoint:
  ```bash
  https://type.fit/api/quotes
  ```
- Fallback API Endpoint:
  ```bash
  https://api.quotable.io/random
  ```
- API Call in JavaScript:
  ```javascript
  async function displayQuote() {
    try {
      const response = await fetch("https://type.fit/api/quotes");
      if (!response.ok) throw new Error("Failed to fetch from Type.fit");
  
      const data = await response.json();
      let quote_num = Math.floor(Math.random() * data.length);
      quote.innerHTML = `"${data[quote_num].text}"`;
      author.innerHTML = `~ ${data[quote_num].author || "Unknown"}`;
    } catch (error) {
      console.error("Error fetching Type.fit API:", error);
      // Fallback API
      try {
        const res = await fetch("https://api.quotable.io/random");
        if (!res.ok) throw new Error("Failed to fetch from Quotable.io");
  
        const data = await res.json();
        quote.innerHTML = `"${data.content}"`;
        author.innerHTML = `~ ${data.author}`;
      } catch (fallbackError) {
        quote.innerHTML = `"Failed to fetch quote. Try again later!"`;
        author.innerHTML = `~ System`;
      }
    }
  }
  ```

## Local Storage
- Bookmarked words are stored in local storage under the key `bookmarked_words`.
- Recent searches can also be managed via local storage.

## Project Structure
```
📂 WORDICTIONARY
│-- 📜 index.html      # Main HTML file
│-- 📜 script.js       # Main JavaScript file
│-- 📜 style.css       # Main CSS file
│-- 📜 README.md       # Documentation
```


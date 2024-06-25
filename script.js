const apiKey = "API_KEY";
const bookContainer = document.getElementById("bookContainer");
const paginationContainer = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

let currentPage = 1;
let totalItems = 0;
const itemsPerPage = 16;

document.addEventListener("DOMContentLoaded", () => {
  fetchRandomBooks();
});

searchButton.addEventListener("click", () => {
  currentPage = 1;
  fetchBooks(searchInput.value);
});

function fetchRandomBooks() {
  const queryArray = [
    "pretty",
    "hello",
    "king",
    "learn",
    "kind",
    "fairy",
    "cloud",
    "search",
  ];
  var r = Math.floor(Math.random() * queryArray.length);
  var randomQuery = queryArray[r];
  const url = `https://www.googleapis.com/books/v1/volumes?q=${randomQuery}&startIndex=0&maxResults=${itemsPerPage}&key=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      totalItems = data.totalItems;
      displayBooks(data.items);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function fetchBooks(query = "") {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${itemsPerPage}&key=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      totalItems = data.totalItems;
      displayBooks(data.items);
      setupPagination();
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function displayBooks(books) {
  bookContainer.innerHTML = "";

  if (books && books.length > 0) {
    books.forEach((book) => {
      const bookInfo = book.volumeInfo;
      const bookCard = document.createElement("div");
      bookCard.className = "book-card";

      const thumbnail = bookInfo.imageLinks
        ? bookInfo.imageLinks.thumbnail
        : "https://via.placeholder.com/150";
      const title = bookInfo.title;
      const authors = bookInfo.authors
        ? bookInfo.authors.join(", ")
        : "Unknown Author";
      const buyLink = bookInfo.infoLink;

      bookCard.innerHTML = `
                <img src="${thumbnail}" alt="Book cover">
                <h3>${title}</h3>
                <p>${authors}</p>
                <a href="${buyLink}" target="_blank">Buy</a>
            `;

      bookContainer.appendChild(bookCard);
    });
  } else {
    bookContainer.innerHTML = "<p>No books found</p>";
  }
}

function setupPagination() {
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages > 1) {
    if (currentPage > 1) {
      const prevButton = document.createElement("button");
      prevButton.textContent = "Previous";
      prevButton.addEventListener("click", () => {
        currentPage--;
        fetchBooks(searchInput.value);
      });
      paginationContainer.appendChild(prevButton);
    }

    if (currentPage < totalPages) {
      const nextButton = document.createElement("button");
      nextButton.textContent = "Next";
      nextButton.addEventListener("click", () => {
        currentPage++;
        fetchBooks(searchInput.value);
      });
      paginationContainer.appendChild(nextButton);
    }
  }
}

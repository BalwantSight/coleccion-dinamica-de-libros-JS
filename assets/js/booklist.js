// Definición de variables
let books = [];
let bookId = 0;

// Referencia de elementos del DOM
const bookTitleInput = document.getElementById("bookTitle");
const bookAuthorInput = document.getElementById("bookAuthor");
const bookYearInput = document.getElementById("bookYear");
const bookNationalityInput = document.getElementById("bookNationality");
const bookTable = document.getElementById("bookTable");
const totalCounter = document.getElementById("totalCounter");
const addBookBtn = document.getElementById("addBookBtn");
const downloadListBtn = document.getElementById("downloadListBtn");

// Funciones para manipular los libros
function addBook() {
  const title = bookTitleInput.value.trim();
  const author = bookAuthorInput.value.trim();
  const year = bookYearInput.value.trim();
  const nationality = bookNationalityInput.value.trim();

  // Verificar si algún campo está vacío
  if (![title, author, year, nationality].every(Boolean)) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  bookId++;
  const newBook = { id: bookId, title, author, year, nationality };
  books.push(newBook);
  clearInputs();
  renderBooks();
  toggleDownloadButtonVisibility();
}

function deleteBook(id) {
  books = books.filter((book) => book.id !== id);
  updateBookIds();
  renderBooks();
  toggleDownloadButtonVisibility();
}

function updateBookIds() {
  books.forEach((book, index) => {
    book.id = index + 1;
  });
  bookId = books.length > 0 ? books.length : 0;
}

function clearInputs() {
  [bookTitleInput, bookAuthorInput, bookYearInput, bookNationalityInput].forEach(
    (input) => (input.value = "")
  );
}

function toggleDownloadButtonVisibility() {
  downloadListBtn.style.display = books.length > 0 ? "inline-block" : "none";
}

function downloadBookList() {
  const content = generateCSVContent();
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Colección_de_libros.csv";
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a); // Elimina el enlace después de la descarga
}

function generateCSVContent() {
  return (
    "Nº,Title,Author,Year,Nationality\n" +
    books
      .map(
        (book) =>
          `${book.id},"${book.title}","${book.author}",${book.year},"${book.nationality}"`
      )
      .join("\n")
  );
}

// Asignación de eventos a elementos del DOM
addBookBtn.addEventListener("click", addBook);
document.getElementById("downloadListBtn").addEventListener("click", downloadBookList);

// Función para renderizar los libros
function renderBooks() {
  bookTable.innerHTML = "";

  books.forEach((book) => {
    const row = document.createElement("tr");

    ["id", "title", "author", "year", "nationality"].forEach((prop) => {
      const cell = document.createElement("td");
      cell.textContent = book[prop];
      row.appendChild(cell);
    });

    const actionsCell = document.createElement("td");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "❌";
    deleteButton.addEventListener("click", () => deleteBook(book.id));
    actionsCell.appendChild(deleteButton);

    row.appendChild(actionsCell);
    bookTable.appendChild(row);
  });

  totalCounter.textContent = books.length;
}

// Actualización de IDs de libros iniciales
updateBookIds();

// Renderización de libros iniciales
renderBooks();
toggleDownloadButtonVisibility(); // Para ocultar el botón Descargar Lista al principio

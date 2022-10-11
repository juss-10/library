const myLibrary = [];
const saveBookModal = document.querySelector('[data-library-modal="save-book"]');
const saveBookForm = document.querySelector('[data-library-form="save-book"]');
const openBookFormButton = document.querySelector('[data-library-button="open-book-form"]');
const submitBookFormButton = document.querySelector('[data-library-button="submit-book-form"]');
const cancelBookFormButton = document.querySelector('[data-library-button="cancel-book-form"]');

// Form inputs

const titleInput = document.querySelector('[data-library-input="title"]');
const authorInput = document.querySelector('[data-library-input="author"]');
const pageCountInput = document.querySelector('[data-library-input="page-count"]');
const pagesReadInput = document.querySelector('[data-library-input="pages-read"]');
const currentBookInput = document.querySelector('[data-library-input="current-book"]');

// Event listeners

openBookFormButton.addEventListener("click", () => openModal(saveBookModal))
cancelBookFormButton.addEventListener("click", () => closeModal(saveBookModal))
saveBookForm.addEventListener("submit", saveBookHandler)

// Modals

function openModal(modal) {
    modal.classList.add("open-modal")
    document.body.classList.add("no-scroll")
}

function closeModal(modal) {
    modal.classList.remove("open-modal")
    document.body.classList.remove("no-scroll")
}

function saveBookHandler(event) {
    event.preventDefault()
    saveBookToLibrary()
}

function Book(title, author, pageCount, pagesRead, currentBook) {
    this.title = title;
    this.author = author;
    this.pageCount = pageCount;
    this.pagesRead = pagesRead;
    this.percentRead = (this.pagesRead / this.pageCount) * 100;
    this.finishedReading = this.percentRead === 100;
    this.currentBook = (this.finishedReading) ? false : currentBook;
}

function saveBookToLibrary() {
    const title = titleInput.value;
    const author = authorInput.value;
    const pageCount = getPageCount();
    const pagesRead = getPagesRead();
    const currentBook = currentBookInput.checked;
    const book = new Book(title, author, pageCount, pagesRead, currentBook);
    myLibrary.push(book)
}

function getPageCount() {
    return Number(pageCountInput.value)
}

function getPagesRead() {
    return Number(pagesReadInput.value)
}
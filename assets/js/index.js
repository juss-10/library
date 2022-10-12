const myLibrary = [];
const saveBookModal = document.querySelector('[data-library-modal="save-book"]');
const saveBookForm = document.querySelector('[data-library-form="save-book"]');
const openBookFormButton = document.querySelector('[data-library-button="open-book-form"]');
const submitBookFormButton = document.querySelector('[data-library-button="submit-book-form"]');
const cancelBookFormButton = document.querySelector('[data-library-button="cancel-book-form"]');
const currentBookListContainer = document.querySelector('[data-library-container="current-book"]');

// Form inputs

const titleInput = document.querySelector('[data-library-input="title"]');
const authorInput = document.querySelector('[data-library-input="author"]');
const pageCountInput = document.querySelector('[data-library-input="page-count"]');
const pagesReadInput = document.querySelector('[data-library-input="pages-read"]');
const currentBookInput = document.querySelector('[data-library-input="current-book"]');

// Book list containers

const currentBook = document.querySelector('[data-library-list="current"]');
const readingList = document.querySelector('[data-library-list="reading"]');
const finishedReadingList = document.querySelector('[data-library-list="finished"]');

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
    showLibraryBook()
    closeModal(saveBookModal)
}

// Create and store books

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

// Show stored books

function showLibraryBook() {
    const book = myLibrary[myLibrary.length - 1];
    const bookHtml = getBookHtml(book)
    setBookHtml(book, bookHtml)
}

function getBookHtml() {
    const book = myLibrary[myLibrary.length - 1];

    return `
        <div class="card">
            <div class="card-image">
                <span class="material-symbols-outlined card-image-icon">menu_book</span>
            </div>
            <div class="card-content">
                <div class="card-top row">
                    <div class="card-info">
                        <h3 class="book-title">${book.title}</h3>
                        <p class="book-author">${book.author}</p>
                    </div>
                    <div class="card-controls" data-library-book-id="${book.id}">
                        <span class="material-symbols-outlined card-control" data-library-button="edit-book">edit</span>
                        <span class="material-symbols-outlined card-control" data-library-button="delete-book">delete</span>
                    </div>
                </div>
                <div class="card-bottom">
                    <label class="meter-label">
                        <span>${book.percentRead.toFixed(2)}% completed</span>
                        <meter min="0" max="100" value="${book.percentRead}"></meter>
                    </label>
                </div>
            </div>
        </div>
    `;
}

function setBookHtml(book, bookHtml) {
    const html = DOMPurify.sanitize(bookHtml);

    if (book.currentBook) {
        showCurrentBook()
        currentBook.innerHTML = html;
        readingList.insertAdjacentHTML("beforeend", html)
    } else if (!book.finishedReading) {
        readingList.insertAdjacentHTML("beforeend", html)
    } else {
        finishedReadingList.insertAdjacentHTML("beforeend", html)
    }
}

function showCurrentBook() {
    currentBookListContainer.classList.add("block")
}
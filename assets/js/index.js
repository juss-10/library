const myLibrary = [];
const saveBookModal = document.querySelector('[data-library-modal="save-book"]');
const saveBookForm = document.querySelector('[data-library-form="save-book"]');
const openBookFormButton = document.querySelector('[data-library-button="open-book-form"]');
const submitBookFormButton = document.querySelector('[data-library-button="submit-book-form"]');
const cancelBookFormButton = document.querySelector('[data-library-button="cancel-book-form"]');
const currentBookListContainer = document.querySelector('[data-library-container="current-book"]');
const readingListTab = document.querySelector('[data-library-list-tab="reading"]');
const finishedReadingListTab = document.querySelector('[data-library-list-tab="finished"]');

// Form inputs

const titleInput = document.querySelector('[data-library-input="title"]');
const authorInput = document.querySelector('[data-library-input="author"]');
const pageCountInput = document.querySelector('[data-library-input="page-count"]');
const pagesReadInput = document.querySelector('[data-library-input="pages-read"]');
const currentBookInput = document.querySelector('[data-library-input="current-book"]');
const idInput = document.querySelector('[data-library-input="id"]');

// Book list containers

const currentBook = document.querySelector('[data-library-list="current"]');
const readingList = document.querySelector('[data-library-list="reading"]');
const finishedReadingList = document.querySelector('[data-library-list="finished"]');

// Event listeners

openBookFormButton.addEventListener("click", () => openModal(saveBookModal))
cancelBookFormButton.addEventListener("click", () => {
    closeModal(saveBookModal)
    resetForm(saveBookForm)
})
saveBookForm.addEventListener("submit", saveBookHandler)
readingListTab.addEventListener("click", setBookList)
finishedReadingListTab.addEventListener("click", setBookList)

// Modals

function openModal(modal) {
    modal.classList.add("open-modal")
    document.body.classList.add("no-scroll")
}

function closeModal(modal) {
    modal.classList.remove("open-modal")
    document.body.classList.remove("no-scroll")
}

function resetForm(form) {
    form.reset()
}

function saveBookHandler(event) {
    event.preventDefault()
    saveBookToLibrary()
    const book = myLibrary[myLibrary.length - 1];
    showLibraryBook(book)
    enableBookControls(book)
    closeModal(saveBookModal)
    resetForm(saveBookForm)
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
    const hasId = idInput.value !== "";
    const book = new Book(title, author, pageCount, pagesRead, currentBook);

    if (hasId) {
        const bookId = Number(idInput.value);
        myLibrary[bookId] = book;
        myLibrary[bookId].id = bookId;
    } else {
        myLibrary.push(book)
        const bookId = myLibrary.indexOf(book);
        book.id = bookId;
    }
}

function getPageCount() {
    return Number(pageCountInput.value)
}

function getPagesRead() {
    return Number(pagesReadInput.value)
}

// Show stored books

function showLibraryBook(book) {
    setBookHtml(book, getBookHtml(book))
}

function getBookHtml(book) {
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

function hideCurrentBook() {
    currentBookListContainer.classList.remove("block")
}

function setBookList(event) {
    const isActiveTab = event.target.classList.contains("active-tab");

    if (!isActiveTab) {
        readingList.classList.toggle("no-display")
        readingListTab.classList.toggle("active-tab")
        finishedReadingList.classList.toggle("no-display")
        finishedReadingListTab.classList.toggle("active-tab")
    }
}

function enableBookControls(book) {
    enableBookControl(book, '[data-library-button="edit-book"]', () => editBookHandler(book))
    enableBookControl(book, '[data-library-button="delete-book"]', () => deleteBookHandler(book))
}

function enableBookControl(book, controlButtonSelector, callback) {
    const bookControls = Array.from(document.querySelectorAll(`[data-library-book-id="${book.id}"]`));
    const bookControlButtons = bookControls.map(bookControl => bookControl.querySelector(controlButtonSelector));
    bookControlButtons.forEach(bookControlButton => bookControlButton.addEventListener("click", callback))
}

function editBookHandler(book) {
    setBookInputs(book)
    openModal(saveBookModal)
}

function setBookInputs(book) {
    titleInput.value = book.title;
    authorInput.value = book.author;
    pageCountInput.value = book.pageCount;
    pagesReadInput.value = book.pagesRead;
    currentBookInput.checked = book.currentBook;
    idInput.value = book.id;
}

function deleteBookHandler(book) {
    const confirmDeleteModal = document.querySelector('[data-library-modal="confirm-delete"]');
    const confirmDeleteButton = document.querySelector('[data-library-button="confirm-book-delete"]');
    const cancelDeleteButton = document.querySelector('[data-library-button="cancel-book-delete"]');

    openModal(confirmDeleteModal)

    confirmDeleteButton.addEventListener("click", () => {
        const deletedBookId = book.id;
        deleteBook(book)
        updateBookIds(deletedBookId)
        closeModal(confirmDeleteModal)
    })

    cancelDeleteButton.addEventListener("click", () => closeModal(confirmDeleteModal))
}

function deleteBook(book) {
    const bookIdElements = document.querySelectorAll(`[data-library-book-id="${book.id}"]`);
    bookIdElements.forEach(bookIdElement => bookIdElement.closest(".card").remove())
    myLibrary.splice(book.id, 1)

    const hasCurrentBook = Number(currentBook.children.length);

    if (!hasCurrentBook) {
        hideCurrentBook()
    }
}

function updateBookIds(deletedBookId) {
    const idElements = Array.from(document.querySelectorAll("[data-library-book-id]"));
    let ids = idElements.map(idElement => Number(idElement.dataset.libraryBookId));
    ids = [...new Set(ids)].sort((a, b) => a - b);
    const idsToUpdate = [];

    ids.forEach(id => idsToUpdate.push(
        Array.from(document.querySelectorAll(`[data-library-book-id="${id}"]`))
    ))

    idsToUpdate.forEach(arrayOfIds => {
        arrayOfIds.forEach(idElement => {
            const id = Number(idElement.dataset.libraryBookId);

            if (id > deletedBookId) {
                idElement.dataset.libraryBookId = id - 1;
            }
        })
    })

    myLibrary.forEach(book => {
        if (book.id > deletedBookId) {
            book.id = book.id - 1;
        }
    })
}
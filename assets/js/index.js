import { formInput, libraryList } from "./constants.js";
import { validateInput, validateForm, openModal, closeModal, resetForm, getPageInput, setBookList, toggleListMessage } from "./utils.js";
import { showLibraryBook } from "./html.js";
import { enableBookControls } from "./controls.js";

const myLibrary = [];
const saveBookModal = document.querySelector('[data-library-modal="save-book"]');
const saveBookForm = document.querySelector('[data-library-form="save-book"]');
const openBookFormButton = document.querySelector('[data-library-button="open-book-form"]');
const cancelBookFormButton = document.querySelector('[data-library-button="cancel-book-form"]');

saveBookForm.addEventListener("submit", saveBookHandler)
libraryList.readingTab.addEventListener("click", setBookList)
libraryList.finishedTab.addEventListener("click", setBookList)
formInput.pageCountInput.addEventListener("input", togglePagesReadInput)
formInput.inputs.forEach(bookFormInput => bookFormInput.addEventListener("input", validateInput))
openBookFormButton.addEventListener("click", () => openModal(saveBookModal))
cancelBookFormButton.addEventListener("click", () => {
    closeModal(saveBookModal)
    resetForm(saveBookForm)
})

function saveBookHandler(event) {
    event.preventDefault()
    const valid = validateForm();

    if (valid) {
        const book = saveBookToLibrary();
        showLibraryBook(book)
        toggleListMessage()
        enableBookControls(book)
        closeModal(saveBookModal)
        resetForm(saveBookForm)
    }
}

function saveBookToLibrary() {
    const { titleInput, authorInput, pageCountInput, pagesReadInput, currentBookInput, idInput } = formInput;
    const isCurrentBook = currentBookInput.checked;
    const hasId = idInput.value !== "";
    const book = new Book(titleInput.value, authorInput.value, Number(pageCountInput.value), Number(pagesReadInput.value), isCurrentBook);

    if (hasId) {
        const bookId = Number(idInput.value);
        myLibrary[bookId] = book;
        myLibrary[bookId].id = bookId;
    } else {
        myLibrary.push(book)
        const bookId = myLibrary.indexOf(book);
        book.id = bookId;
    }

    if (isCurrentBook) {
        updateCurrentBook(book)
    }

    idInput.value = "";
    return myLibrary[myLibrary.indexOf(book)]
}

class Book {
    constructor(title, author, pageCount, pagesRead, isCurrentBook) {
        this.title = title;
        this.author = author;
        this.pageCount = pageCount;
        this.pagesRead = pagesRead;
        this.percentRead = (this.pagesRead / this.pageCount) * 100;
        this.finishedReading = this.percentRead === 100;
        this.currentBook = (this.finishedReading) ? false : isCurrentBook;
    }
}

function updateCurrentBook(currentBook) {
    myLibrary.forEach(book => {
        if (book.currentBook && book.id !== currentBook.id) {
            book.currentBook = false;
        }
    })
}

function togglePagesReadInput() {
    const pageInput = getPageInput();
    const { pagesReadInput } = formInput;
    pagesReadInput.setAttribute("max", pageInput.pageCount)

    if (pageInput.hasPageCountInput && pageInput.hasValidPageRange) {
        pagesReadInput.disabled = false;
    } else if (!pageInput.hasPageCountInput) {
        pagesReadInput.value = "";
        pagesReadInput.disabled = true;
        pagesReadInput.classList.remove("valid", "invalid")
    } else if (!pageInput.hasValidPageRange) {
        pagesReadInput.value = "";
        pagesReadInput.classList.remove("valid", "invalid")
    }
}

export { myLibrary }
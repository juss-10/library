import { myLibrary } from "./index.js";
import { formInput } from "./constants.js";
import { getPageInput, openModal, closeModal, hideCurrentBook, toggleListMessage } from "./utils.js";

const saveBookModal = document.querySelector('[data-library-modal="save-book"]');
const currentBookList = document.querySelector('[data-library-list="current"]');

export function enableBookControls(book) {
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
    const { titleInput, authorInput, pageCountInput, pagesReadInput, currentBookInput, idInput } = formInput;

    titleInput.value = book.title;
    authorInput.value = book.author;
    pageCountInput.value = book.pageCount;
    pagesReadInput.value = book.pagesRead;
    currentBookInput.checked = book.currentBook;
    currentBookInput.disabled = book.finishedReading;
    idInput.value = book.id;
    const pageInput = getPageInput();
    pagesReadInput.setAttribute("max", pageInput.pageCount)
}

function deleteBookHandler(book) {
    const confirmDeleteModal = document.querySelector('[data-library-modal="confirm-delete"]');
    const confirmDeleteButton = document.querySelector('[data-library-button="confirm-book-delete"]');
    const cancelDeleteButton = document.querySelector('[data-library-button="cancel-book-delete"]');
    const hasDeleteEventListeners = confirmDeleteButton.dataset.libraryEvent === "delete"; 

    openModal(confirmDeleteModal)

    if (!hasDeleteEventListeners) {
        confirmDeleteButton.dataset.libraryEvent = "delete";
        confirmDeleteButton.addEventListener("click", confirmDelete)
        cancelDeleteButton.addEventListener("click", cancelDelete)
    }

    function confirmDelete() {
        deleteBook(book)
        toggleListMessage()
        closeModal(confirmDeleteModal)
        resetDeleteListeners()
    }

    function cancelDelete() {
        closeModal(confirmDeleteModal)
        resetDeleteListeners()
    }

    function resetDeleteListeners() {
        confirmDeleteButton.removeAttribute("data-library-event");
        confirmDeleteButton.removeEventListener("click", confirmDelete)
        cancelDeleteButton.removeEventListener("click", cancelDelete)
    }
}

function deleteBook(book) {
    const bookIdElements = document.querySelectorAll(`[data-library-book-id="${book.id}"]`);
    bookIdElements.forEach(bookIdElement => bookIdElement.closest(".card").remove())
    myLibrary.splice(book.id, 1)

    const hasCurrentBook = Number(currentBookList.children.length);

    if (!hasCurrentBook) {
        hideCurrentBook()
    }

    updateBookIds(book.id)
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

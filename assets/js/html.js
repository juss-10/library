import { libraryList } from "./constants.js";
import { showCurrentBook, hideCurrentBook } from "./utils.js";

export function showLibraryBook(book) {
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

    removeBookHtml(book)

    if (book.currentBook) {
        showCurrentBook()
        libraryList.current.innerHTML = html;
        libraryList.reading.insertAdjacentHTML("beforeend", html)
    } else if (!book.finishedReading) {
        libraryList.reading.insertAdjacentHTML("beforeend", html)
    } else {
        libraryList.finished.insertAdjacentHTML("beforeend", html)
    }
}

function removeBookHtml(book) {
    const idElements = Array.from(document.querySelectorAll(`[data-library-book-id="${book.id}"]`));
    const bookCards = idElements.map(idElement => idElement.closest(".card"));
    const hasBooksToRemove = bookCards.length > 0;
    const isSameAsCurrentBook = (libraryList.current.querySelector(`[data-library-book-id="${book.id}"]`)) ? true : false;

    if (hasBooksToRemove) {
        bookCards.forEach(bookCard => bookCard.remove())
    }

    if (isSameAsCurrentBook && !book.currentBook) {
        hideCurrentBook()
    }
}
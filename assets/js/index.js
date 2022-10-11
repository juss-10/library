const saveBookModal = document.querySelector('[data-library-modal="save-book"]');
const openBookFormButton = document.querySelector('[data-library-button="open-book-form"]');
const submitBookFormButton = document.querySelector('[data-library-button="submit-book-form"]');
const cancelBookFormButton = document.querySelector('[data-library-button="cancel-book-form"]');

// Event listeners

openBookFormButton.addEventListener("click", () => openModal(saveBookModal))
cancelBookFormButton.addEventListener("click", () => closeModal(saveBookModal))

function openModal(modal) {
    modal.classList.add("open-modal")
    document.body.classList.add("no-scroll")
}

function closeModal(modal) {
    modal.classList.remove("open-modal")
    document.body.classList.remove("no-scroll")
}
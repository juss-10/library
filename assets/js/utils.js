import { formInput, libraryList } from "./constants.js";

const currentBookListContainer = document.querySelector('[data-library-container="current-book"]');

export function openModal(modal) {
    modal.classList.add("open-modal")
    document.body.classList.add("no-scroll")
}

export function closeModal(modal) {
    modal.classList.remove("open-modal")
    document.body.classList.remove("no-scroll")
}

export function resetForm(form) {
    form.reset()
    formInput.inputs.forEach(input => input.classList.remove("valid", "invalid"))
    formInput.idInput.value = "";
    formInput.currentBookInput.checked = false;
    formInput.currentBookInput.disabled = false;
}

export function getPageInput() {
    const pageCount = Number(formInput.pageCountInput.value);
    const pagesRead = Number(formInput.pagesReadInput.value);
    const hasPageCountInput = formInput.pageCountInput.value !== "";
    const hasPagesReadInput = formInput.pagesReadInput.value !== "";
    const hasValidPageInput = hasPagesReadInput && hasPageCountInput;
    const hasValidPageRange = pagesRead <= pageCount;
    const hasValidCurrentBookRange = pageCount > 0 && pagesRead < pageCount && hasValidPageInput;
    const hasValidPageCount = pageCount > 0 && hasValidPageRange && formInput.pageCountInput.value !== "";
    const hasValidPagesRead = pagesRead >= 0 && hasValidPageRange && formInput.pagesReadInput.value !== "";
    
    return {
        pageCount,
        pagesRead,
        hasValidPageRange,
        hasValidPageCount,
        hasValidPagesRead,
        hasPageCountInput,
        hasPagesReadInput,
        hasValidCurrentBookRange
    }
}

export function validateForm() {
    const formInputs = formInput.inputs.filter(input => input !== formInput.idInput);
    const valid = formInputs.every(input => {
        const isValidInput = input.validity.valid;
        const hasInput = input.value !== "";

        return isValidInput && hasInput;
    });

    return valid;
}

export function validateInput() {
    const hasValidInput = this.validity.valid && this.value !== "";
    const pageInput = getPageInput();

    switch (this) {
        case formInput.pageCountInput:
            (pageInput.hasValidPageCount) ? setInputAsValid(this) : setInputAsInvalid(this);
            break;
        case formInput.pagesReadInput:
            (pageInput.hasValidPagesRead) ? setInputAsValid(this) : setInputAsInvalid(this);
            break;
        case this:
            (hasValidInput) ? setInputAsValid(this) : setInputAsInvalid(this);
    }

    if (!pageInput.hasValidCurrentBookRange) {
        formInput.currentBookInput.checked = false;
        formInput.currentBookInput.disabled = true;
    } else {
        formInput.currentBookInput.disabled = false;
    }
}

export function showCurrentBook() {
    currentBookListContainer.classList.add("block")
}

export function hideCurrentBook() {
    currentBookListContainer.classList.remove("block")
}

export function setBookList(event) {
    const isActiveTab = event.target.classList.contains("active-tab");

    if (!isActiveTab) {
        libraryList.reading.classList.toggle("no-display")
        libraryList.readingTab.classList.toggle("active-tab")
        libraryList.finished.classList.toggle("no-display")
        libraryList.finishedTab.classList.toggle("active-tab")
    }
}

export function toggleListMessage() {
    const lists = [libraryList.reading, libraryList.finished];

    for (const list of lists) {
        const hasSavedBooks = list.children.length > 1;
        const listMessage = list.querySelector("[data-library-text]");
        const hasVisibleMessage = window.getComputedStyle(listMessage, null).display !== "none";

        if (hasSavedBooks && hasVisibleMessage) {
            listMessage.style.display = "none";
        } else if (!hasSavedBooks && !hasVisibleMessage) {
            listMessage.removeAttribute("style")
        }
    }
}

function setInputAsValid(input) {
    input.classList.remove("invalid")
    input.classList.add("valid");
}

function setInputAsInvalid(input) {
    input.classList.remove("valid")
    input.classList.add("invalid")
}
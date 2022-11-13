const saveBookForm = document.querySelector('[data-library-form="save-book"]');

const formInput = {
    inputs: Array.from(saveBookForm.querySelectorAll("input")),
    titleInput: document.querySelector('[data-library-input="title"]'),
    authorInput: document.querySelector('[data-library-input="author"]'),
    pageCountInput: document.querySelector('[data-library-input="page-count"]'),
    pagesReadInput: document.querySelector('[data-library-input="pages-read"]'),
    currentBookInput: document.querySelector('[data-library-input="current-book"]'),
    idInput: document.querySelector('[data-library-input="id"]')
};

const libraryList = {
    current: document.querySelector('[data-library-list="current"]'),
    reading: document.querySelector('[data-library-list="reading"]'),
    finished: document.querySelector('[data-library-list="finished"]'),
    readingTab: document.querySelector('[data-library-list-tab="reading"]'),
    finishedTab: document.querySelector('[data-library-list-tab="finished"]')
};

export { formInput, libraryList }
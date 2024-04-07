const books = [];
const RENDER_EVENT = "render-books";
const SAVED_EVENT = "saved-books";
const Storage_key = "Bookshelf";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  const searchForm = document.getElementById("searchBook");
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });
});

function isStorageExist() {
  if (typeof Storage == undefined) {
    alert("Browser anda tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const visualizedData = localStorage.getItem(Storage_key);
  let data = JSON.parse(visualizedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateStatus() {
  const check = document.getElementById("inputBookIsComplete");
  return check.checked;
}

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookWriter = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const generateid = generateId();
  const isRead = generateStatus();
  const bookObject = generateShelfObject(generateid, bookTitle, bookWriter, parseInt(bookYear), isRead);
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateShelfObject(id, title, writer, year, isCompleted) {
  return {
    id,
    title,
    writer,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const unReadBook = document.getElementById("incompleteBookshelfList");
  unReadBook.innerHTML = "";
  const ReadedBook = document.getElementById("completeBookshelfList");
  ReadedBook.innerHTML = "";

  for (const ShelfItem of books) {
    const shelfElement = makeShelf(ShelfItem);
    if (!ShelfItem.isCompleted) {
      unReadBook.append(shelfElement);
    } else ReadedBook.append(shelfElement);
  }
});

function makeShelf(bookObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = bookObject.title;

  const textWriter = document.createElement("h5");
  textWriter.innerText = `Penulis : ` + bookObject.writer;

  const textYear = document.createElement("h5");
  textYear.innerText = `Tahun : ` + bookObject.year;

  const article = document.createElement("article");
  article.setAttribute("class", "book_item");
  article.append(textTitle, textWriter, textYear);
  article.setAttribute("id", `Book-${bookObject.id}`);

  const container = document.createElement("div");
  container.setAttribute("class", "action");

  if (bookObject.isCompleted) {
    const unreadedBtn = document.createElement("button");
    unreadedBtn.setAttribute("class", "green");
    unreadedBtn.innerText = `Belum Selesai Dibaca`;

    unreadedBtn.addEventListener("click", function () {
      undoBookFromReadedBookshelf(bookObject.id);
    });

    const removeBtn = document.createElement("button");
    removeBtn.setAttribute("class", "red");
    removeBtn.innerText = `Hapus Buku`;

    removeBtn.addEventListener("click", function () {
      removeBookFromBookshelf(bookObject.id);
    });

    container.append(unreadedBtn, removeBtn);
  } else {
    const readedBtn = document.createElement("button");
    readedBtn.setAttribute("class", "green");
    readedBtn.innerText = `Selesai Baca`;

    readedBtn.addEventListener("click", function () {
      addBookToReadedBookshelf(bookObject.id);
    });

    const removeBtn = document.createElement("button");
    removeBtn.setAttribute("class", "red");
    removeBtn.innerText = `Hapus Buku`;

    removeBtn.addEventListener("click", function () {
      removeBookFromBookshelf(bookObject.id);
    });

    container.append(readedBtn, removeBtn);
  }
  article.append(container);
  return article;
}

function addBookToReadedBookshelf(bookId) {
  const bookTarget = findbook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findbook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBookFromBookshelf(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;
  const option = confirm("Yakin Ingin Menghapus Buku Dari Rak?");
  if (option == true) {
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function undoBookFromReadedBookshelf(bookId) {
  const bookTarget = findbook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(Storage_key, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(Storage_key));
});

function searchBook() {
  let query = document.getElementById("searchBookTitle").value;
  let bookDisplay = books.filter((booksData) => {
    if (query === "") {
      return booksData;
    } else if (booksData.title.toLowerCase().includes(query.toLowerCase())) {
      return booksData;
    }
  });

  const unReadBook = document.getElementById("incompleteBookshelfList");
  unReadBook.innerHTML = "";
  const ReadedBook = document.getElementById("completeBookshelfList");
  ReadedBook.innerHTML = "";

  for (const ShelfItem of bookDisplay) {
    const shelfElement = makeShelf(ShelfItem);
    if (!ShelfItem.isCompleted) {
      unReadBook.append(shelfElement);
    } else ReadedBook.append(shelfElement);
  }
}

const Book = (book) => {
    return (
      <>
        <div className="book-card">
          <h2>ISBN: {book.ISBN}</h2>
          <h3>Title: {book.title}</h3>
          <h3>Author: {book.author}</h3>
          <h3>Publication Year: {book.publicationYear}</h3>

          {book.removeFun && (
            <>
              <button onClick={() => book.removeFun(book.ISBN)}>Remove</button>
            </>
          )}
        </div>
      </>
    );
}

export default Book;
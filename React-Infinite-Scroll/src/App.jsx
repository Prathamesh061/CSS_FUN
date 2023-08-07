import { useState, useRef, useCallback } from "react";
import useBookSerach from "./hooks/useBookSerach";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { loading, error, books, hasMore } = useBookSerach(query, pageNumber);

  const observer = useRef();
  const lastBookElemntRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevNum) => prevNum + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <div className="container">
      <input type="text" value={query} onChange={handleSearch} />
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastBookElemntRef} key={book}>
              {book}
            </div>
          );
        }
        return <div key={book}>{book}</div>;
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error..."}</div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import axios from "axios";

export default function useBookSerach(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
      params: { q: query, page: pageNumber },
    })
      .then((res) => {
        setHasMore(res.data.docs.length > 0);
        setBooks((prevBooks) => [
          ...new Set([...prevBooks, ...res.data.docs.map((b) => b.title)]),
        ]);

        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber]);

  useEffect(() => {
    setBooks([]);
  }, [query]);
  return { loading, error, books, hasMore };
}

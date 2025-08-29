const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

useEffect(() => {
  fetch(`${BACKEND_URL}/books`)
    .then((res) => res.json())
    .then((data) => setBooks(data))
    .catch((err) => console.error("Error fetching books:", err));
}, []);

const addBook = async (e) => {
  e.preventDefault();
  if (!newBook.title || !newBook.author) return;

  try {
    const response = await fetch(`${BACKEND_URL}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    });

    const data = await response.json();
    setBooks((prevBooks) => [...prevBooks, data]);
    setNewBook({ title: "", author: "" });
  } catch (err) {
    console.error("Error adding book:", err);
  }
};

const deleteBook = async (id) => {
  try {
    const response = await fetch(`${BACKEND_URL}/books/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
    } else {
      throw new Error("Failed to delete book");
    }
  } catch (err) {
    console.error("Error deleting book:", err);
  }
};

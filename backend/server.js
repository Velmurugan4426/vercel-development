require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Frontend URL
  methods: ["GET", "POST", "DELETE"],
}));
app.use(express.json());

// --- Connect to MongoDB Atlas ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
})
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Define Book Schema ---
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
});

const Book = mongoose.model("Book", bookSchema);

// --- Routes ---
// Get all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Add a book
app.post("/books", async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) return res.status(400).json({ error: "Title and Author are required" });

    const newBook = new Book({ title, author });
    await newBook.save();
    res.json(newBook);
  } catch (err) {
    res.status(500).json({ error: "Failed to add book" });
  }
});

// Delete a book
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete book" });
  }
});

// Test root
app.get("/", (req, res) => res.send("📚 Backend with MongoDB Atlas running!"));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

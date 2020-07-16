<template>
  <div>
    <h1>{{title}}</h1>
    <input type="text" placeholder="Search Books" v-model="searchInput" />
    <ul>
      <book-item v-for="book in searchedBooks" :key="book.id" :book="book"></book-item>
    </ul>
    <best-sellers @addBestseller="appendBestseller"></best-sellers>
    <hr />
    <h2>Filtered Books By Ownership</h2>
    <select v-model="holding">
      <option v-for="filter in filters" :key="filter">{{ filter }}</option>
    </select>
    <ul>
      <book-item v-for="book in filteredBooks" :key="book.id" :book="book"></book-item>
    </ul>
    <br />
    <hr />
    <book-form @addBook="appendBook"></book-form>
  </div>
</template>

<script>
import _ from "lodash";
import BookItem from "./BookItem";
import BookForm from "./BookForm";
import BestSellers from "./BestSellers";

export default {
  name: "BookList",
  mounted() {
    if (localStorage.getItem("books")) {
      try {
        this.books = JSON.parse(localStorage.getItem("books"));
        console.log(this.books);
      } catch (e) {
        console.log(e);
        localStorage.removeItem("books");
      }
    }
  },
  data() {
    return {
      searchInput: "",
      holding: "bought",
      filters: ["bought", "borrowed"],
      title: "All Books",
      states: ["Want to Read", "Read", "Reading"],
      books: []
    };
  },
  components: {
    BookItem,
    BookForm,
    BestSellers
  },
  computed: {
    filteredBooks() {
      return _.filter(this.books, ["ownership", this.holding]);
    },
    searchedBooks() {
      const searchFilter = book => {
        return book.title.toLowerCase().match(this.searchInput.toLowerCase());
      };
      return _.filter(this.books, searchFilter);
    }
  },
  methods: {
    appendBook(bookData) {
      this.books.push({
        title: bookData.bookTitle,
        author: bookData.bookAuthor,
        finishedReading: bookData.finishedReading,
        ownership: bookData.ownership
      });
      // Resave books to local storage, since we just added a new one
      const parsedBooks = JSON.stringify(this.books);
      localStorage.setItem("books", parsedBooks);
    },
    appendBestseller(book) {
      console.log(book);
      this.books.push({
        title: book.title,
        author: book.author,
        finishedReading: false,
        ownership: "borrowed"
      });
      // Resave books to local storage, since we just added a new one
      const parsedBooks = JSON.stringify(this.books);
      localStorage.setItem("books", parsedBooks);
    }
  }
};
</script>

<style>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: block;
  margin: 0 10px;
}
</style>

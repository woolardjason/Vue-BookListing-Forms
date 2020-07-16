<template>
  <div>
    <hr />
    <div v-if="filteredBooks.length > 0">
      <h2>NYTimes Best Sellers List</h2>
      <form v-on:submit.prevent="bookSubmit(selectedBook)" class action="#" method="post">
        <label for="all">
          All
          <input v-model="selectedFilter" type="radio" id="all" value="all" />
        </label>
        <label for="fiction">
          Fiction
        <input v-model="selectedFilter" type="radio" id="fiction" value="fiction" />
        </label>
        <label for="nonfiction">
          Nonfiction
          <input v-model="selectedFilter" type="radio" id="nonfiction" value="nonfiction" />
        </label>
        <select v-model="selectedBook" @change="bookSelected(selectedBook)">
          <option v-for="book in filteredBooks" :key="book.id">{{ book.title }}</option>
        </select>
        <button type="submit" name="button">Add Book</button>
        <br />
        <br />
        <img v-if="selectedBookImage != ''" :src="selectedBookImage"/>
      </form>
    </div>
    <div v-else><h1>Loading...</h1></div>
  </div>
</template>

<script>
import BestSellersService from "@/services/BestSellersService.js";
import BookItem from "./BookItem";

export default {
  components: {
    BookItem
  },

  mounted() {
    let lastFetchDate = localStorage.getItem("lastFetchDate");
    console.log("Last Fetch Date: ", lastFetchDate);
    if (lastFetchDate != null) {
      // Check if the lastFetchDate is today
      if (!this.isToday(lastFetchDate)) {
        // We didn't fetch today, fetch the books from NYT API.
        this.fetchBooks();
      } else {
        // lastFetchDate is today, use local storage instead
        const storedBooks = localStorage.getItem("nybsBooks");
        if (storedBooks != null) {
          this.books = JSON.parse(storedBooks);
        }
      }
    } else {
      // lastFetchDate == null, fetch the books
      this.fetchBooks();
    }
  },

  data() {
    return {
      selectedFilter: "all",
      filters: ["all", "fiction", "nonfiction"],
      books: [],
      selectedBook: "",
      selectedBookImage: ""
    };
  },

  computed: {
    filteredBooks() {
      if (this.selectedFilter == "all") {
        return this.books;
      }
      return this.books.filter(book => book.type == this.selectedFilter);
    }
  },

  methods: {
    bookSubmit(selectedBook) {
      this.books.forEach(book => {
        if (book.title == selectedBook) {
          this.$emit("addBestseller", book);
        }
      });
    },
    fetchBooks() {
      // Fetch fiction books from NYT API
      BestSellersService.getFictionBooks().then(fictionResponse => {
        let fictionBooks = fictionResponse.data["results"]["books"];
        fictionBooks.forEach(book => {
          book.type = "fiction";
        });

        this.books = fictionBooks;

        // Fetch nonfiction books from NYT API
        BestSellersService.getNonfictionBooks().then(nonfictionResponse => {
          let nonfictionBooks = nonfictionResponse.data["results"]["books"];
          nonfictionBooks.forEach(book => {
            book.type = "nonfiction";
          });

          // Combine the two arrays
          this.books = this.books.concat(nonfictionBooks);

          // Store the books into local storage
          const parsedBooks = JSON.stringify(this.books);
          localStorage.setItem("nybsBooks", parsedBooks);

          console.log(parsedBooks);

          // Store the lastFetchDate into local storage
          const now = new Date();
          localStorage.setItem("lastFetchDate", now.getTime());
        });
      });
    },
    isToday(date) {
      const today = new Date();
      const theDate = new Date(Number(date));
      return (
        theDate.getDate() === today.getDate() &&
        theDate.getMonth() === today.getMonth() &&
        theDate.getFullYear() === today.getFullYear()
      );
    },
    bookSelected(title) {
      this.books.forEach(book => {
        if (book.title === title) {
          this.selectedBookImage = book.book_image;
        }
      });
    }
  }
};
</script>

<style>
</style>

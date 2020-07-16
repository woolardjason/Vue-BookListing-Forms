import axios from "axios";

const apiClient = axios.create({
  baseURL: `https://api.nytimes.com/svc/books/v3/lists/current/`,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});
const apiKey = "JaEjlvy9z6A6DtUJeTcAOG60KONtRD9e";

export default {
  getFictionBooks() {
    return apiClient.get("/hardcover-fiction.json?api-key=" + apiKey);
  },
  getNonfictionBooks() {
    return apiClient.get("/hardcover-nonfiction.json?api-key=" + apiKey);
  }
};

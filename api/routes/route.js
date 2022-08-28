const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check');

const BookController = require('../controllers/book-api');

router.post("/addbook", checkAuth, BookController.addBook);
router.post("/process_dummy_api", checkAuth, BookController.process_log_dummy_api);

module.exports = router;
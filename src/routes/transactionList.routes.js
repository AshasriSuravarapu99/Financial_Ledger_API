const router = require("express").Router();
const controller = require("../controllers/transactionList.controller");

router.get("/", controller.listTransactions); // GET /transactions

module.exports = router;

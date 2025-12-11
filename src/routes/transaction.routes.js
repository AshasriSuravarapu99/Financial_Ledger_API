const router = require("express").Router();
const controller = require("../controllers/transaction.controller");

router.get("/:id", controller.getTransactionById);

module.exports = router;

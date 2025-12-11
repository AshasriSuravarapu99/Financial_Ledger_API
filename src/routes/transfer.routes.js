const router = require("express").Router();
const controller = require("../controllers/transfer.controller");
const validate = require("../middlewares/validate");
const { transferSchema } = require("../validations/transfer.validation");

// POST /transfers - make a transfer
router.post("/", validate(transferSchema), controller.transfer);

module.exports = router;

const router = require("express").Router();
const controller = require("../controllers/account.controller");

router.post("/", controller.createAccount);
router.get("/:id", controller.getAccountWithBalance);
router.get("/:id/ledger", controller.getLedger);

const validate = require("../middlewares/validate");
const { createAccountSchema } = require("../validations/account.validation");

router.post("/", validate(createAccountSchema), controller.createAccount);
module.exports = router;

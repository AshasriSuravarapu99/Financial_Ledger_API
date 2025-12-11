const router = require("express").Router();
const controller = require("../controllers/withdraw.controller");

router.post("/", controller.createWithdrawal);
const validate = require("../middlewares/validate");
const { withdrawSchema } = require("../validations/withdraw.validation");

router.post("/", validate(withdrawSchema), controller.createWithdrawal);

module.exports = router;

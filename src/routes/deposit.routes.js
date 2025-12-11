// src/routes/deposit.routes.js
const router = require("express").Router();
const controller = require("../controllers/deposit.controller");
const validate = require("../middlewares/validate");
const { depositSchema } = require("../validations/deposit.validation");

router.post("/", validate(depositSchema), controller.createDeposit);

router.post("/", controller.createDeposit);

module.exports = router;

"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.home );
router.post("/", ctrl.process.home );

// router.get("/login", ctrl.output.login);
// router.get("/logout", ctrl.output.logout);
// router.get("/register", ctrl.output.register);
// router.get("/chat", ctrl.output.chat);
// router.get("/test", ctrl.output.test);
// router.post("/login", ctrl.process.login );
// router.post("/register", ctrl.process.register );

module.exports = router; 
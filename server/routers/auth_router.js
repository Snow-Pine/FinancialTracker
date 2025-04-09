const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller')
const {requiresAuth} = require("express-openid-connect");

router.get("/profile", requiresAuth(), authController.getProfile);

router.get("/getAuth", authController.getAuth);

module.exports = router;
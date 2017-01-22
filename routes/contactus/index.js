'use strict';

var express = require('express');

var router = express.Router();

var contactus = require('./contactus');

router.get('/', contactus.get);
router.post('/', contactus.validateInput, contactus.sanitizeInput, contactus.saveMessage, contactus.respond);
router.get('/thankyou', contactus.thankyouRedirection);
module.exports = router;
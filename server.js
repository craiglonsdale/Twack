// only ES5 is allowed in this file
require("babel-register");
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const config = require(path.join(__dirname, argv.config));

var app = require("./app")(config);

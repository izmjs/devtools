const express = require('express');
const { resolve } = require('path');

module.exports = (app) => {
  app.use('/devtools', express.static(resolve(__dirname, '../assets/public')));
};

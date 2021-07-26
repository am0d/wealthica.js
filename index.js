const moment = require('moment');
const _ = require('lodash');
const util = require('util');
const assert = require('assert');

const Request = require('../request');

const LoginFailedError = require('../../../lib/error').LoginFailedError;
const SecurityQuestionError = require('../../../lib/error').SecurityQuestionError;

const Demo = function() {
  Demo.super_.apply(this, arguments);
};

util.inherits(Demo, Request);

// Configurable delay to simulate slow sync progress
// This is useful for testing frontend sync status push
// Also ensure "investments" event is properly being toggled
Demo.DELAY = process.env.DEMO_DELAY || 10000;

Demo.prototype.login = function(callback) {
  const institution = this.institution;
  const answered = (institution.data && institution.data.answered) || institution.credentials.answered;

  if (institution.credentials.username === 'wealthica' && institution.credentials.password === 'wealthica') {
    return callback(); // Success
  }

  if (institution.credentials.username === 'wealthica' && institution.credentials.password !== 'wealthica') {
    if (answered) return callback(); // Already answered
    return callback(new SecurityQuestionError('What\'s Anton and Cody\'s favorite programming language?', ['C++', 'JavaScript', 'Ruby']));
  }

  institution.data = undefined;
  callback(new LoginFailedError());
}

Demo.prototype.answerSecurityQuestion = function(answer, interactive, callback) {
  const institution = this.institution;

  if (answer.toLowerCase() === 'javascript')
    return callback(new SecurityQuestionError('What\'s Anton and Cody\'s other favorite programming language?'));

  if (answer.toLowerCase() !== 'ruby')
    return callback(new LoginFailedError());

  // Remember the security question was already answered
  institution.data = { answered: true };

  setTimeout(callback, this.constructor.DELAY);
}

Demo.prototype.getInvestments = function(callback) {
  const investments = [
    {id: 'demo', name:'Random Investment', type:'cash', value: Math.floor(Math.random() * 100000) / 100, currency: 'cad'},
    {id: 'demo', name:'Uncle Sam', type:'cash', value: 100, currency: 'usd'}, // Investment in USD
  ];

  setTimeout(function() {
    callback(null, investments);
  }, this.constructor.DELAY);
}

Demo.prototype.getInvestmentPositions = function(investment, callback) {
  let positions = [];
  const cash = 100;

  if (investment._id === 'demo:cash:cad') {
    positions = [{
      security: {
        symbol: 'GOOGL.DEMO',
        currency: 'usd',
        name: 'Google Inc',
        type: 'equity',
      },
      quantity: 1,
      book_value: 600,
      market_value: (480 + Math.floor(Math.random() * 24000) / 100) * 1,
    },{
      security: {
        symbol: 'AAPL.DEMO',
        currency: 'usd',
        name: 'Apple Inc.',
        type: 'equity',
      },
      quantity: 6,
      book_value: 600,
      market_value: (80 + Math.floor(Math.random() * 4000) / 100) * 6,
    },{
      security: {
        symbol: 'BB.DEMO',
        currency: 'cad',
        name: 'BlackBerry Ltd',
        type: 'equity',
      },
      quantity: 120,
      book_value: 600,
      market_value: (4 + Math.floor(Math.random() * 200) / 100) * 120,
    }];
  }

  setTimeout(function() {
    callback(null, positions, cash);
  }, this.constructor.DELAY);
}

Demo.prototype.getInvestmentTransactions = function(investment, callback) {
  if (investment._id !== 'demo:cash:cad') return callback(null, []);

  const firstDayCurrentMonth = moment.utc().startOf('month');
  const lastDayPrevMonth = firstDayCurrentMonth.clone().subtract(1, 'day');

  let transactions = [];

  // Buy 3 AAPL on first day of the month
  if (!moment().isSame(firstDayCurrentMonth, 'day')) transactions.push({
    date: firstDayCurrentMonth.toDate(),
    settlement_date: firstDayCurrentMonth.toDate(),
    type: 'buy',
    origin_type: 'Buy',
    amount: -300,
    description: 'Buy 3 AAPL on first day of the month',
    symbol: 'AAPL.DEMO',
    quantity: 3,
  });

  // Sell 3 AAPL on last day of previous month
  if (!moment().isSame(lastDayPrevMonth, 'day')) transactions.push({
    date: lastDayPrevMonth.toDate(),
    settlement_date: lastDayPrevMonth.toDate(),
    type: 'sell',
    origin_type: 'Sell',
    amount: 400,
    description: 'Sell 3 AAPL on last day of the month',
    symbol: 'AAPL.DEMO',
    quantity: -3,
  });

  setTimeout(function() {
    callback(null, transactions);
  }, this.constructor.DELAY);
}

Demo.prototype.getDocumentsList = function(callback) {
  const date = moment().startOf('month');
  const documents = [{
    date: date.toDate(),
    name: 'Statement - ' + date.format('MMMM YYYY'),
    type: 'statement',
    account: 'demo',
    url: 'https://www.rbcroyalbank.com/banking-services/_assets-custom/pdf/eStatement.pdf',
  }];

  setTimeout(function() {
    callback(null, documents);
  }, this.constructor.DELAY);
}

Demo.prototype.downloadDocument = function(document, callback) {
  this.request.get({ url: document.url, encoding: null }, function(err, response, body) {
    assert(response.statusCode === 200 && body);
    assert(body.slice(0,4).toString() === '%PDF');
    callback(null, body);
  });
}

module.exports = Demo;

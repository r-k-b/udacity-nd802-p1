'use strict';

import App from './app.js';
import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';

const main = App;

run(main, {
  DOM:  makeDOMDriver('#main__container'),
  HTTP: makeHTTPDriver()
});

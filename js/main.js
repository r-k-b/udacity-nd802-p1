'use strict';

import App from './app.js';
import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';

const main = App;

run(main, {
  DOM: makeDOMDriver('#main__container')
});

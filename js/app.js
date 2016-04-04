"use strict";

import he from 'he';
import assert from 'assert';
import {Observable, config} from 'rx';
import {div, pre, strong} from '@cycle/dom';
import {chooseEvent, isPresent, eventIdsMatch, listActions} from './appUtils';
// import appUtils from './appUtils.js';
import {compose, is, length, filter, find, propEq, not, has, curry} from 'ramda';

// for better debugging in rxjs (slow!)
// config.longStackSupport = true;

/**
 *
 * @param acc
 * @param item
 */
const listReducer = curry((acc, item) => {
  assert(is(Object, listActions), 'listActions object should be present');
  if (has(item.action, listActions)) {
    return listActions[item.action](acc, item.value);
  }
  return acc
});

function App(sources) {
  const timer$ = Observable.interval(4e2);
  const counter$ = timer$.map(x => div(`x:` + x));

  const list$ = timer$
    .map(x => {
      return {
        action: 'update',
        value:  {
          id:  Math.floor(x / 5) % 4,
          foo: `foo${ x }`
        }
      }
    })
    .scan(listReducer, []);

  const listAsString$ = list$.map(
    xs => div(xs.map(
      x => pre(JSON.stringify(x || {}, null, 2))
    ))
  );

  const safeListAsString$ = listAsString$.catch(
    e =>
      Observable.of(div([
        strong(he.encode(e.toString())),
        pre(he.encode(e.stack))
      ]))
  );

  return {
    DOM: safeListAsString$
    // DOM: counter$
  };
}

export default App;
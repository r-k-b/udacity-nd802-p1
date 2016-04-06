"use strict";

import he from 'he';
import assert from 'assert';
import {Observable, config} from 'rx';
import {listActions} from './appUtils';
import {div, pre, strong} from '@cycle/dom';
import {compose, is, length, isNil, filter, find, propEq, not, has, curry} from 'ramda';

// for better debugging in rxjs (slow!)
config.longStackSupport = true;

/**
 *
 * @param {Array} acc
 * @param {*} item
 */
const listReducer = curry((acc, item) => {
  assert(is(Object, listActions), 'listActions object should be present');
  if (has(item.action, listActions)) {
    return listActions[item.action](acc, item.value);
  }
  return acc
});

function App(sources) {

  const getEventsList$ = Observable.of({
    url:      '/events.json',
    category: 'eventsMainList',
    method:   'GET'
  });

  const eventsList$ = sources.HTTP
    .filter(res$ => res$.request.category === 'eventsMainList')
    .mergeAll()
    .map(res => res.body)
    .startWith(null);

  eventsList$.subscribe(x => {
    console.info('eventsList$ x:');console.info(x);


  });

  const updateManyFetchedEvents = x => {
    return {
      action: 'updateMany',
      value:  x['events']
    }
  };

  const list$ = eventsList$
    .filter(x => !isNil(x))
    .map(updateManyFetchedEvents)
    .scan(listReducer, []);

  list$.subscribe(x => {
    console.info('list$ x:');console.info(x);
  });


  const listAsString$ = list$.map(
    xs => div(xs.map(
      x => pre(JSON.stringify(x || 'unparseable object passed to JSON.stringify', null, 2))
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
    DOM: safeListAsString$,
    HTTP: getEventsList$
  };
}

export default App;
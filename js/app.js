"use strict";

import he from 'he';
import assert from 'assert';
import * as views from './views';
import {Observable, config} from 'rx';
import {listActions} from './appUtils';
import {h1, div, pre, strong} from '@cycle/dom';
import {
  compose,
  is,
  length,
  isNil,
  filter,
  find,
  propEq,
  not,
  has,
  curry
} from 'ramda';

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

  const fetchEventsFromJSON$ = Observable.of({
    url:      '/events.json',
    category: 'eventsMainList',
    method:   'GET'
  });

  const eventsJSON$ = sources.HTTP
    .filter(res$ => res$.request.category === 'eventsMainList')
    .mergeAll()
    .map(res => res.body)
    .startWith(null)
    .share();

  eventsJSON$.subscribe(x => {
    console.info('eventsJSON$ x:');
    console.info(x);
  });

  const updateManyFetchedEvents = x => {
    return {
      action: 'updateMany',
      value:  x['events']
    }
  };

  const list$ = eventsJSON$
    .filter(x => !isNil(x))
    .map(updateManyFetchedEvents)
    .scan(listReducer, []);

  list$.subscribe(x => {
    console.info('list$ x:');
    console.info(x);
  });


  const listAsVTree$ = list$.map(
    xs => div(
      [
        h1('List of Events'),
        xs.map(views.eventListItemLarge)
      ]
    )
  );

  const safeListAsString$ = listAsVTree$.catch(
    e =>
      Observable.of(div([
        strong(he.encode(e.toString())),
        pre(he.encode(e.stack))
      ]))
  );

  return {
    DOM:  safeListAsString$,
    HTTP: fetchEventsFromJSON$
  };
}

export default App;
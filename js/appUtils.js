'use strict';

import assert from 'assert';
import {
  filter, is, not, curry, append, compose, lte, propEq, reduce, length
} from 'ramda';

export const isPresent = curry((itemId, list) => {
    assert(!is(Object, itemId), 'itemId shouldn\'t be an object');
    return compose(
      lte(1),
      length,
      filter(propEq('id', itemId))
    )(list)
  }
);

export const eventIdsMatch = curry((eventA, eventB) => (eventA.id === eventB.id));

/**
 * If the events have the same ID, the second ('newer') one is returned.
 * Otherwise, the first event is returned.
 * 
 * @param oldEvent
 * @param newEvent
 */
export const chooseEvent = (oldEvent, newEvent) =>
  eventIdsMatch(newEvent, oldEvent) ? newEvent : oldEvent;

const listActionUpdate = (acc, event) => {
  if (isPresent(event.id, acc)) {
    return acc.map((oldEvent) => chooseEvent(oldEvent, event))
  }
  return append(event, acc)
};

const listActionUpdateMany = (acc, events) => {
  // for each event in events
  //    update acc with event
  // TODO!
};

const listActionRemove = (acc, event) => 
  filter(compose(not, eventIdsMatch(event)), acc);

const listActionRemoveMany = (acc, events) => {
  // TODO!
};

/*
 * update
 * updateMany
 * remove
 * removeById
 * removeAll
 */
export const listActions = {
  update: listActionUpdate,
  updateMany: listActionUpdateMany,
  remove: listActionRemove,
  removeMany: listActionRemoveMany,
  removeAll: () => []
};
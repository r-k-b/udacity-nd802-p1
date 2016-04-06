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
 * Update the Store with an Action.
 *
 * @typedef {Object} StoreAction
 * @property {String} action
 * @property {*} value
 */

/**
 * A representation of an Event (e.g., party, meeting, hoedown, etc etc)
 *
 * @typedef {Object} Event
 * @property {String} action
 * @property {*} value
 * @property {String} utcStart
 * @property {String} utcEnd
 * @property {String} title
 * @property {String} note
 * @property {Integer} hostId
 * @property {String} type
 * @property {Array<String>} guestNames
 * @property {String} location
 */

/**
 * a → a → a
 *
 * If the events have the same ID, the second ('newer') one is returned.
 * Otherwise, the first event is returned.
 *
 * @param {Event} oldEvent
 * @param {Event} newEvent
 * @returns {Event}
 */
export const chooseEvent = (oldEvent, newEvent) =>
  eventIdsMatch(newEvent, oldEvent) ? newEvent : oldEvent;


/**
 * [a] → a → [a]
 *
 * If there exists an event in `acc` with the same id as `event`, it will
 * be replaced.
 *
 * If not, `event` will be appended to `acc`.
 *
 * @param {Array<Event>} acc
 * @param {Event} event
 * @returns {Array<Event>}
 */
const listActionUpdate = (acc, event) => {
  if (isPresent(event.id, acc)) {
    return acc.map((oldEvent) => chooseEvent(oldEvent, event))
  }
  return append(event, acc)
};

/**
 * [a] → [a] → [a]
 *
 * For each event in `events`:
 *
 *    If there exists an event in `acc` with the
 *    same id as `event`, it will be replaced.
 *
 *    If not, `event` will be appended to `acc`.
 *
 * @param {Array<Event>} acc
 * @param {Array<Event>} events
 * @returns {Array<Event>}
 */
const listActionUpdateMany = (acc, events) => reduce(listActionUpdate, acc, events);


/**
 * [a] → a → [a]
 *
 * If there exists an event in `acc` with the same id as `event`, it will
 * be removed.
 *
 * @param {Array<Event>} acc
 * @param {Event} event
 * @returns {Array<Event>}
 */
const listActionRemove = (acc, event) => 
  filter(compose(not, eventIdsMatch(event)), acc);


/**
 * [a] → [a] → [a]
 *
 * For each event in `events`:
 *
 *    If there exists an event in `acc` with the
 *    same id as `event`, it will be removed.
 *
 * @param {Array<Event>} acc
 * @param {Array<Event>} events
 * @returns {Array<Event>}
 */
const listActionRemoveMany = (acc, events) => reduce(listActionRemove, acc, events);

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
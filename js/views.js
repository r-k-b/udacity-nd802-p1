'use strict';

import {
  div, pre, strong, article, h2, h3, ul, li, p, em
} from '@cycle/dom';


import {prop, propOr, __} from 'ramda';

/**
 * a → b
 *
 * Turns an event into a vtree, suitable for use in a large list view.
 *
 * @param {Event} ev
 * @returns {Object} VTree
 */
export const eventListItemLarge = ev => {
  const evProp = prop(__, ev);
  const evPropOr = propOr(__, __, ev);
  const guardEmptyList = list => {
    if (list.length < 1) {
      return [
        em('No guests yet')
      ]
    }
    return list
  };

  try {
    return article('.event__outer',
      {
        attributes: {
          'data-event-id':      evProp('id'),
          'data-last-modified': evProp('lastModified')
        }
      },
      [
        h2(evProp('title')),
        p(
          '.event__byline',
          em('Hosted by ' + evProp('hostName'))
        ),
        p(
          '.event__type',
          [
            strong('Event Type: '),
            evProp('type')
          ]
        ),
        p(
          '.event__location',
          [
            strong('Location: '),
            evProp('location')
          ]
        ),
        p(
          '.event__time',
          [
            strong('Starts at: '),
            evProp('utcStart')
          ]
        ), // todo: humanize the dates,
        p(
          '.event__time',
          [
            strong('Ends at: '),
            evProp('utcEnd')
          ]
        ),
        div(
          '.event__guest-list',
          [
            strong('Guests:'),
            guardEmptyList(evProp('guestNames')).map(
              guest => div('.event__guest-name', guest)
            )
          ]
        ),
        div(
          '.event__guest-notes',
          [
            h3('Notes for Guests:'),
            p(
              '.event__note',
              evProp('note')
            )
          ]
        )
      ]
    );
  } catch (e) {
    return div(
      '.vtree-render-failure.alert.alert-warning',
      [
        p('⚠ Failed to render event as VTree'),
        pre(e.stack || e.toString())
      ]
    )
  }
};

'use strict';

import {
  div, pre, strong, article, h1, ul, li, p, em
} from '@cycle/dom';


/**
 * a → b
 *
 * Turns an event into a vtree, suitable for use in a large list view.
 *
 * @param {Event} ev
 * @returns {Object} VTree
 */
export const eventListItemLarge = ev => {
  try {
    return article('.event__outer',
      {
        attributes: {
          'data-event-id': ev.id,
          'data-last-modified': ev.lastModified
        }
      },
      [
        h1(ev.title),
        p(
          '.event__byline',
          'Hosted by ' + ev.hostName
        ),
        p(
          '.event__note',
          ev.note
        ),
        p('Time: ' + ev.utcStart + ' to ' + ev.utcEnd) // todo: humanize the dates
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

'use strict';

import {range} from 'ramda';
import moment from 'moment';
import {date, lorem, random, helpers, commerce, name, address} from 'faker';

let eventTypes = [
  'Birthday Party',
  'Conference Talk',
  'Wedding',
  'Funeral',
  'Bar Mitzvah'
];

let upTo = n => Math.floor(Math.random() * n);

let arrayOfUpTo = n => range(0, upTo(n));

let anEvent = () => {
  let evDate = date.future();
  let evEnd = moment(evDate).add(Math.random() * 24, 'hours');
  return {
    id:         random.uuid(),
    utcStart:   date.future().toISOString(),
    utcEnd:     evEnd.toISOString(),
    title:      commerce.productName(),
    // "avatar:     image.avatar(),
    note:       lorem.paragraphs(),
    hostName:   name.findName(),
    type:       random.arrayElement(eventTypes),
    guestNames: arrayOfUpTo(4).map(() => name.findName()),
    location:   `${ address.streetAddress() }, ${ address.city() } ${ address.zipCode() }`
  }
};

let fakeEvents = range(0, 6).map(anEvent);

console.log(JSON.stringify(
  {events: fakeEvents},
  null,
  2
));

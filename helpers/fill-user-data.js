'use strict';

import {range} from 'ramda';
import {helpers} from 'faker';

let fakeUsers = range(0, 32).map(() => helpers.contextualCard());

console.log(JSON.stringify(fakeUsers, null, 2));

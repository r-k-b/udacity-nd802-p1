'use strict';

import tape from 'tape';
import * as appUtils from '../js/appUtils';

tape('should correctly identify events by ID', t => {
  const eventA = {
    id:  'a',
    foo: 'bar'
  };

  const eventB = {
    id:  'b',
    foo: 'baz'
  };

  const eventA_new = {
    id:  'a',
    foo: 'qux'
  };

  t.equal(
    appUtils.chooseEvent(eventA, eventA_new),
    eventA_new,
    'same event, second arg is returned'
  );

  t.equal(
    appUtils.chooseEvent(eventA, eventB),
    eventA,
    'different events, first arg is returned'
  );

  t.end();
});

tape('should be able to determine if an item with a given ID is in a list', t => {
  const exampleA = {
    id: 'a'
  };

  const exampleB = {
    id: 'b'
  };

  const exampleList = [
    exampleA,
    {id: 'c'},
    {id: 'd'}
  ];

  t.equal(
    appUtils.isPresent(exampleA.id, exampleList),
    true,
    'element with ID is present (basic args)'
  );

  t.equal(
    appUtils.isPresent(exampleB.id, exampleList),
    false,
    'element with ID is not present (basic args)'
  );

  t.equal(
    appUtils.isPresent(exampleA.id)(exampleList),
    true,
    'element with ID is present (curried)'
  );

  t.equal(
    appUtils.isPresent(exampleB.id)(exampleList),
    false,
    'element with ID is present (curried)'
  );

  t.end();
});

tape('list actions should behave as expected', t => {
  t.deepEqual(
    appUtils.listActions.update(
      [{id: 'a', foo: 'bar'}, {id: 'b', foo: 'qux'}],
      {id: 'a', foo: 'baz'}
    ),
    [{id: 'a', foo: 'baz'}, {id: 'b', foo: 'qux'}],
    'update action should update the list'
  );

  t.deepEqual(
    appUtils.listActions.update([], {id: 'a', foo: 'bar'}),
    [{id: 'a', foo: 'bar'}],
    'update action should also add when it doesn\'t exist in the list'
  );

  t.deepEqual(
    appUtils.listActions.updateMany(
      [{id: 'a', foo: 'bar1'}, {id: 'b', foo: 'baz1'}, {id: 'c', foo: 'qux1'}],
      [{id: 'a', foo: 'bar2'}, {id: 'b', foo: 'baz2'}]
    ),
    [{id: 'a', foo: 'bar2'}, {id: 'b', foo: 'baz2'}, {id: 'c', foo: 'qux1'}],
    'updateMany action should work'
  );

  t.deepEqual(
    appUtils.listActions.remove(
      [{id: 'a', foo: 'bar'}, {id: 'b', foo: 'qux'}],
      {id: 'a'}
    ),
    [{id: 'b', foo: 'qux'}],
    'remove action should work'
  );

  t.deepEqual(
    appUtils.listActions.removeMany(
      [{id: 'a', foo: 'bar1'}, {id: 'b', foo: 'baz1'}, {id: 'c', foo: 'qux1'}],
      [{id: 'a', foo: 'bar2'}, {id: 'b', foo: 'baz2'}]
    ),
    [{id: 'c', foo: 'qux1'}],
    'removeMany action should work'
  );

  t.deepEqual(
    appUtils.listActions.removeAll([{id: 'a', foo: 'bar'}, {id: 'b', foo: 'qux'}]),
    [],
    'remove all action should work'
  );

  t.end();
});
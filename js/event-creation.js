"use strict";
// todo: do all this within cycle.js
window.eventCreation = (($, chrono, moment, Rx) => {
  var my = {};

  my.chronoObj$ = new Rx.Subject();

  const selectors = {
    naturalDateInput:  '[data-parsley-natural-date]',
    eventStartISO8601: '#event-time-start-iso8601',
    eventEndISO8601:   '#event-time-end-iso8601',
    eventTimeSummary:  '#event-times__readable-summary',
  };


  const hasNumAtPath = R.curry((path, obj) => {
    const value = R.path(path, obj);
    return R.is(Number, value)
  });


  my.chronoChecklist = [
    {
      test: hasNumAtPath(['start', 'knownValues', 'hour']),
      msg: 'Start time should be explicit.',
      id: 'explicitStartTime',
    },
    {
      test: hasNumAtPath(['end', 'knownValues', 'hour']),
      msg: 'End time should be explicit.',
      id: 'explicitEndTime',
    },
    {
      test: hasNumAtPath(['start', 'knownValues', 'day']),
      msg: 'Start date should be explicit.',
      id: 'explicitStartDate',
    },
    {
      test: hasNumAtPath(['end', 'knownValues', 'day']),
      msg: 'End date should be explicit.',
      id: 'explicitEndDate',
    },
  ];


  const whyNotValidChrono = chronoResult => {
    const filterMsgs = R.compose(
      R.pluck('msg'),
      R.filter(check => !check.test(chronoResult[0]))
    );

    return filterMsgs(my.chronoChecklist)
  };


  /**
   * a → b
   *
   * @param {Object} chronoResult
   * @return {Boolean}
   */
  const isValidEventDate = chronoResult => {
    if (chronoResult.length < 1) {
      return false;
    }

    const reasons = whyNotValidChrono(chronoResult);

    return reasons.length === 0
  };


  /**
   * !!! IMPURE !!!
   *
   * @param {DOM|jQuery} dateInput
   */
  const markInputInvalid = (dateInput) => {
    if (dateInput.$element) {
      // Called from Parsley event handler
      dateInput = dateInput.$element[0];
    }
    const errMsg = 'Event date not recognized.';
    if (dateInput instanceof $) {
      dateInput[0].setCustomValidity(errMsg);
    } else {
      dateInput.setCustomValidity(errMsg);
    }
    $(dateInput)
      .prop('aria-invalid', true);
  };


  /**
   * !!! IMPURE !!!
   *
   * @param {DOM|jQuery} dateInput
   */
  const markInputValid = (dateInput) => {
    if (dateInput.$element) {
      // Called from Parsley event handler
      dateInput = dateInput.$element[0];
    }
    if (dateInput instanceof $) {
      dateInput[0].setCustomValidity('');
    } else {
      dateInput.setCustomValidity('');
    }
    $(dateInput).prop('aria-invalid', false);
  };


  /**
   * !!! IMPURE !!!
   *
   * @param {DOM} elem
   * @param {Object} chronoResult
   */
  const showLiveSummary = (elem, chronoResult) => {
    const evChrono = chronoResult[0];
    const start = moment(evChrono.start.date());
    const end = moment((evChrono.end || evChrono.start).date());
    const duration = moment.duration(end.diff(start));

    $(elem).html(`
  Event Starts at: ${ start.format('dddd, MMMM Do YYYY, h:mm:ss a') }<br/>
  Event Ends at: ${ end.format('dddd, MMMM Do YYYY, h:mm:ss a') }<br/>
  Duration: ${ duration.humanize() }
    `);

    return {
      chronoResult, evChrono, start, end, duration
    }

  };

  const clearLiveSummary = elem => {
    $(elem).html('');
  };

  /**
   * !!! IMPURE !!!
   *
   * @param {DOM|String} dateInput
   */
  const parseNaturalDate = dateInput => {
    const chronoResult = chrono.parse(
      (typeof dateInput === 'string') ? dateInput : dateInput.value
    );

    if (!isValidEventDate(chronoResult)) {

      return chronoResult;
    }

    return chronoResult;
  };

  const updateFormAfterInvalidNaturalDate = (evObj) => {
    $(selectors.eventStartISO8601).val('').change();
    $(selectors.eventEndISO8601).val('').change();
    clearLiveSummary(selectors.eventTimeSummary);

    my.chronoObj$.onNext({
      valid: false,
      data: {chronoResult: chrono.parse(evObj.value)}
    });
  };

  const updateFormAfterValidNaturalDate = (evObj) => {
    const chronoResult = chrono.parse(evObj.value);
    $(selectors.eventStartISO8601)
      .val(chronoResult[0].start.date().toISOString());
    $(selectors.eventEndISO8601)
      .val((chronoResult[0].end || chronoResult[0].start).date().toISOString());

    my.chronoObj$.onNext({
      valid: true,
      /* side effects! */
      data: showLiveSummary(selectors.eventTimeSummary, chronoResult)
    });
  };


  my.chronoChecklist.map(check => {
    Parsley
      .addValidator(check.id, {
        requirementType: 'string',
        validateString:  (value, requirement) =>
                           // todo: fix performance
                           check.test(chrono.parse(value)[0]),
        messages:        {
          en: check.msg
        }
      });
  });

  $(document).ready(() => {
    $(selectors.naturalDateInput).parsley()
      .on('field:error', updateFormAfterInvalidNaturalDate)
      .on('field:success', updateFormAfterValidNaturalDate);

    parseNaturalDate($(selectors.naturalDateInput));
  });

  Parsley.on('field:error', markInputInvalid);
  Parsley.on('field:success', markInputValid);

  return my;
})(jQuery, chrono, moment, Rx);


// based heavily on example code from https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
(() => {
  var placeSearch, autocomplete;

  function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('event-location')),
      {types: ['geocode']});
  }

  window.initAutocomplete = initAutocomplete;

  // Bias the autocomplete object to the user's geographical location,
  // as supplied by the browser's 'navigator.geolocation' object.
  function geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        const circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
      });
    }
  }

  window.geolocate = geolocate;
})();


window.eventCreationDateMethod = (Rx, R, $, eventCreation) => {
  var my = {};

  if (!$.fn.garlic) {
    throw new Error('garlicjs is a required dependency')
  }

  // eventCreation.chronoObj$.subscribe(x => console.log('chronoObj$:', x));

  const selectors = {
    dateInputModeCheckbox: '[data-toggle-datetime-entry-methods]',
    strictModeControls:    '[data-datetime-method="strict"]',
    laxModeControls:       '[data-datetime-method="freeform"]',
    creationForm:          '#create-an-event',
  };

  /**
   * http://www.mrspeaker.net/2015/08/03/functions-as-rxjs-subjects/
   *
   * @returns {Observable}
   */
  const rxFuncSubject = () => {
    const subject = Object.assign(
      (...args) => subject.onNext(...args),
      Rx.Observable.prototype,
      Rx.Subject.prototype
    );

    Rx.Subject.call(subject);

    return subject;
  };


  my.checkboxElem = document.querySelector(selectors.dateInputModeCheckbox);

  const retrievedSubj$ = rxFuncSubject();

  // retrievedSubj$
  //   .delay(1) // to allow garlicjs to update the checkbox (see garlicjs issue #45)
  //   .subscribe(function logAllRetrievals(elem) {
  //     console.debug('retrieved value: `', R.path(['0', 'value'], elem), '` for:', arguments);
  //     console.debug('(elem checked?)', my.checkboxElem.checked)
  //   });

  const checkboxClick$ = Rx.DOM
    .click(my.checkboxElem)
    .pluck('target', 'checked');

  // seems like we can't get a proper stream of garlics' updates to checkboxes; may as
  // well just poll-spam...
  const checkboxPoll$ = Rx.Observable.interval(50)
    .take(600) // ~30 seconds
    .map(() => my.checkboxElem)
    .pluck('checked');

  const isStrictDateMode$ = Rx.Observable
    .merge(checkboxClick$, checkboxPoll$)
    // .startWith(false)
    .distinctUntilChanged();

  //noinspection JSValidateJSDoc
  /**
   *
   * @param className {String}
   * @param elemShouldHaveIt {boolean}
   * @returns {Function}
   */
  my.updateClass = (className, elemShouldHaveIt) =>
    /**
     * IMPURE!
     *
     * Removes or adds the given class to the element,
     * based on the truthiness of the second parameter.
     *
     * @param elem {DOM}
     */
    elem => {
      const method = elemShouldHaveIt ? 'add' : 'remove';
      R.pathOr(
        () => undefined,
        ['classList', method],
        elem
      ).bind(
        R.prop('classList', elem)
      )(className);

      return elem;
    };

  //noinspection JSValidateJSDoc
  /**
   *
   * @param elemShouldBeEnabled {boolean}
   * @returns {Function}
   */
  my.updateEnabledState = elemShouldBeEnabled =>
    /**
     * IMPURE!
     *
     * @param elem {DOM}
     */
    elem => {
      elemShouldBeEnabled
        ? elem.removeAttribute('disabled')
        : elem.setAttribute('disabled', 'true');

      return elem;
    };

  const setMode = isStrict => {
    console.info('next Strict Mode:', isStrict);
    R.map(
      R.compose(
        my.updateClass('hidden', !isStrict),
        my.updateEnabledState(isStrict)
      ),
      document.querySelectorAll(selectors.strictModeControls)
    );
    R.map(
      R.compose(
        my.updateClass('hidden', isStrict),
        my.updateEnabledState(!isStrict)
      ),
      document.querySelectorAll(selectors.laxModeControls)
    );
  };


  isStrictDateMode$.subscribe(
    setMode,
    error => {
      console.error(error)
    }
  );


  /* Begin side-effects */

  my.formGarlic = $(selectors.creationForm).garlic({
    onRetrieve: retrievedSubj$
  });

  return my;
};
jQuery(document).ready(() => window.eventCreationDateMethod(Rx, R, jQuery, window.eventCreation));
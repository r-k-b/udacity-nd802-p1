"use strict";
// todo: do all this within cycle.js
window.eventCreation = (($, chrono, moment) => {
  var my = {};

  const selectors = {
    naturalDateInput:  '[data-parsley-natural-date]',
    eventStartISO8601: '#event-time-start',
    eventEndISO8601:   '#event-time-end',
    eventTimeSummary:  '#event-times__readable-summary',
  };


  /**
   * a → b
   *
   * @param {Object} chronoResult
   * @return {Boolean}
   */
  const isValidEventDate = chronoResult => chronoResult.length >= 1;


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
    `)
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
    const chronoObj = chrono.parse(
      (typeof dateInput === 'string') ? dateInput : dateInput.value
    );

    if (!isValidEventDate(chronoObj)) {
      $(selectors.eventStartISO8601).val('').change();
      $(selectors.eventEndISO8601).val('').change();
      clearLiveSummary(selectors.eventTimeSummary);
      return chronoObj;
    }

    $(selectors.eventStartISO8601)
      .val(chronoObj[0].start.date().toISOString());
    $(selectors.eventEndISO8601)
      .val((chronoObj[0].end || chronoObj[0].start).date().toISOString());

    showLiveSummary(selectors.eventTimeSummary, chronoObj);
    return chronoObj;
  };

  Parsley
    .addValidator('naturalDate', {
      requirementType: 'string',
      validateString:  (value, requirement) =>
                         /* side effects! */
                         isValidEventDate(parseNaturalDate(value)),
      messages:        {
        en: 'Event date not recognized.'
      }
    });

  $(document).ready(() => {
    parseNaturalDate($(selectors.naturalDateInput));
  });

  Parsley.on('field:error', markInputInvalid);
  Parsley.on('field:success', markInputValid);

  return my;
})(jQuery, chrono, moment);

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
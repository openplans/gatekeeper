/*globals $ */

var Gatekeeper = {};

(function(NS) {

  NS.getInvalidFormEls = function(form) {
    var invalidEls, val;

    invalidEls = $(form).find('input, select, textarea').map(function() {
      // Only validate visible elements
      if ($(this).is(':visible')) {

        // Does it support the validity object?
        if (this.validity) {
          // Add it to the array if it's invalide
          if (!this.validity.valid) {
            return this;
          }
        } else {
          // Strip whitespace from the value
          val = (this.value || '').replace(/\s+/);

          // Manually support 'required' for old browsers
          if (this.hasAttribute('required') && val === '') {
            return this;
          }
        }
      }
    });

    return invalidEls;
  };

  // Bind to all forms in the document, forever
  $(document).on('submit', 'form', function(evt) {
    evt.preventDefault();

    // Get invalid elements from the form
    var invalidEls = NS.getInvalidFormEls(this);

    // Indicate that this form has been submitted
    $(this).addClass('form-submitted');

    if (invalidEls && invalidEls.length > 0) {
      // Stops the submit event from triggering anywhere else
      evt.stopImmediatePropagation();

      // Focus on the first invalid element
      invalidEls[0].focus();
      if (invalidEls[0].select) { invalidEls[0].select(); }
    }
  });
}(Gatekeeper));
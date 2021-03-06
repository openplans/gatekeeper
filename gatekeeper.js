/*globals $ */

var Gatekeeper = {};

(function(NS) {

  NS.getInvalidFormEls = function(form) {
    var $form = $(form),
        invalidEls;

    invalidEls = $form.find('input, select, textarea').map(function() {
      var $this = $(this),
          $checkableGroup,
          $requiredInputs,
          isCheckbox,
          restoreRequired,
          hasValue;

      // Only validate visible elements
      if ($this.is(':visible')) {

        // For checkbox groups, only one needs to be checked
        isCheckbox = $this.is('[type="checkbox"]');
        if (isCheckbox) {
          $requiredInputs = $form.find('[name="'+$this.attr('name')+'"][required]');
          hasValue = $requiredInputs.is(':checked');
          if (hasValue) {
            $requiredInputs.removeAttr('required');
          }
        }

        restoreRequired = function() {
          if ($requiredInputs) {
            $requiredInputs.attr('required', 'required');
          }
        };

        // Does it support the validity object?
        if (this.validity) {
          // Add it to the array if it's invalide
          if (!this.validity.valid) {
            restoreRequired();
            return this;
          }
        } else {
          $this.removeClass('gatekeeper-invalid');

          if ($this.is('[type="checkbox"]') || $this.is('[type="radio"]')) {
            $checkableGroup = $form.find('[name="'+$this.attr('name')+'"]');
            hasValue = $checkableGroup.is(':checked');
          } else {
            // Strip whitespace from the value
            hasValue = (this.value || '').replace(/\s+/) !== '';
          }

          // Manually support 'required' for old browsers
          if (this.hasAttribute('required') && !hasValue) {
            $this.addClass('gatekeeper-invalid');
            restoreRequired();
            return this;
          }
        }
      }
    });

    return invalidEls;
  };

  NS.validate = function(form) {
    // Get invalid elements from the form
    var invalidEls = NS.getInvalidFormEls(form);

    // Indicate that this form has been submitted
    $(form).addClass('form-submitted');

    if (invalidEls && invalidEls.length > 0) {
      // Focus on the first invalid element
      invalidEls[0].focus();
      if (invalidEls[0].select) { invalidEls[0].select(); }

      return false;
    }
    return true;
  };

  NS.onValidSubmit = function(success, error) {
    return function(evt) {
      evt.preventDefault();

      if (NS.validate(evt.target)) {
        if (success) {
          success.apply(this, arguments);
        }
      } else {
        if (error) {
          error.apply(this, arguments);
        }
      }
    };
  };
}(Gatekeeper));
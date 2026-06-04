/* Contact form — AJAX submit to FormSubmit with loading / success / error feedback.
   Falls back to a normal POST (no-JS) because the <form> keeps its action/method. */
(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  if (!form) return;

  var btn = document.getElementById('contactSubmit');
  var btnLabel = btn ? btn.querySelector('.btn-label') : null;
  var status = document.getElementById('contactStatus');

  // AJAX endpoint variant of the form's action.
  var endpoint = form.getAttribute('action').replace(
    'formsubmit.co/',
    'formsubmit.co/ajax/'
  );

  var ICONS = {
    pending: '',
    success: 'bi-check-circle-fill',
    error: 'bi-exclamation-circle-fill'
  };

  function setStatus(type, message) {
    if (!status) return;
    status.hidden = false;
    status.className = 'form-status form-status--' + type;
    status.textContent = '';
    if (ICONS[type]) {
      var icon = document.createElement('i');
      icon.className = 'bi ' + ICONS[type];
      icon.setAttribute('aria-hidden', 'true');
      status.appendChild(icon);
    }
    status.appendChild(document.createTextNode(message));
  }

  function setLoading(isLoading) {
    if (!btn) return;
    btn.disabled = isLoading;
    btn.classList.toggle('is-loading', isLoading);
    if (btnLabel) btnLabel.textContent = isLoading ? 'Sending…' : 'Send message';
  }

  function firstInvalidField() {
    var fields = form.querySelectorAll('input[required], textarea[required]');
    for (var i = 0; i < fields.length; i++) {
      if (!fields[i].checkValidity()) return fields[i];
    }
    return null;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Native HTML5 validation first; focus the first problem field.
    if (!form.checkValidity()) {
      var bad = firstInvalidField();
      setStatus('error', 'Please fill in your name, a valid email, and a message.');
      if (bad) bad.focus();
      return;
    }

    setLoading(true);
    setStatus('pending', 'Sending your message…');

    fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok) {
          form.reset();
          setStatus(
            'success',
            'Thanks — your message is on its way. I usually reply within a day or two.'
          );
        } else {
          throw new Error((result.data && result.data.message) || 'Request failed');
        }
      })
      .catch(function () {
        setStatus(
          'error',
          'Something went wrong sending the message. Please try again, or email me directly at Wafakhairi3@gmail.com.'
        );
      })
      .then(function () {
        setLoading(false);
      });
  });
})();

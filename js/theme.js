/* Theme switcher — toggles light/dark, persists choice, keeps a11y state in sync.
   Initial theme is set by the inline <head> script to avoid a flash of wrong theme. */
(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function syncButton(theme) {
    var goingToLight = theme === 'dark'; // button switches to the *other* theme
    toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    toggle.setAttribute(
      'aria-label',
      goingToLight ? 'Switch to light theme' : 'Switch to dark theme'
    );
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    syncButton(theme);
  }

  // Initialise button state from whatever the inline script applied.
  syncButton(currentTheme());

  toggle.addEventListener('click', function () {
    applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
  });

  // Follow the OS preference only while the user hasn't made an explicit choice.
  var media = window.matchMedia('(prefers-color-scheme: light)');
  var onChange = function (e) {
    var hasChoice = false;
    try { hasChoice = !!localStorage.getItem('theme'); } catch (err) {}
    if (!hasChoice) applyTheme(e.matches ? 'light' : 'dark');
  };
  if (media.addEventListener) media.addEventListener('change', onChange);
  else if (media.addListener) media.addListener(onChange);
})();

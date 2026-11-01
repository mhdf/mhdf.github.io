// The theme button (the choice is remembered in this browser) and the filters of the publications

(function () {
  var root = document.documentElement;
  var button = document.getElementById('theme-button');

  function stored() {
    try { return localStorage.getItem('theme'); } catch (error) { return null; }
  }

  function current() {
    var chosen = root.getAttribute('data-theme');
    if (chosen) return chosen;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function show() {
    button.textContent = current() === 'dark' ? 'Light theme' : 'Dark theme';
  }

  if (stored()) root.setAttribute('data-theme', stored());
  show();
  button.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (error) { /* not remembered: still applied */ }
    show();
  });

  // Publications: a filter shows the items of one theme (and the years that still have items)
  var buttons = document.querySelectorAll('.filters button');
  var items = document.querySelectorAll('.pubs li');
  var years = document.querySelectorAll('.year-group');

  function filter(theme) {
    items.forEach(function (item) {
      item.hidden = theme !== 'all' && item.getAttribute('data-themes').split(' ').indexOf(theme) < 0;
    });
    years.forEach(function (group) {
      group.hidden = group.querySelectorAll('li:not([hidden])').length === 0;
    });
    buttons.forEach(function (other) {
      other.setAttribute('aria-pressed', other.getAttribute('data-filter') === theme ? 'true' : 'false');
    });
  }

  buttons.forEach(function (one) {
    one.addEventListener('click', function () { filter(one.getAttribute('data-filter')); });
  });

  // the link of a theme card opens the list already filtered by its theme
  document.querySelectorAll('[data-show-theme]').forEach(function (link) {
    link.addEventListener('click', function () { filter(link.getAttribute('data-show-theme')); });
  });
})();

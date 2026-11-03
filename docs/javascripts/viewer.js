/* Full-screen viewer for the series pages.
   Reads the works from the JSON block the series template writes, opens on
   a click in the grid, and keeps the open work in the URL hash so a single
   painting can be shared. Esc closes, the arrow keys step (wrapping), a
   swipe steps on touch screens, and a click on the backdrop closes. */
(function () {
  var dataEl = document.getElementById('m-works-data');
  var viewer = document.querySelector('.m-viewer');
  if (!dataEl || !viewer) return;

  var works = JSON.parse(dataEl.textContent);
  var series = viewer.getAttribute('data-series');
  var stage = viewer.querySelector('.m-viewer__stage');
  var img = viewer.querySelector('.m-viewer__img');
  var pos = viewer.querySelector('.m-viewer__pos');
  var title = viewer.querySelector('.m-viewer__title');
  var meta = viewer.querySelector('.m-viewer__meta');
  var note = viewer.querySelector('.m-viewer__note');
  var story = viewer.querySelector('.m-viewer__story');
  var closeBtn = viewer.querySelector('.m-viewer__close');
  var idx = null;
  var opener = null;

  function setHash(slug) {
    var url = location.pathname + location.search + (slug ? '#' + slug : '');
    try { history.replaceState(null, '', url); } catch (e) { /* file:// */ }
  }

  function preload(i) {
    var w = works[(i + works.length) % works.length];
    new Image().src = w.src;
  }

  function render() {
    var w = works[idx];
    img.removeAttribute('src');
    img.width = w.w;
    img.height = w.h;
    img.alt = w.alt;
    img.src = w.src;
    pos.textContent = series + ' · ' + (idx + 1) + ' / ' + works.length;
    title.textContent = w.title;
    meta.textContent = w.meta;
    note.textContent = w.note || '';
    note.hidden = !w.note;
    if (w.story) story.href = w.story;
    story.hidden = !w.story;
    setHash(w.slug);
    preload(idx + 1);
    preload(idx - 1);
  }

  function open(i, from) {
    idx = i;
    opener = from || null;
    viewer.hidden = false;
    document.documentElement.classList.add('m-locked');
    render();
    closeBtn.focus();
  }

  function close() {
    if (idx === null) return;
    idx = null;
    viewer.hidden = true;
    document.documentElement.classList.remove('m-locked');
    setHash('');
    if (opener) opener.focus();
  }

  function step(d) {
    idx = (idx + d + works.length) % works.length;
    render();
  }

  document.querySelectorAll('.m-work__mat').forEach(function (btn) {
    btn.addEventListener('click', function () {
      open(Number(btn.getAttribute('data-index')), btn);
    });
  });

  closeBtn.addEventListener('click', close);
  viewer.querySelector('.m-viewer__nav--prev').addEventListener('click', function () { step(-1); });
  viewer.querySelector('.m-viewer__nav--next').addEventListener('click', function () { step(1); });
  stage.addEventListener('click', function (e) {
    if (e.target === stage) close();
  });

  document.addEventListener('keydown', function (e) {
    if (idx === null) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === 'Tab') {
      // Keep focus inside the dialog while it is open.
      var f = Array.prototype.filter.call(
        viewer.querySelectorAll('button, a[href]'),
        function (el) { return !el.hidden; }
      );
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  var touchX = null, touchY = null;
  stage.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { touchX = null; return; }
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    var dy = e.changedTouches[0].clientY - touchY;
    touchX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
  });

  function fromHash() {
    var slug = decodeURIComponent(location.hash.slice(1));
    if (!slug) { close(); return; }
    for (var i = 0; i < works.length; i++) {
      if (works[i].slug === slug) {
        if (idx !== i) open(i, document.querySelector('.m-work__mat[data-index="' + i + '"]'));
        return;
      }
    }
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();

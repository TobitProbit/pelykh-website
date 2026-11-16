/* Le Salon: shared by every French practice page on pelykh.co.
   Adds a small "back to the Salon" link and records the visit so the hub
   can show the streak and when each page was last practised. */
(function () {
  var KEY = 'salon-v1';
  var path = location.pathname.replace(/index\.html$/, '');
  var slug = path.indexOf('/french-course') === 0 ? 'piliers'
    : (path.match(/^\/french\/([^/]+)\/?$/) || [])[1];
  if (!slug) return;

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  try {
    var st = JSON.parse(localStorage.getItem(KEY) || '{}') || {};
    st.days = st.days || [];
    st.last = st.last || {};
    var t = today();
    if (st.days[st.days.length - 1] !== t) st.days.push(t);
    st.days = st.days.slice(-400);
    st.last[slug] = Date.now();
    localStorage.setItem(KEY, JSON.stringify(st));
  } catch (e) {}

  var a = document.createElement('a');
  a.href = '/french/';
  a.className = 'salon-back';
  a.setAttribute('aria-label', 'Back to Le Salon, all French practice');
  a.innerHTML = '<span aria-hidden="true">←</span> Le Salon';
  var css = document.createElement('style');
  css.textContent =
    '.salon-back{position:fixed;z-index:9999;right:max(12px,env(safe-area-inset-right,0px));bottom:max(12px,env(safe-area-inset-bottom,0px));' +
    'display:inline-flex;gap:.4em;align-items:center;padding:.5em .9em;border-radius:999px;background:#1d2b4f;color:#fff8ec;' +
    'font:600 13px/1 system-ui,-apple-system,sans-serif;text-decoration:none;box-shadow:0 6px 18px -6px rgba(0,0,0,.45);opacity:.92;transition:transform .15s,opacity .15s}' +
    '.salon-back:hover,.salon-back:focus-visible{opacity:1;transform:translateY(-2px)}' +
    '.salon-back:focus-visible{outline:3px solid #e8a33d;outline-offset:2px}' +
    '@media print{.salon-back{display:none}}';
  document.head.appendChild(css);
  document.body.appendChild(a);
})();

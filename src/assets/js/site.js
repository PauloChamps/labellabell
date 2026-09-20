(() => {
  const sidebar = document.querySelector('[data-sidebar]');
  const openButton = document.querySelector('[data-menu-open]');
  const closeButton = document.querySelector('[data-menu-close]');
  const backdrop = document.querySelector('[data-menu-backdrop]');
  if (!sidebar || !openButton || !closeButton || !backdrop) return;

  let returnFocus = null;
  const focusableSelector = 'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
  const isMobile = () => window.matchMedia('(max-width: 760px)').matches;

  function openMenu() {
    if (!isMobile()) return;
    returnFocus = document.activeElement;
    sidebar.removeAttribute('inert');
    sidebar.classList.add('is-open');
    document.body.classList.add('menu-open');
    backdrop.hidden = false;
    openButton.setAttribute('aria-expanded', 'true');
    closeButton.focus();
  }

  function closeMenu() {
    sidebar.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    backdrop.hidden = true;
    openButton.setAttribute('aria-expanded', 'false');
    if (isMobile()) sidebar.setAttribute('inert', '');
    if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
  }

  openButton.addEventListener('click', openMenu);
  closeButton.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (event) => {
    if (!sidebar.classList.contains('is-open')) return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(); return; }
    if (event.key !== 'Tab') return;
    const items = [...sidebar.querySelectorAll(focusableSelector)].filter((item) => item.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  function syncViewport() {
    if (isMobile()) {
      if (!sidebar.classList.contains('is-open')) sidebar.setAttribute('inert', '');
    } else {
      sidebar.removeAttribute('inert');
      if (sidebar.classList.contains('is-open')) closeMenu();
    }
  }
  window.addEventListener('resize', syncViewport);
  syncViewport();
})();

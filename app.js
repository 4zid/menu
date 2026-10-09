/* Esquina Libertad · Carta digital */
(() => {
  'use strict';

  const M = window.MENU;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const fmt = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });
  const money = (n) => '$' + fmt.format(n);
  const DISCOUNT = M.settings.discount.percent / 100;
  const cash = (n) => Math.round(n * (1 - DISCOUNT));
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name, cls = 'i') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ───────────── Índice ───────────── */

  const sectionsById = new Map(M.sections.map((s) => [s.id, s]));
  const catsById = new Map(M.categories.map((c) => [c.id, c]));
  const itemsById = new Map();

  M.categories.forEach((cat) => {
    cat.items.forEach((item) => {
      item.id = `${cat.id}--${slug(item.name)}`;
      item.tags = item.tags || [];
      item.addons = M.addons.filter((a) => a.category === cat.id && !(a.exclude || []).includes(item.name));
      item.haystack = norm([
        item.name, item.desc, item.unit, (item.options || []).join(' '),
        cat.title, sectionsById.get(cat.section).title,
        item.tags.map((t) => M.tags[t] && M.tags[t].label).join(' ')
      ].join(' '));
      itemsById.set(item.id, { item, cat });
    });
  });

  const dietTags = Object.entries(M.tags).filter(([, t]) => t.filterable).map(([id, t]) => ({ id, ...t }));

  const basePrice = (item) => (item.variants ? Math.min(...item.variants.map((v) => v.price)) : item.price);

  /* ───────────── Info del local ───────────── */

  const S = M.settings;
  const waText = encodeURIComponent(`¡Hola! Quiero hacer una reserva en ${S.name}.`);
  const waUrl = `https://wa.me/${S.whatsapp}?text=${waText}`;
  const igUrl = `https://instagram.com/${S.instagram}`;

  $('#wifiNet').textContent = S.wifi.network;
  $('#wifiPass').textContent = S.wifi.password;
  $('#waLink').href = waUrl;
  $('#igLink').href = igUrl;
  $('#waFooter').href = waUrl;
  $('#waFooter').textContent = `WhatsApp ${S.whatsappLabel}`;
  $('#igFooter').href = igUrl;
  $('#igFooter').textContent = `@${S.instagram}`;
  const [y, m, d] = S.updatedAt.split('-');
  $('#updated').textContent = `Precios en pesos (${S.currency}). Carta actualizada el ${+d}/${+m}/${y}.`;

  $('#copyWifi').addEventListener('click', async () => {
    const ok = await copyText(S.wifi.password);
    toast(ok ? 'Clave de WiFi copiada' : `Clave: ${S.wifi.password}`);
  });

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { /* sin soporte */ }
      ta.remove();
      return ok;
    }
  }

  /* ───────────── Render de la carta ───────────── */

  const main = $('#menu');

  function tagIcons(item, cls = 'tag-i') {
    if (!item.tags.length) return '';
    return item.tags
      .filter((t) => M.tags[t])
      .map((t) => `<svg class="${cls}" role="img" aria-label="${esc(M.tags[t].label)}"><title>${esc(M.tags[t].label)}</title><use href="#i-${t}"/></svg>`)
      .join('');
  }

  // Muestra las opciones solo si el nombre no las menciona ya ("Caipirinha o Caipiroska").
  function showOptions(item) {
    if (!item.options || item.desc) return false;
    const n = norm(item.name);
    return !item.options.every((o) => n.includes(norm(o)));
  }

  function rowHTML(item) {
    const off = item.available === false;
    return `
      <button class="item${off ? ' is-off' : ''}" type="button" data-id="${item.id}">
        <span class="item__head">
          <span class="item__name">${esc(item.name)}${item.unit ? `<span class="item__unit">${esc(item.unit)}</span>` : ''}${item.tags.length ? `<span class="item__tags">${tagIcons(item)}</span>` : ''}</span>
          <span class="item__leader" aria-hidden="true"></span>
          <span class="item__price">${item.variants ? 'desde ' : ''}${money(basePrice(item))}</span>
        </span>
        ${item.desc ? `<span class="item__desc">${esc(item.desc)}</span>` : ''}
        ${showOptions(item) ? `<span class="item__opts">${item.options.map(esc).join(' · ')}</span>` : ''}
        ${off ? '<span class="item__off">Sin stock</span>' : ''}
      </button>`;
  }

  function cardHTML(item) {
    const prices = item.variants
      ? item.variants.map((v) => `<span class="pcard__price"><small>${esc(v.label)}</small><b>${money(v.price)}</b></span>`).join('')
      : `<span class="pcard__price"><small>${esc(item.unit || 'Precio')}</small><b>${money(item.price)}</b></span>`;
    return `
      <button class="pcard${item.available === false ? ' is-off' : ''}" type="button" data-id="${item.id}">
        <span class="pcard__title">${esc(item.name)}${tagIcons(item)}</span>
        ${item.desc ? `<span class="pcard__desc">${esc(item.desc)}</span>` : ''}
        <span class="pcard__prices">${prices}</span>
      </button>`;
  }

  function categoryHTML(cat) {
    const cards = cat.layout === 'cards';
    const addons = M.addons.filter((a) => a.category === cat.id);
    return `
      <div class="cat" id="${cat.id}" data-cat="${cat.id}" data-section="${cat.section}">
        <div class="cat__head">
          <h3 class="cat__title">${icon('orn', 'orn orn--l')}<span>${esc(cat.title)}</span>${icon('orn', 'orn')}</h3>
          ${cat.note ? `<p class="cat__note">${esc(cat.note)}</p>` : ''}
        </div>
        <ul class="items${cards ? ' items--cards' : ''}">
          ${cat.items.map((it) => `<li data-li="${it.id}">${cards ? cardHTML(it) : rowHTML(it)}</li>`).join('')}
        </ul>
        ${addons.map((a) => `
          <p class="addon" data-addon>
            <span>+ ${esc(a.name)}</span><span class="item__leader" aria-hidden="true"></span><b>${money(a.price)}</b>
          </p>`).join('')}
      </div>`;
  }

  function renderMenu() {
    main.innerHTML = M.sections.map((sec) => `
      <section class="section" id="${sec.id}" data-section-block="${sec.id}" aria-labelledby="h-${sec.id}">
        <header class="section__head${sec.photo ? ' has-photo' : ''}">
          ${sec.photo ? `<img src="${sec.photo}" alt="" loading="lazy" decoding="async">` : ''}
          <h2 class="section__title" id="h-${sec.id}">${esc(sec.title)}</h2>
        </header>
        ${M.categories.filter((c) => c.section === sec.id).map(categoryHTML).join('')}
      </section>`).join('') + `
      <div class="empty" id="empty" hidden>
        <p class="empty__title">Sin resultados</p>
        <p id="emptyText"></p>
        <button class="btn btn--ghost" type="button" data-clear>Limpiar búsqueda</button>
      </div>`;
  }

  renderMenu();

  /* ───────────── Navegación (tabs + chips + scroll-spy) ───────────── */

  const nav = $('#nav');
  const navAnchor = $('#navAnchor');
  const tabsEl = $('#tabs');
  const catChips = $('#catChips');

  tabsEl.innerHTML = M.sections.map((s) =>
    `<button class="tab" type="button" data-tab="${s.id}">${esc(s.title)}</button>`
  ).join('');

  let activeSection = null;
  let activeCat = null;
  let spyLocked = false;
  let unlockTimer = 0;

  function renderCatChips(sectionId) {
    const cats = M.categories.filter((c) => c.section === sectionId);
    catChips.innerHTML = cats.map((c) =>
      `<a class="chip" href="#${c.id}" data-chip="${c.id}">${esc(c.title)}</a>`
    ).join('');
  }

  function setActive(catId) {
    const cat = catsById.get(catId);
    if (!cat) return;
    if (cat.section !== activeSection) {
      activeSection = cat.section;
      $$('.tab', tabsEl).forEach((t) => {
        if (t.dataset.tab === activeSection) t.setAttribute('aria-current', 'true');
        else t.removeAttribute('aria-current');
      });
      renderCatChips(activeSection);
      activeCat = null;
    }
    if (catId === activeCat) return;
    activeCat = catId;
    $$('.chip', catChips).forEach((c) => {
      const on = c.dataset.chip === catId;
      c.classList.toggle('is-active', on);
      if (on) {
        c.setAttribute('aria-current', 'true');
        const left = c.offsetLeft - (catChips.clientWidth - c.offsetWidth) / 2;
        catChips.scrollTo({ left, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      } else {
        c.removeAttribute('aria-current');
      }
    });
  }

  const visibleCats = () => $$('.cat', main).filter((el) => !el.hidden && !el.closest('.section').hidden);

  function spy() {
    nav.classList.toggle('is-stuck', navAnchor.getBoundingClientRect().top < 0);
    if (spyLocked || nav.classList.contains('is-searching')) return;
    const cats = visibleCats();
    if (!cats.length) return;
    const line = nav.offsetHeight + 16;
    let current = cats[0];
    let prevSection = null;
    for (const el of cats) {
      // La primera categoría de cada sección arranca en el banner de la sección.
      const first = el.dataset.section !== prevSection;
      prevSection = el.dataset.section;
      const top = (first ? el.closest('.section') : el).getBoundingClientRect().top;
      if (top <= line) current = el;
      else break;
    }
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) current = cats[cats.length - 1];
    setActive(current.dataset.cat);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; spy(); });
  }, { passive: true });

  function lockSpy(ms) {
    spyLocked = true;
    clearTimeout(unlockTimer);
    const release = () => {
      clearTimeout(unlockTimer);
      window.removeEventListener('scrollend', release);
      if (!spyLocked) return;
      spyLocked = false;
      spy();
    };
    window.addEventListener('scrollend', release, { once: true });
    unlockTimer = setTimeout(release, ms);
  }

  function scrollToEl(el, smooth = true) {
    const top = el.getBoundingClientRect().top + window.scrollY - nav.offsetHeight + 1;
    const behavior = smooth && !reduceMotion.matches ? 'smooth' : 'auto';
    lockSpy(behavior === 'smooth' ? 900 : 60);
    window.scrollTo({ top: Math.max(0, top), behavior });
  }

  catChips.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-chip]');
    if (!chip) return;
    e.preventDefault();
    const id = chip.dataset.chip;
    setActive(id);
    scrollToEl(document.getElementById(id));
    history.replaceState(null, '', `#${id}`);
  });

  tabsEl.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (!tab) return;
    const first = M.categories.find((c) => c.section === tab.dataset.tab);
    setActive(first.id);
    scrollToEl(document.getElementById(tab.dataset.tab));
    history.replaceState(null, '', `#${tab.dataset.tab}`);
  });

  // Espacio extra al final para que la última categoría pueda llegar arriba.
  function updateTail() {
    const cats = visibleCats();
    const last = cats[cats.length - 1];
    const footer = $('.footer');
    if (!last) { main.style.setProperty('--tail', '0px'); return; }
    const need = window.innerHeight - nav.offsetHeight - last.offsetHeight - footer.offsetHeight;
    main.style.setProperty('--tail', `${Math.max(0, Math.round(need))}px`);
  }

  /* ───────────── Búsqueda y filtros ───────────── */

  const state = { q: '', diets: new Set() };
  const qInput = $('#q');
  const clearQ = $('#clearQ');
  const results = $('#results');
  const dietChips = $('#dietChips');
  const legend = $('#legend');

  const dietChipHTML = (t) =>
    `<button class="chip" type="button" aria-pressed="false" data-diet="${t.id}">${icon(t.id)}${esc(t.label)}</button>`;
  dietChips.innerHTML = dietTags.map(dietChipHTML).join('');
  legend.innerHTML = dietTags.map(dietChipHTML).join('');

  function matchesDiet(item) {
    for (const d of state.diets) {
      const ok = d === 'vegetariano'
        ? item.tags.includes('vegetariano') || item.tags.includes('vegano')
        : item.tags.includes(d);
      if (!ok) return false;
    }
    return true;
  }

  function applyFilters() {
    const tokens = norm(state.q).split(/\s+/).filter(Boolean);
    const active = tokens.length > 0 || state.diets.size > 0;
    let count = 0;

    $$('.cat', main).forEach((catEl) => {
      let visibleInCat = 0;
      $$('[data-li]', catEl).forEach((li) => {
        const { item } = itemsById.get(li.dataset.li);
        const show = !active || (matchesDiet(item) && tokens.every((t) => item.haystack.includes(t)));
        li.hidden = !show;
        if (show) visibleInCat++;
      });
      $$('[data-addon]', catEl).forEach((a) => { a.hidden = active; });
      catEl.hidden = visibleInCat === 0;
      count += visibleInCat;
    });
    $$('[data-section-block]', main).forEach((sec) => {
      sec.hidden = !$$('.cat', sec).some((c) => !c.hidden);
    });

    main.classList.toggle('is-filtering', active);
    $('#empty').hidden = count > 0;
    if (count === 0) {
      const q = state.q.trim();
      const diets = [...state.diets].map((d) => M.tags[d].label).join(' + ');
      $('#emptyText').textContent = q && diets
        ? `No encontramos “${q}” con el filtro ${diets}.`
        : q ? `No encontramos nada para “${q}”.` : `No hay ítems con el filtro ${diets}.`;
    }

    results.classList.toggle('is-visible', active);
    results.innerHTML = active
      ? `<span>${count} ${count === 1 ? 'resultado' : 'resultados'}</span><button type="button" data-clear>Limpiar</button>`
      : '';

    $$('[data-diet]').forEach((b) => b.setAttribute('aria-pressed', String(state.diets.has(b.dataset.diet))));
    clearQ.hidden = !state.q;
    updateTail();
  }

  function jumpToMenuTop() {
    const top = navAnchor.getBoundingClientRect().top + window.scrollY;
    if (window.scrollY > top || nav.classList.contains('is-searching')) {
      lockSpy(60);
      window.scrollTo({ top, behavior: 'auto' });
    }
  }

  function enterSearch(focus) {
    nav.classList.add('is-searching');
    const top = navAnchor.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'auto' });
    if (focus) qInput.focus({ preventScroll: true });
  }

  function clearFilters() {
    state.q = '';
    state.diets.clear();
    qInput.value = '';
    applyFilters();
  }

  function exitSearch() {
    clearFilters();
    nav.classList.remove('is-searching');
    qInput.blur();
    activeSection = null;
    activeCat = null;
    spy();
  }

  let qTimer = 0;
  qInput.addEventListener('input', () => {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => {
      state.q = qInput.value;
      applyFilters();
      jumpToMenuTop();
    }, 90);
  });
  qInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') qInput.blur();
    if (e.key === 'Escape') exitSearch();
  });
  clearQ.addEventListener('click', () => {
    qInput.value = '';
    state.q = '';
    applyFilters();
    qInput.focus();
  });

  $('#openSearch').addEventListener('click', () => enterSearch(true));
  $('#searchEntry').addEventListener('click', () => enterSearch(true));
  $('#closeSearch').addEventListener('click', exitSearch);

  document.addEventListener('click', (e) => {
    const diet = e.target.closest('[data-diet]');
    if (diet) {
      const id = diet.dataset.diet;
      if (state.diets.has(id)) state.diets.delete(id);
      else state.diets.add(id);
      if (!nav.classList.contains('is-searching')) enterSearch(false);
      applyFilters();
      jumpToMenuTop();
      return;
    }
    if (e.target.closest('[data-clear]')) {
      clearFilters();
      if (!qInput.value && nav.classList.contains('is-searching')) qInput.focus({ preventScroll: true });
    }
  });

  /* ───────────── Bottom sheets ───────────── */

  function openSheet(dlg) {
    if (dlg.open) return;
    dlg.showModal();
    document.documentElement.classList.add('is-locked');
    $('.sheet__body', dlg).scrollTop = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => dlg.classList.add('is-open')));
  }

  function closeSheet(dlg) {
    if (!dlg.open || dlg.dataset.closing) return;
    dlg.dataset.closing = '1';
    dlg.style.transform = '';
    dlg.classList.remove('is-open', 'is-dragging');
    const done = () => {
      if (!dlg.dataset.closing) return;
      delete dlg.dataset.closing;
      dlg.close();
      if (!$$('dialog[open]').length) document.documentElement.classList.remove('is-locked');
    };
    if (reduceMotion.matches) done();
    else {
      dlg.addEventListener('transitionend', done, { once: true });
      setTimeout(done, 420);
    }
  }

  $$('dialog.sheet').forEach((dlg) => {
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); closeSheet(dlg); });
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) {
        // Click en el backdrop (fuera del contenido).
        const r = dlg.getBoundingClientRect();
        if (e.clientY < r.top || e.clientX < r.left || e.clientX > r.right) closeSheet(dlg);
      }
      if (e.target.closest('[data-close]')) closeSheet(dlg);
    });

    // Arrastrar hacia abajo para cerrar.
    const grab = $('[data-grab]', dlg);
    let startY = 0;
    let dy = 0;
    let dragging = false;
    grab.addEventListener('pointerdown', (e) => {
      dragging = true;
      startY = e.clientY;
      dy = 0;
      dlg.classList.add('is-dragging');
      grab.setPointerCapture(e.pointerId);
    });
    grab.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      dy = Math.max(0, e.clientY - startY);
      dlg.style.transform = `translateY(${dy}px)`;
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      dlg.classList.remove('is-dragging');
      if (dy > 90) closeSheet(dlg);
      else dlg.style.transform = '';
    };
    grab.addEventListener('pointerup', end);
    grab.addEventListener('pointercancel', end);
  });

  // Atajo "/" para buscar (teclado físico).
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== qInput && !$$('dialog[open]').length) {
      e.preventDefault();
      enterSearch(true);
    }
  });

  /* ───────────── Detalle del ítem (solo lectura) ───────────── */

  const itemSheet = $('#itemSheet');
  const itemBody = $('#itemBody');

  const priceBlock = (price) =>
    `<span class="detail__price">${money(price)}</span><span class="detail__cash">${money(cash(price))} en efectivo</span>`;

  function openItem(id) {
    const { item, cat } = itemsById.get(id);
    const tags = item.tags.filter((t) => M.tags[t]);
    const off = item.available === false;
    itemBody.innerHTML = `
      <p class="sheet__kicker">${esc(cat.title)}${cat.note ? ` · ${esc(cat.note)}` : ''}</p>
      <h2 class="sheet__title" id="itemTitle">${esc(item.name)}${item.unit ? ` <span class="item__unit">${esc(item.unit)}</span>` : ''}</h2>
      ${tags.length ? `<div class="sheet__tags">${tags.map((t) => `<span class="badge">${icon(t)}${esc(M.tags[t].label)}</span>`).join('')}</div>` : ''}
      ${item.desc ? `<p class="sheet__desc">${esc(item.desc)}</p>` : ''}
      ${off ? '<p class="detail__off">Sin stock por el momento</p>' : ''}
      <ul class="detail__rows">
        ${item.variants
          ? item.variants.map((v) => `<li class="detail__row"><span>${esc(v.label)}</span>${priceBlock(v.price)}</li>`).join('')
          : `<li class="detail__row"><span>Precio</span>${priceBlock(item.price)}</li>`}
        ${item.addons.map((a) => `<li class="detail__row detail__row--addon"><span>${esc(a.name)}</span><span class="detail__price">+ ${money(a.price)}</span></li>`).join('')}
      </ul>
      ${item.options ? `
        <p class="detail__label">Opciones</p>
        <div class="detail__opts">${item.options.map((o) => `<span class="detail__opt">${esc(o)}</span>`).join('')}</div>` : ''}
      <p class="detail__hint">${M.settings.discount.percent}% de descuento pagando en ${esc(M.settings.discount.method)}.</p>`;
    openSheet(itemSheet);
  }

  main.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-id]');
    if (btn) openItem(btn.dataset.id);
  });

  /* ───────────── Toast ───────────── */

  const toastEl = $('#toast');
  let toastTimer = 0;
  function toast(msg) {
    toastEl.innerHTML = `${icon('check')}<span>${esc(msg)}</span>`;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2200);
  }

  /* ───────────── Inicio ───────────── */

  applyFilters();

  function goToHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id && document.getElementById(id);
    if (!el || !(catsById.has(id) || sectionsById.has(id))) return false;
    setActive(catsById.has(id) ? id : M.categories.find((c) => c.section === id).id);
    scrollToEl(el, false);
    return true;
  }

  // Si la persona todavía no scrolleó, se re-ubica cuando cargan las fuentes (cambian las alturas).
  let touched = false;
  const markTouched = () => { touched = true; };
  ['touchstart', 'wheel', 'keydown', 'pointerdown'].forEach((ev) => window.addEventListener(ev, markTouched, { once: true, passive: true }));

  if (!goToHash()) spy();
  window.addEventListener('hashchange', goToHash);
  window.addEventListener('resize', () => { updateTail(); spy(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      updateTail();
      if (!touched && location.hash) goToHash();
      else spy();
    });
  }
})();

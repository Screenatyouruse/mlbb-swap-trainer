/* MLBB Swap Trainer — Custom UI Move & Scale Layout Editor
 * Exposes window.LayoutEditor (zero external dependencies, file:// & GitHub Pages safe).
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'mlbb_swap_layout_v2';
  var GLOBAL_SCALE_MIN = 0.75;
  var GLOBAL_SCALE_MAX = 1.50;
  var DEFAULT_ITEM_MIN_SCALE = 0.60;
  var DEFAULT_ITEM_MAX_SCALE = 1.80;
  var EDGE_PAD_PX = 4;

  var PRESETS = {
    default: { id: 'default', label: 'Default (100%)', shortLabel: '100%', globalScale: 1.00 },
    large:   { id: 'large',   label: 'Large Mobile (125%)', shortLabel: '125%', globalScale: 1.25 },
    xl:      { id: 'xl',      label: 'XL Thumb (145%)', shortLabel: '145%', globalScale: 1.45 }
  };

  var ANCHOR_MAP = {
    'top-left':      { ox: '0%',   oy: '0%',   tx: '0%',    ty: '0%' },
    'top-center':    { ox: '50%',  oy: '0%',   tx: '-50%',  ty: '0%' },
    'top-right':     { ox: '100%', oy: '0%',   tx: '-100%', ty: '0%' },
    'center':        { ox: '50%',  oy: '50%',  tx: '-50%',  ty: '-50%' },
    'bottom-left':   { ox: '0%',   oy: '100%', tx: '0%',    ty: '-100%' },
    'bottom-center': { ox: '50%',  oy: '100%', tx: '-50%',  ty: '-100%' },
    'bottom-right':  { ox: '100%', oy: '100%', tx: '-100%', ty: '-100%' }
  };

  /* Internal state */
  var _containerEl = null;
  var _storageKey = STORAGE_KEY;
  var _onShopPreview = null;
  var _onChange = null;
  var _onEditChange = null;

  var _items = new Map();       // id -> normalized ItemRecord
  var _itemOrder = [];          // registration order of ids
  var _saved = {
    version: 2,
    globalScale: 1.0,
    preset: 'default',
    items: {}                   // id -> { x, y, scale }
  };

  var _editing = false;
  var _previewMode = 'hud';     // 'hud' | 'shop'
  var _selectedId = null;

  var _overlayEl = null;
  var _handles = new Map();     // id -> handle DOM element
  var _toolbarEl = null;
  var _ui = {};                 // cached toolbar control refs
  var _toolbarDock = 'bottom';  // 'bottom' | 'top' | 'floating'
  var _toolbarUserMoved = false;

  var _forcedVisible = new Map(); // el -> { display }
  var _resizeObserver = null;
  var _rafSync = 0;
  var _boundListeners = false;

  /* ---------------------------------------------------------------------
   * Utilities
   * --------------------------------------------------------------------- */
  function clamp(v, lo, hi) {
    if (typeof v !== 'number' || !isFinite(v)) return lo;
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function round2(v) {
    return Math.round(v * 100) / 100;
  }

  function resolveEl(ref) {
    if (!ref) return null;
    if (typeof ref === 'function') {
      try { return ref() || null; } catch (_) { return null; }
    }
    if (typeof ref === 'string') {
      return (_containerEl && _containerEl.querySelector(ref)) || document.querySelector(ref);
    }
    return ref.nodeType === 1 ? ref : null;
  }

  function getAnchorSpec(anchor) {
    return ANCHOR_MAP[anchor] || ANCHOR_MAP.center;
  }

  function matchPresetForScale(gs) {
    var keys = Object.keys(PRESETS);
    for (var i = 0; i < keys.length; i++) {
      var p = PRESETS[keys[i]];
      if (Math.abs(p.globalScale - gs) < 0.005) return p.id;
    }
    return 'custom';
  }

  function loadStorage() {
    var base = { version: 2, globalScale: 1.0, preset: 'default', items: {} };
    try {
      var raw = global.localStorage && global.localStorage.getItem(_storageKey);
      if (!raw) return base;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return base;
      if (typeof parsed.globalScale === 'number' && isFinite(parsed.globalScale)) {
        base.globalScale = round2(clamp(parsed.globalScale, GLOBAL_SCALE_MIN, GLOBAL_SCALE_MAX));
      }
      base.preset = typeof parsed.preset === 'string'
        ? parsed.preset
        : matchPresetForScale(base.globalScale);
      if (parsed.items && typeof parsed.items === 'object') {
        Object.keys(parsed.items).forEach(function (id) {
          var entry = parsed.items[id];
          if (entry && typeof entry === 'object') {
            base.items[id] = {
              x: typeof entry.x === 'number' && isFinite(entry.x) ? round2(entry.x) : null,
              y: typeof entry.y === 'number' && isFinite(entry.y) ? round2(entry.y) : null,
              scale: typeof entry.scale === 'number' && isFinite(entry.scale) ? round2(entry.scale) : null
            };
          }
        });
      }
    } catch (_) {
      /* Ignore storage errors under restricted file:// / private mode */
    }
    return base;
  }

  function saveStorage() {
    try {
      if (!global.localStorage) return;
      var out = {
        version: 2,
        globalScale: round2(_saved.globalScale),
        preset: matchPresetForScale(_saved.globalScale),
        items: {}
      };
      _itemOrder.forEach(function (id) {
        var rec = _items.get(id);
        if (!rec) return;
        out.items[id] = {
          x: rec.x === null ? null : round2(rec.x),
          y: rec.y === null ? null : round2(rec.y),
          scale: round2(rec.scale)
        };
      });
      // Preserve saved entries for items not yet registered
      Object.keys(_saved.items).forEach(function (id) {
        if (!out.items[id]) out.items[id] = _saved.items[id];
      });
      global.localStorage.setItem(_storageKey, JSON.stringify(out));
    } catch (_) {
      /* Ignore storage errors */
    }
  }

  /* ---------------------------------------------------------------------
   * Item Normalization & Inheritance
   * --------------------------------------------------------------------- */
  function normalizeItem(cfg) {
    if (!cfg || !cfg.id) {
      throw new Error('LayoutEditor: item config requires a unique "id".');
    }
    var minS = typeof cfg.minScale === 'number' ? cfg.minScale : DEFAULT_ITEM_MIN_SCALE;
    var maxS = typeof cfg.maxScale === 'number' ? cfg.maxScale : DEFAULT_ITEM_MAX_SCALE;
    if (minS > maxS) { var tmp = minS; minS = maxS; maxS = tmp; }

    var hasAbsDefault = (typeof cfg.defaultX === 'number' && isFinite(cfg.defaultX)) &&
                        (typeof cfg.defaultY === 'number' && isFinite(cfg.defaultY));
    var defScale = clamp(
      typeof cfg.defaultScale === 'number' ? cfg.defaultScale : 1.0,
      minS,
      maxS
    );

    var rec = {
      id: String(cfg.id),
      label: cfg.label ? String(cfg.label) : String(cfg.id),
      elRef: cfg.el,
      el: resolveEl(cfg.el),
      scope: (cfg.scope === 'shop' || cfg.scope === 'global') ? cfg.scope : 'hud',
      positionMode: hasAbsDefault ? 'absolute' : 'offset',
      defaultX: hasAbsDefault ? round2(cfg.defaultX) : 0,
      defaultY: hasAbsDefault ? round2(cfg.defaultY) : 0,
      defaultScale: round2(defScale),
      minScale: minS,
      maxScale: maxS,
      movable: cfg.movable !== false,
      scalable: cfg.scalable !== false,
      anchor: ANCHOR_MAP[cfg.anchor] ? cfg.anchor : 'center',
      explicitApplyGlobalScale: typeof cfg.applyGlobalScale === 'boolean' ? cfg.applyGlobalScale : null,
      // Active layout values
      x: hasAbsDefault ? round2(cfg.defaultX) : 0,
      y: hasAbsDefault ? round2(cfg.defaultY) : 0,
      scale: round2(defScale)
    };

    // Hydrate from persisted state if present
    var persisted = _saved.items[rec.id];
    if (persisted) {
      if (rec.movable && typeof persisted.x === 'number' && isFinite(persisted.x)) {
        rec.x = round2(persisted.x);
      }
      if (rec.movable && typeof persisted.y === 'number' && isFinite(persisted.y)) {
        rec.y = round2(persisted.y);
      }
      if (rec.scalable && typeof persisted.scale === 'number' && isFinite(persisted.scale)) {
        rec.scale = round2(clamp(persisted.scale, rec.minScale, rec.maxScale));
      }
    }

    return rec;
  }

  function getItemEl(rec) {
    if (rec.el && rec.el.isConnected) return rec.el;
    rec.el = resolveEl(rec.elRef);
    return rec.el;
  }

  /* Detect whether an ancestor registered item already applies globalScale,
   * avoiding double-scaling nested children (e.g. buttons inside shop-panel). */
  function shouldApplyGlobalScale(rec) {
    if (rec.explicitApplyGlobalScale !== null) {
      return rec.explicitApplyGlobalScale;
    }
    var el = getItemEl(rec);
    if (!el) return true;
    var parent = el.parentElement;
    while (parent && parent !== _containerEl && parent !== document.body) {
      var foundAncestor = false;
      _items.forEach(function (other) {
        if (other.id === rec.id) return;
        var otherEl = getItemEl(other);
        if (otherEl && otherEl === parent && other.scalable) {
          foundAncestor = true;
        }
      });
      if (foundAncestor) return false;
      parent = parent.parentElement;
    }
    return true;
  }

  function getEffectiveScale(rec) {
    var base = rec.scalable ? rec.scale : rec.defaultScale;
    var mult = shouldApplyGlobalScale(rec) ? _saved.globalScale : 1.0;
    return round2(base * mult);
  }

  function isInActiveScope(rec) {
    return rec.scope === 'global' || rec.scope === _previewMode;
  }

  /* ---------------------------------------------------------------------
   * Applying CSS Positioning & Scale
   * --------------------------------------------------------------------- */
  function applyItem(rec, clampToContainer) {
    var el = getItemEl(rec);
    if (!el) return;

    var anchor = getAnchorSpec(rec.anchor);
    var effScale = getEffectiveScale(rec);

    el.classList.add('le-managed');
    el.setAttribute('data-le-id', rec.id);
    el.style.setProperty('--le-scale', String(effScale));
    el.style.setProperty('--le-x', String(rec.x));
    el.style.setProperty('--le-y', String(rec.y));
    el.style.transformOrigin = anchor.ox + ' ' + anchor.oy;

    if (rec.positionMode === 'absolute') {
      var cs = global.getComputedStyle(el);
      if (cs.position === 'static') {
        el.classList.add('le-positioned');
      }
      el.style.left = rec.x + '%';
      el.style.top = rec.y + '%';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      el.style.transform = 'translate(' + anchor.tx + ', ' + anchor.ty + ') scale(' + effScale + ')';
    } else {
      // Offset mode (element stays in its natural CSS layout flow)
      var cRect = _containerEl ? _containerEl.getBoundingClientRect() : null;
      var cw = (cRect && cRect.width) || global.innerWidth || 1;
      var ch = (cRect && cRect.height) || global.innerHeight || 1;
      var dxPx = (rec.x / 100) * cw;
      var dyPx = (rec.y / 100) * ch;

      if (rec.movable && (Math.abs(dxPx) > 0.05 || Math.abs(dyPx) > 0.05)) {
        el.style.transform = 'translate(' + round2(dxPx) + 'px, ' + round2(dyPx) + 'px) scale(' + effScale + ')';
      } else if (Math.abs(effScale - 1) > 0.001) {
        el.style.transform = 'scale(' + effScale + ')';
      } else {
        el.style.transform = '';
      }
    }

    if (clampToContainer && rec.movable && _containerEl) {
      clampItemInsideContainer(rec, el);
    }
  }

  /* Ensure visible movable items never clip outside containerEl after scale/preset changes */
  function clampItemInsideContainer(rec, el) {
    if (!el || !_containerEl) return;
    var cRect = _containerEl.getBoundingClientRect();
    var eRect = el.getBoundingClientRect();
    if (cRect.width < 10 || cRect.height < 10 || eRect.width < 2 || eRect.height < 2) return;

    var minL = cRect.left + EDGE_PAD_PX;
    var maxR = cRect.right - EDGE_PAD_PX;
    var minT = cRect.top + EDGE_PAD_PX;
    var maxB = cRect.bottom - EDGE_PAD_PX;

    var nudgeX = 0;
    var nudgeY = 0;

    if (eRect.width <= (maxR - minL)) {
      if (eRect.left < minL) nudgeX = minL - eRect.left;
      else if (eRect.right > maxR) nudgeX = maxR - eRect.right;
    } else {
      // Oversized item: keep centered horizontally
      var targetCenterX = cRect.left + cRect.width / 2;
      var currentCenterX = eRect.left + eRect.width / 2;
      nudgeX = targetCenterX - currentCenterX;
    }

    if (eRect.height <= (maxB - minT)) {
      if (eRect.top < minT) nudgeY = minT - eRect.top;
      else if (eRect.bottom > maxB) nudgeY = maxB - eRect.bottom;
    } else {
      var targetCenterY = cRect.top + cRect.height / 2;
      var currentCenterY = eRect.top + eRect.height / 2;
      nudgeY = targetCenterY - currentCenterY;
    }

    if (Math.abs(nudgeX) < 0.75 && Math.abs(nudgeY) < 0.75) return;

    var refRect = getReferenceRect(rec, el);
    if (refRect.width > 0 && refRect.height > 0) {
      rec.x = round2(rec.x + (nudgeX / refRect.width) * 100);
      rec.y = round2(rec.y + (nudgeY / refRect.height) * 100);
      applyItem(rec, false);
    }
  }

  function getReferenceRect(rec, el) {
    if (rec.positionMode === 'absolute') {
      var op = el.offsetParent || _containerEl;
      if (op && op.getBoundingClientRect) {
        var r = op.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) return r;
      }
    } else {
      // For offset mode, transform translate happens inside parent's scale
      var pScale = getAncestorVisualScale(el);
      var cRect = _containerEl ? _containerEl.getBoundingClientRect() : { width: global.innerWidth, height: global.innerHeight };
      return {
        width: (cRect.width || 1) * pScale.x,
        height: (cRect.height || 1) * pScale.y
      };
    }
    return _containerEl.getBoundingClientRect();
  }

  function getAncestorVisualScale(el) {
    var sx = 1;
    var sy = 1;
    var cur = el ? el.parentElement : null;
    while (cur && cur !== _containerEl && cur !== document.body) {
      if (cur.offsetWidth > 0 && cur.offsetHeight > 0) {
        var r = cur.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          var rx = r.width / cur.offsetWidth;
          var ry = r.height / cur.offsetHeight;
          // Detect transformed ancestor
          if (Math.abs(rx - 1) > 0.01 || Math.abs(ry - 1) > 0.01) {
            return { x: rx, y: ry };
          }
        }
      }
      cur = cur.parentElement;
    }
    return { x: sx, y: sy };
  }

  function applyAll(clampVisible) {
    if (_containerEl) {
      _containerEl.style.setProperty('--le-global-scale', String(_saved.globalScale));
    }
    _itemOrder.forEach(function (id) {
      var rec = _items.get(id);
      if (rec) applyItem(rec, !!clampVisible);
    });
    if (_editing) {
      scheduleOverlaySync();
    }
  }

  function notifyChange() {
    if (typeof _onChange === 'function') {
      try { _onChange(getStateSnapshot()); } catch (_) { /* ignore consumer error */ }
    }
  }

  function getStateSnapshot() {
    var itemsOut = {};
    _itemOrder.forEach(function (id) {
      var rec = _items.get(id);
      if (!rec) return;
      itemsOut[id] = {
        x: rec.x,
        y: rec.y,
        scale: rec.scale,
        effectiveScale: getEffectiveScale(rec)
      };
    });
    return {
      globalScale: _saved.globalScale,
      preset: matchPresetForScale(_saved.globalScale),
      editing: _editing,
      previewMode: _previewMode,
      items: itemsOut
    };
  }

  /* ---------------------------------------------------------------------
   * Force-Reveal Hidden Active-Scope Items During Edit Mode
   * --------------------------------------------------------------------- */
  function revealHiddenScopeItems() {
    restoreForcedVisible();
    _itemOrder.forEach(function (id) {
      var rec = _items.get(id);
      if (!rec || !isInActiveScope(rec)) return;
      var el = getItemEl(rec);
      if (!el) return;
      var cs = global.getComputedStyle(el);
      var needsDisplay = cs.display === 'none';
      var needsVis = cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.1;
      if (needsDisplay || needsVis) {
        _forcedVisible.set(el, {
          inlineDisplay: el.style.display,
          changedDisplay: needsDisplay
        });
        if (needsDisplay) {
          var preferred = el.getAttribute('data-le-display') || 'flex';
          el.style.display = preferred;
        }
        el.classList.add('le-force-visible');
      }
    });
  }

  function restoreForcedVisible() {
    _forcedVisible.forEach(function (prev, el) {
      if (prev.changedDisplay) {
        el.style.display = prev.inlineDisplay;
      }
      el.classList.remove('le-force-visible');
    });
    _forcedVisible.clear();
  }

  /* ---------------------------------------------------------------------
   * Overlay Handles (Dashed Cyan / Gold Selected + Badges + Resize Knob)
   * --------------------------------------------------------------------- */
  function ensureOverlay() {
    if (_overlayEl && _overlayEl.isConnected) return _overlayEl;
    if (!_containerEl) return null;

    var cs = global.getComputedStyle(_containerEl);
    if (cs.position === 'static') {
      _containerEl.style.position = 'relative';
    }

    _overlayEl = document.createElement('div');
    _overlayEl.className = 'le-overlay';
    _overlayEl.setAttribute('data-le-ui', 'overlay');

    // Tapping empty overlay area swallows event so trainer/shop never fires
    _overlayEl.addEventListener('pointerdown', function (e) {
      if (e.target === _overlayEl) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    _containerEl.appendChild(_overlayEl);
    return _overlayEl;
  }

  function rebuildHandles() {
    var overlay = ensureOverlay();
    if (!overlay) return;
    overlay.innerHTML = '';
    _handles.clear();

    _itemOrder.forEach(function (id) {
      var rec = _items.get(id);
      if (!rec || !isInActiveScope(rec)) return;

      var handle = document.createElement('div');
      handle.className = 'le-handle';
      handle.setAttribute('data-le-handle', id);
      if (!rec.movable) handle.classList.add('le-immovable');
      if (rec.scalable) handle.classList.add('le-scalable');
      if (id === _selectedId) handle.classList.add('le-selected');

      var badge = document.createElement('div');
      badge.className = 'le-badge';
      badge.innerHTML = '<span class="le-badge-name"></span> <span class="le-badge-scale"></span>';
      badge.querySelector('.le-badge-name').textContent = rec.label;
      badge.querySelector('.le-badge-scale').textContent = Math.round(rec.scale * 100) + '%';
      handle.appendChild(badge);

      var knob = document.createElement('div');
      knob.className = 'le-resize-knob';
      knob.setAttribute('title', 'Drag to resize');
      handle.appendChild(knob);

      attachHandleInteractions(handle, knob, rec);

      overlay.appendChild(handle);
      _handles.set(id, handle);
    });

    syncOverlay();
  }

  function syncOverlay() {
    if (!_editing || !_overlayEl || !_containerEl) return;
    var cRect = _containerEl.getBoundingClientRect();
    if (cRect.width < 1 || cRect.height < 1) return;

    // Sort handles by area so smaller nested elements sit above larger containers (e.g. buttons inside shop-panel)
    var entries = [];
    _handles.forEach(function (handle, id) {
      var rec = _items.get(id);
      var el = rec ? getItemEl(rec) : null;
      if (!rec || !el) {
        handle.style.display = 'none';
        return;
      }
      var r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) {
        handle.style.display = 'none';
        return;
      }

      handle.style.display = 'block';
      var left = r.left - cRect.left;
      var top = r.top - cRect.top;
      handle.style.left = round2(left) + 'px';
      handle.style.top = round2(top) + 'px';
      handle.style.width = round2(r.width) + 'px';
      handle.style.height = round2(r.height) + 'px';

      var isSel = id === _selectedId;
      handle.classList.toggle('le-selected', isSel);

      var badge = handle.querySelector('.le-badge');
      if (badge) {
        var scaleSpan = badge.querySelector('.le-badge-scale');
        if (scaleSpan) {
          scaleSpan.textContent = Math.round(rec.scale * 100) + '%';
        }
        badge.classList.remove('le-badge-inside', 'le-badge-bottom');
        if (top < 26) {
          if (r.height > 44) badge.classList.add('le-badge-inside');
          else badge.classList.add('le-badge-bottom');
        }
      }

      entries.push({
        id: id,
        handle: handle,
        area: r.width * r.height,
        selected: isSel
      });
    });

    // Larger area -> lower z-index; smaller area -> higher z-index
    entries.sort(function (a, b) {
      return b.area - a.area;
    });
    for (var i = 0; i < entries.length; i++) {
      var z = 201 + i * 2 + (entries[i].selected ? 1 : 0);
      entries[i].handle.style.zIndex = String(z);
    }
  }

  function scheduleOverlaySync() {
    if (_rafSync) return;
    _rafSync = global.requestAnimationFrame(function () {
      _rafSync = 0;
      syncOverlay();
    });
  }

  /* ---------------------------------------------------------------------
   * Handle Drag-to-Move & Corner Drag-to-Resize
   * --------------------------------------------------------------------- */
  function attachHandleInteractions(handle, knob, rec) {
    /* Corner resize drag */
    knob.addEventListener('pointerdown', function (e) {
      if (!rec.scalable) return;
      e.preventDefault();
      e.stopPropagation();
      selectItem(rec.id);

      var el = getItemEl(rec);
      if (!el) return;

      var pointerId = e.pointerId;
      var startX = e.clientX;
      var startY = e.clientY;
      var startScale = rec.scale;
      var startRect = el.getBoundingClientRect();
      var baseDiag = Math.max(40, Math.hypot(startRect.width, startRect.height));

      if (knob.setPointerCapture) {
        try { knob.setPointerCapture(pointerId); } catch (_) {}
      }
      handle.classList.add('le-dragging');

      function onMove(ev) {
        if (ev.pointerId !== pointerId) return;
        ev.preventDefault();
        var dx = ev.clientX - startX;
        var dy = ev.clientY - startY;
        var delta = (dx + dy) / baseDiag;
        var nextScale = round2(clamp(startScale * (1 + delta * 0.9), rec.minScale, rec.maxScale));
        if (nextScale !== rec.scale) {
          rec.scale = nextScale;
          applyItem(rec, true);
          syncOverlay();
          updateToolbarUI();
          notifyChange();
        }
      }

      function onUp(ev) {
        if (ev.pointerId !== pointerId) return;
        handle.classList.remove('le-dragging');
        knob.removeEventListener('pointermove', onMove);
        knob.removeEventListener('pointerup', onUp);
        knob.removeEventListener('pointercancel', onUp);
        if (knob.releasePointerCapture) {
          try { knob.releasePointerCapture(pointerId); } catch (_) {}
        }
        saveStorage();
        notifyChange();
      }

      knob.addEventListener('pointermove', onMove);
      knob.addEventListener('pointerup', onUp);
      knob.addEventListener('pointercancel', onUp);
    });

    /* Main handle tap-to-select + drag-to-move */
    handle.addEventListener('pointerdown', function (e) {
      if (e.target === knob) return;
      e.preventDefault();
      e.stopPropagation();

      selectItem(rec.id);
      if (!rec.movable) return;

      var el = getItemEl(rec);
      if (!el || !_containerEl) return;

      var pointerId = e.pointerId;
      var startClientX = e.clientX;
      var startClientY = e.clientY;
      var startItemX = rec.x;
      var startItemY = rec.y;
      var startElRect = el.getBoundingClientRect();
      var cRect = _containerEl.getBoundingClientRect();
      var refRect = getReferenceRect(rec, el);
      var moved = false;

      if (handle.setPointerCapture) {
        try { handle.setPointerCapture(pointerId); } catch (_) {}
      }
      handle.classList.add('le-dragging');

      function onMove(ev) {
        if (ev.pointerId !== pointerId) return;
        ev.preventDefault();
        var rawDX = ev.clientX - startClientX;
        var rawDY = ev.clientY - startClientY;
        if (!moved && Math.hypot(rawDX, rawDY) < 2) return;
        moved = true;

        // Clamp projected screen rect strictly inside containerEl bounds
        var minL = cRect.left + EDGE_PAD_PX;
        var maxR = cRect.right - EDGE_PAD_PX;
        var minT = cRect.top + EDGE_PAD_PX;
        var maxB = cRect.bottom - EDGE_PAD_PX;

        var clampedDX = rawDX;
        var clampedDY = rawDY;

        if (startElRect.width <= (maxR - minL)) {
          var minDX = minL - startElRect.left;
          var maxDX = maxR - startElRect.right;
          clampedDX = clamp(rawDX, minDX, maxDX);
        } else {
          // Oversized item: allow bounded pan without losing it off-screen
          var panMinX = maxR - startElRect.right;
          var panMaxX = minL - startElRect.left;
          clampedDX = clamp(rawDX, Math.min(panMinX, panMaxX), Math.max(panMinX, panMaxX));
        }

        if (startElRect.height <= (maxB - minT)) {
          var minDY = minT - startElRect.top;
          var maxDY = maxB - startElRect.bottom;
          clampedDY = clamp(rawDY, minDY, maxDY);
        } else {
          var panMinY = maxB - startElRect.bottom;
          var panMaxY = minT - startElRect.top;
          clampedDY = clamp(rawDY, Math.min(panMinY, panMaxY), Math.max(panMinY, panMaxY));
        }

        if (refRect.width > 0 && refRect.height > 0) {
          rec.x = round2(startItemX + (clampedDX / refRect.width) * 100);
          rec.y = round2(startItemY + (clampedDY / refRect.height) * 100);
          applyItem(rec, false);
          syncOverlay();
          notifyChange();
        }
      }

      function onUp(ev) {
        if (ev.pointerId !== pointerId) return;
        handle.classList.remove('le-dragging');
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);
        handle.removeEventListener('pointercancel', onUp);
        if (handle.releasePointerCapture) {
          try { handle.releasePointerCapture(pointerId); } catch (_) {}
        }
        if (moved) {
          saveStorage();
          notifyChange();
        }
      }

      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
      handle.addEventListener('pointercancel', onUp);
    });
  }

  /* ---------------------------------------------------------------------
   * Floating / Auto-Docking Editor Toolbar
   * --------------------------------------------------------------------- */
  function buildToolbar() {
    if (_toolbarEl && _toolbarEl.isConnected) return _toolbarEl;

    var bar = document.createElement('div');
    bar.className = 'le-toolbar le-dock-bottom';
    bar.setAttribute('data-le-ui', 'toolbar');
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Custom UI Layout Editor');

    bar.innerHTML =
      '<div class="le-row">' +
        '<div class="le-grip" title="Drag toolbar" aria-label="Drag toolbar">⠿</div>' +
        '<button type="button" class="le-btn le-btn-icon" data-le-act="flip-dock" title="Dock top / bottom">⇅</button>' +
        '<div class="le-seg" role="group" aria-label="Preview view">' +
          '<button type="button" class="le-seg-btn active" data-le-preview="hud">HUD</button>' +
          '<button type="button" class="le-seg-btn" data-le-preview="shop">Shop</button>' +
        '</div>' +
        '<div class="le-selected-pill le-none" data-le-ref="sel-pill">' +
          '<span class="le-dot"></span>' +
          '<span data-le-ref="sel-name">Tap element</span>' +
        '</div>' +
        '<button type="button" class="le-btn" data-le-act="reset-item" title="Reset selected element">↺ Reset Btn</button>' +
        '<button type="button" class="le-btn le-btn-danger" data-le-act="reset-all" title="Reset all positions & scales">Reset All</button>' +
        '<button type="button" class="le-btn le-btn-done" data-le-act="done">✓ Done</button>' +
      '</div>' +
      '<div class="le-row">' +
        '<label class="le-slider-group le-disabled" data-le-ref="item-scale-group">' +
          '<span class="le-slider-label">Scale</span>' +
          '<input type="range" class="le-slider" data-le-ref="item-scale" min="60" max="180" step="1" value="100">' +
          '<span class="le-slider-val" data-le-ref="item-scale-val">100%</span>' +
        '</label>' +
        '<span class="le-sep"></span>' +
        '<label class="le-slider-group">' +
          '<span class="le-slider-label">Global</span>' +
          '<input type="range" class="le-slider" data-le-ref="global-scale" min="75" max="150" step="1" value="100">' +
          '<span class="le-slider-val" data-le-ref="global-scale-val">100%</span>' +
        '</label>' +
        '<div class="le-presets" role="group" aria-label="Scale presets">' +
          '<button type="button" class="le-chip" data-le-preset="default" title="Default (100%)">100%</button>' +
          '<button type="button" class="le-chip" data-le-preset="large" title="Large Mobile (125%)">125%</button>' +
          '<button type="button" class="le-chip" data-le-preset="xl" title="XL Thumb (145%)">145%</button>' +
        '</div>' +
      '</div>';

    // Cache refs
    _ui = {
      grip: bar.querySelector('.le-grip'),
      flipBtn: bar.querySelector('[data-le-act="flip-dock"]'),
      previewBtns: bar.querySelectorAll('[data-le-preview]'),
      selPill: bar.querySelector('[data-le-ref="sel-pill"]'),
      selName: bar.querySelector('[data-le-ref="sel-name"]'),
      resetItemBtn: bar.querySelector('[data-le-act="reset-item"]'),
      resetAllBtn: bar.querySelector('[data-le-act="reset-all"]'),
      doneBtn: bar.querySelector('[data-le-act="done"]'),
      itemScaleGroup: bar.querySelector('[data-le-ref="item-scale-group"]'),
      itemScaleInput: bar.querySelector('[data-le-ref="item-scale"]'),
      itemScaleVal: bar.querySelector('[data-le-ref="item-scale-val"]'),
      globalScaleInput: bar.querySelector('[data-le-ref="global-scale"]'),
      globalScaleVal: bar.querySelector('[data-le-ref="global-scale-val"]'),
      presetBtns: bar.querySelectorAll('[data-le-preset]')
    };

    // Stop pointer events inside toolbar from leaking to stage
    bar.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
    });

    // HUD / Shop preview toggle
    _ui.previewBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setPreview(btn.getAttribute('data-le-preview'));
      });
    });

    // Selected element scale slider
    _ui.itemScaleInput.addEventListener('input', function () {
      var rec = _selectedId ? _items.get(_selectedId) : null;
      if (!rec || !rec.scalable) return;
      var val = round2(clamp(parseFloat(_ui.itemScaleInput.value) / 100, rec.minScale, rec.maxScale));
      rec.scale = val;
      applyItem(rec, true);
      syncOverlay();
      updateToolbarUI();
      notifyChange();
    });
    _ui.itemScaleInput.addEventListener('change', function () {
      saveStorage();
    });

    // Global scale slider
    _ui.globalScaleInput.addEventListener('input', function () {
      var val = round2(clamp(parseFloat(_ui.globalScaleInput.value) / 100, GLOBAL_SCALE_MIN, GLOBAL_SCALE_MAX));
      _saved.globalScale = val;
      _saved.preset = matchPresetForScale(val);
      applyAll(true);
      updateToolbarUI();
      notifyChange();
    });
    _ui.globalScaleInput.addEventListener('change', function () {
      saveStorage();
    });

    // Preset chips
    _ui.presetBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyPreset(btn.getAttribute('data-le-preset'));
      });
    });

    // Reset single / Reset all / Done
    _ui.resetItemBtn.addEventListener('click', function () {
      if (_selectedId) resetItem(_selectedId);
    });
    _ui.resetAllBtn.addEventListener('click', function () {
      resetAll();
    });
    _ui.doneBtn.addEventListener('click', function () {
      exit();
    });

    // Flip top / bottom dock
    _ui.flipBtn.addEventListener('click', function () {
      _toolbarUserMoved = false;
      setToolbarDock(_toolbarDock === 'top' ? 'bottom' : 'top');
    });

    // Draggable toolbar via grip
    attachToolbarDrag(_ui.grip, bar);

    document.body.appendChild(bar);
    _toolbarEl = bar;
    return bar;
  }

  function setToolbarDock(pos) {
    if (!_toolbarEl) return;
    _toolbarDock = pos;
    _toolbarEl.classList.remove('le-dock-top', 'le-dock-bottom', 'le-floating');
    _toolbarEl.style.left = '';
    _toolbarEl.style.top = '';
    if (pos === 'top') {
      _toolbarEl.classList.add('le-dock-top');
    } else {
      _toolbarEl.classList.add('le-dock-bottom');
    }
  }

  function autoDodgeToolbarForItem(rec) {
    if (!_toolbarEl || _toolbarUserMoved || !rec) return;
    var el = getItemEl(rec);
    if (!el) return;
    var r = el.getBoundingClientRect();
    if (r.height < 2) return;
    var vh = global.innerHeight || 1;
    // Only dodge if element is smaller than 65% of viewport height (don't flip wildly for full shop-panel)
    if (r.height > vh * 0.65) return;
    var centerY = r.top + r.height / 2;
    if (centerY > vh * 0.64 && _toolbarDock !== 'top') {
      setToolbarDock('top');
    } else if (centerY < vh * 0.36 && _toolbarDock !== 'bottom') {
      setToolbarDock('bottom');
    }
  }

  function attachToolbarDrag(grip, bar) {
    grip.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var pointerId = e.pointerId;
      var rect = bar.getBoundingClientRect();
      var startX = e.clientX;
      var startY = e.clientY;
      var startLeft = rect.left;
      var startTop = rect.top;

      if (grip.setPointerCapture) {
        try { grip.setPointerCapture(pointerId); } catch (_) {}
      }

      bar.classList.remove('le-dock-top', 'le-dock-bottom');
      bar.classList.add('le-floating');
      bar.style.left = round2(startLeft) + 'px';
      bar.style.top = round2(startTop) + 'px';
      _toolbarDock = 'floating';
      _toolbarUserMoved = true;

      function onMove(ev) {
        if (ev.pointerId !== pointerId) return;
        ev.preventDefault();
        var vw = global.innerWidth || 1;
        var vh = global.innerHeight || 1;
        var nextL = clamp(startLeft + (ev.clientX - startX), 6, Math.max(6, vw - rect.width - 6));
        var nextT = clamp(startTop + (ev.clientY - startY), 6, Math.max(6, vh - rect.height - 6));
        bar.style.left = round2(nextL) + 'px';
        bar.style.top = round2(nextT) + 'px';
      }

      function onUp(ev) {
        if (ev.pointerId !== pointerId) return;
        grip.removeEventListener('pointermove', onMove);
        grip.removeEventListener('pointerup', onUp);
        grip.removeEventListener('pointercancel', onUp);
        if (grip.releasePointerCapture) {
          try { grip.releasePointerCapture(pointerId); } catch (_) {}
        }
      }

      grip.addEventListener('pointermove', onMove);
      grip.addEventListener('pointerup', onUp);
      grip.addEventListener('pointercancel', onUp);
    });
  }

  function updateToolbarUI() {
    if (!_toolbarEl) return;

    // Preview segmented state
    _ui.previewBtns.forEach(function (btn) {
      var mode = btn.getAttribute('data-le-preview');
      btn.classList.toggle('active', mode === _previewMode);
    });

    // Global scale slider & presets
    var gsPct = Math.round(_saved.globalScale * 100);
    _ui.globalScaleInput.value = String(gsPct);
    _ui.globalScaleVal.textContent = gsPct + '%';

    var activePreset = matchPresetForScale(_saved.globalScale);
    _ui.presetBtns.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-le-preset') === activePreset);
    });

    // Selected item state
    var rec = _selectedId ? _items.get(_selectedId) : null;
    if (rec && isInActiveScope(rec)) {
      _ui.selPill.classList.remove('le-none');
      _ui.selName.textContent = rec.label;
      _ui.resetItemBtn.disabled = false;

      if (rec.scalable) {
        _ui.itemScaleGroup.classList.remove('le-disabled');
        _ui.itemScaleInput.disabled = false;
        _ui.itemScaleInput.min = String(Math.round(rec.minScale * 100));
        _ui.itemScaleInput.max = String(Math.round(rec.maxScale * 100));
        var sPct = Math.round(rec.scale * 100);
        _ui.itemScaleInput.value = String(sPct);
        _ui.itemScaleVal.textContent = sPct + '%';
      } else {
        _ui.itemScaleGroup.classList.add('le-disabled');
        _ui.itemScaleInput.disabled = true;
        _ui.itemScaleVal.textContent = 'Locked';
      }
    } else {
      _ui.selPill.classList.add('le-none');
      _ui.selName.textContent = 'Tap element';
      _ui.resetItemBtn.disabled = true;
      _ui.itemScaleGroup.classList.add('le-disabled');
      _ui.itemScaleInput.disabled = true;
      _ui.itemScaleInput.value = '100';
      _ui.itemScaleVal.textContent = '—';
    }
  }

  function selectItem(id) {
    if (!id || !_items.has(id)) {
      _selectedId = null;
    } else {
      _selectedId = id;
      autoDodgeToolbarForItem(_items.get(id));
    }
    syncOverlay();
    updateToolbarUI();
  }

  function pickFirstVisibleInScope() {
    for (var i = 0; i < _itemOrder.length; i++) {
      var id = _itemOrder[i];
      var rec = _items.get(id);
      if (rec && isInActiveScope(rec)) {
        var el = getItemEl(rec);
        if (el) return id;
      }
    }
    return null;
  }

  /* ---------------------------------------------------------------------
   * Capture Guards (Block Trainer Taps & Handle Escape / Arrow Nudge)
   * --------------------------------------------------------------------- */
  function isEditorUIEvent(e) {
    var t = e.target;
    if (!t || !t.closest) return false;
    return !!(t.closest('[data-le-ui="toolbar"]') || t.closest('[data-le-ui="overlay"]'));
  }

  function onCaptureStageEvent(e) {
    if (!_editing) return;
    if (isEditorUIEvent(e)) return;
    // Block any underlying trainer/shop interaction inside containerEl while editing
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
  }

  function onKeyDown(e) {
    if (!_editing) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      exit();
      return;
    }

    // Keyboard fine nudging for desktop users
    var rec = _selectedId ? _items.get(_selectedId) : null;
    if (!rec || !rec.movable) return;
    var step = e.shiftKey ? 0.25 : 1.0;
    var dx = 0;
    var dy = 0;
    if (e.key === 'ArrowLeft') dx = -step;
    else if (e.key === 'ArrowRight') dx = step;
    else if (e.key === 'ArrowUp') dy = -step;
    else if (e.key === 'ArrowDown') dy = step;
    else return;

    e.preventDefault();
    rec.x = round2(rec.x + dx);
    rec.y = round2(rec.y + dy);
    applyItem(rec, true);
    syncOverlay();
    saveStorage();
    notifyChange();
  }

  function onWindowResize() {
    applyAll(false);
    if (_editing) {
      scheduleOverlaySync();
      // Keep floating toolbar inside viewport after orientation change
      if (_toolbarEl && _toolbarDock === 'floating') {
        var r = _toolbarEl.getBoundingClientRect();
        var vw = global.innerWidth || 1;
        var vh = global.innerHeight || 1;
        if (r.right > vw - 6 || r.bottom > vh - 6) {
          _toolbarUserMoved = false;
          setToolbarDock('bottom');
        }
      }
    }
  }

  function bindGlobalListeners() {
    if (_boundListeners) return;
    _boundListeners = true;
    global.addEventListener('resize', onWindowResize);
    global.addEventListener('orientationchange', onWindowResize);
    document.addEventListener('keydown', onKeyDown, true);
  }

  function bindContainerGuards(enable) {
    if (!_containerEl) return;
    var evs = ['click', 'mousedown', 'pointerdown', 'touchstart'];
    evs.forEach(function (evName) {
      if (enable) {
        _containerEl.addEventListener(evName, onCaptureStageEvent, true);
      } else {
        _containerEl.removeEventListener(evName, onCaptureStageEvent, true);
      }
    });
  }

  function observeContainer() {
    if (_resizeObserver) {
      _resizeObserver.disconnect();
      _resizeObserver = null;
    }
    if (_containerEl && typeof global.ResizeObserver === 'function') {
      _resizeObserver = new global.ResizeObserver(function () {
        applyAll(false);
        if (_editing) scheduleOverlaySync();
      });
      _resizeObserver.observe(_containerEl);
    }
  }

  /* ---------------------------------------------------------------------
   * Public API Methods
   * --------------------------------------------------------------------- */
  function init(options) {
    options = options || {};
    if (_editing) exit();

    _containerEl = resolveEl(options.containerEl) ||
                   document.getElementById('screen-wrapper') ||
                   document.body;
    _storageKey = typeof options.storageKey === 'string' && options.storageKey
      ? options.storageKey
      : STORAGE_KEY;
    _onShopPreview = typeof options.onShopPreview === 'function' ? options.onShopPreview : null;
    _onChange = typeof options.onChange === 'function' ? options.onChange : null;
    _onEditChange = typeof options.onEditChange === 'function' ? options.onEditChange : null;
    _previewMode = options.initialPreview === 'shop' ? 'shop' : 'hud';

    _items.clear();
    _itemOrder = [];
    _saved = loadStorage();

    if (Array.isArray(options.items)) {
      options.items.forEach(function (cfg) {
        register(cfg, true);
      });
    }

    bindGlobalListeners();
    observeContainer();
    applyAll(false);
    notifyChange();
    return LayoutEditor;
  }

  function register(cfg, silent) {
    var rec = normalizeItem(cfg);
    if (!_items.has(rec.id)) {
      _itemOrder.push(rec.id);
    }
    _items.set(rec.id, rec);
    applyItem(rec, false);
    if (_editing) {
      revealHiddenScopeItems();
      rebuildHandles();
      updateToolbarUI();
    }
    if (!silent) notifyChange();
    return rec.id;
  }

  function unregister(id) {
    if (!_items.has(id)) return false;
    _items.delete(id);
    _itemOrder = _itemOrder.filter(function (k) { return k !== id; });
    if (_selectedId === id) _selectedId = null;
    if (_editing) {
      rebuildHandles();
      updateToolbarUI();
    }
    return true;
  }

  function setPreview(mode) {
    var next = mode === 'shop' ? 'shop' : 'hud';
    _previewMode = next;
    if (_onShopPreview) {
      try { _onShopPreview(next === 'shop'); } catch (_) {}
    }
    if (_editing) {
      // Wait a micro-tick / frame for shop DOM visibility toggle before measuring rects
      revealHiddenScopeItems();
      applyAll(false);
      var currentRec = _selectedId ? _items.get(_selectedId) : null;
      if (!currentRec || !isInActiveScope(currentRec)) {
        _selectedId = pickFirstVisibleInScope();
      }
      rebuildHandles();
      updateToolbarUI();
      scheduleOverlaySync();
      // Second sync after layout/transition settles
      global.setTimeout(function () {
        if (_editing) {
          revealHiddenScopeItems();
          syncOverlay();
          autoDodgeToolbarForItem(_selectedId ? _items.get(_selectedId) : null);
        }
      }, 60);
    }
  }

  function enter(initialPreview) {
    if (!_containerEl) {
      _containerEl = document.getElementById('screen-wrapper') || document.body;
    }
    if (_editing) {
      if (initialPreview === 'hud' || initialPreview === 'shop') {
        setPreview(initialPreview);
      }
      return;
    }

    _editing = true;
    _toolbarUserMoved = false;
    if (initialPreview === 'hud' || initialPreview === 'shop') {
      _previewMode = initialPreview;
    }

    document.body.classList.add('le-editing');
    if (_containerEl) _containerEl.classList.add('le-container-editing');
    bindContainerGuards(true);

    if (_onEditChange) {
      try { _onEditChange(true); } catch (_) {}
    }
    if (_onShopPreview) {
      try { _onShopPreview(_previewMode === 'shop'); } catch (_) {}
    }

    revealHiddenScopeItems();
    applyAll(false);
    buildToolbar();
    setToolbarDock('bottom');

    _selectedId = pickFirstVisibleInScope();
    rebuildHandles();
    updateToolbarUI();
    scheduleOverlaySync();

    global.setTimeout(function () {
      if (_editing) {
        revealHiddenScopeItems();
        syncOverlay();
        autoDodgeToolbarForItem(_selectedId ? _items.get(_selectedId) : null);
      }
    }, 60);
  }

  function exit() {
    if (!_editing) return;
    _editing = false;

    saveStorage();
    restoreForcedVisible();
    bindContainerGuards(false);

    document.body.classList.remove('le-editing');
    if (_containerEl) _containerEl.classList.remove('le-container-editing');

    if (_overlayEl && _overlayEl.parentNode) {
      _overlayEl.parentNode.removeChild(_overlayEl);
    }
    _overlayEl = null;
    _handles.clear();

    if (_toolbarEl && _toolbarEl.parentNode) {
      _toolbarEl.parentNode.removeChild(_toolbarEl);
    }
    _toolbarEl = null;
    _ui = {};

    // Return to HUD view cleanly unless consumer overrides in onEditChange
    if (_onShopPreview) {
      try { _onShopPreview(false); } catch (_) {}
    }
    if (_onEditChange) {
      try { _onEditChange(false); } catch (_) {}
    }
    notifyChange();
  }

  function toggle() {
    if (_editing) exit();
    else enter();
  }

  function isEditing() {
    return _editing;
  }

  function getPreview() {
    return _previewMode;
  }

  function setGlobalScale(scale) {
    var next = round2(clamp(Number(scale), GLOBAL_SCALE_MIN, GLOBAL_SCALE_MAX));
    _saved.globalScale = next;
    _saved.preset = matchPresetForScale(next);
    applyAll(true);
    saveStorage();
    if (_editing) {
      updateToolbarUI();
      scheduleOverlaySync();
    }
    notifyChange();
    return next;
  }

  function getGlobalScale() {
    return _saved.globalScale;
  }

  function applyPreset(presetKey) {
    var scaleVal;
    if (typeof presetKey === 'number' && isFinite(presetKey)) {
      scaleVal = presetKey;
    } else if (PRESETS[presetKey]) {
      scaleVal = PRESETS[presetKey].globalScale;
    } else {
      scaleVal = 1.0;
    }
    return setGlobalScale(scaleVal);
  }

  function setItemLayout(id, patch) {
    var rec = _items.get(id);
    if (!rec || !patch || typeof patch !== 'object') return null;
    if (rec.movable && typeof patch.x === 'number' && isFinite(patch.x)) {
      rec.x = round2(patch.x);
    }
    if (rec.movable && typeof patch.y === 'number' && isFinite(patch.y)) {
      rec.y = round2(patch.y);
    }
    if (rec.scalable && typeof patch.scale === 'number' && isFinite(patch.scale)) {
      rec.scale = round2(clamp(patch.scale, rec.minScale, rec.maxScale));
    }
    applyItem(rec, true);
    saveStorage();
    if (_editing) {
      updateToolbarUI();
      scheduleOverlaySync();
    }
    notifyChange();
    return getItemLayout(id);
  }

  function getItemLayout(id) {
    var rec = _items.get(id);
    if (!rec) return null;
    return {
      x: rec.x,
      y: rec.y,
      scale: rec.scale,
      effectiveScale: getEffectiveScale(rec)
    };
  }

  function resetItem(id) {
    var rec = _items.get(id);
    if (!rec) return false;
    rec.x = rec.defaultX;
    rec.y = rec.defaultY;
    rec.scale = rec.defaultScale;
    applyItem(rec, false);
    saveStorage();
    if (_editing) {
      updateToolbarUI();
      scheduleOverlaySync();
    }
    notifyChange();
    return true;
  }

  function resetAll() {
    _saved.globalScale = 1.0;
    _saved.preset = 'default';
    _saved.items = {};
    _itemOrder.forEach(function (id) {
      var rec = _items.get(id);
      if (!rec) return;
      rec.x = rec.defaultX;
      rec.y = rec.defaultY;
      rec.scale = rec.defaultScale;
    });
    applyAll(false);
    saveStorage();
    if (_editing) {
      updateToolbarUI();
      scheduleOverlaySync();
    }
    notifyChange();
  }

  function refreshOverlay() {
    if (_editing) {
      syncOverlay();
    }
  }

  /* ---------------------------------------------------------------------
   * Export window.LayoutEditor
   * --------------------------------------------------------------------- */
  var LayoutEditor = {
    init: init,
    register: register,
    unregister: unregister,
    enter: enter,
    exit: exit,
    toggle: toggle,
    isEditing: isEditing,
    setPreview: setPreview,
    getPreview: getPreview,
    setGlobalScale: setGlobalScale,
    getGlobalScale: getGlobalScale,
    applyPreset: applyPreset,
    setItemLayout: setItemLayout,
    getItemLayout: getItemLayout,
    getState: getStateSnapshot,
    resetItem: resetItem,
    resetAll: resetAll,
    applyAll: function () { applyAll(false); },
    refreshOverlay: refreshOverlay,
    STORAGE_KEY: STORAGE_KEY,
    PRESETS: PRESETS
  };

  global.LayoutEditor = LayoutEditor;
})(window);

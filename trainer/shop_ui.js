/* ============================================================
 * MLBB Fast-Hand Swap Trainer — Real Shop GUI, HUD & Drill Engine
 * ============================================================ */
(function () {
  'use strict';

  /* ---------- Fallback Catalog (replaced by window.MLBB_ITEMS from items_data.js) ---------- */
  const FALLBACK_TABS = ['Recommended', 'Attack', 'Magic', 'Defense', 'Movement'];
  const FALLBACK_LOADOUT = [
    'arcane_boots',
    'corrosion_scythe',
    'demon_hunter_sword',
    'golden_staff',
    'malefic_gun',
    'rose_gold_meteor'
  ];

  function getTabs() {
    return Array.isArray(window.MLBB_TABS) && window.MLBB_TABS.length
      ? window.MLBB_TABS
      : FALLBACK_TABS;
  }

  function getItemsMap() {
    return window.MLBB_ITEMS || {};
  }

  function getTabOrder(tab) {
    const map = window.MLBB_TAB_ORDER || {};
    if (Array.isArray(map[tab])) return map[tab];
    const items = getItemsMap();
    return Object.keys(items).filter((id) => {
      const it = items[id];
      if (!it) return false;
      if (Array.isArray(it.tabs)) return it.tabs.includes(tab);
      return it.tab === tab;
    });
  }

  function getItem(id) {
    if (!id) return null;
    return getItemsMap()[id] || null;
  }

  function resolveIcon(icon) {
    if (!icon) return '';
    if (icon.startsWith('trainer_assets/') || icon.startsWith('http') || icon.startsWith('data:')) {
      return icon;
    }
    if (icon.startsWith('items/')) return 'trainer_assets/' + icon;
    return 'trainer_assets/items/' + icon;
  }

  function getSellPrice(item) {
    if (!item) return 0;
    if (typeof item.sellPrice === 'number' && !Number.isNaN(item.sellPrice)) return item.sellPrice;
    return Math.round((item.price || 0) * 0.6);
  }

  function formatGold(n) {
    return String(Math.max(0, Math.round(n)));
  }

  function isLayoutEditing() {
    return !!(window.LayoutEditor && typeof window.LayoutEditor.isEditing === 'function' && window.LayoutEditor.isEditing());
  }

  /* ---------- 20-Step Triple Swap & 12-Step Double Swap Definitions ---------- */
  const ALL_DRILL_STEPS = [
    {
      step: 1,
      action: 'open-shop',
      targetSel: '#hud-shop',
      title: 'Click Buy Shop',
      tooltip: '1. BUY SHOP',
      hint: 'Tap the Shop / Gold button top right ($29,764) to open the shop!',
      sound: 'click'
    },
    {
      step: 2,
      action: 'sell-slot',
      slotIdx: 0,
      itemId: 'arcane_boots',
      targetSel: '#shop-action-btn',
      title: 'Sell Boots',
      tooltip: '2. SELL BOOTS',
      hint: "Arcane Boots is selected. Tap the pink 'Sell' button bottom right!",
      sound: 'coin'
    },
    {
      step: 3,
      action: 'close-shop',
      exitShop: true,
      targetSel: '#shop-close-btn',
      title: 'Exit Shop (X)',
      tooltip: '3. EXIT (X)',
      hint: "Boots sold! Tap the white 'X' button or anywhere outside the shop.",
      sound: 'click'
    },
    {
      step: 4,
      action: 'quick-buy',
      itemId: 'immortality',
      targetSel: '#hud-quickbuy',
      title: 'Buy Immortality',
      tooltip: '4. BUY IMMO',
      hint: 'Tap the Quick-Buy Immortality card top right on the HUD!',
      sound: 'coin'
    },
    {
      step: 5,
      action: 'open-shop',
      targetSel: '#hud-shop',
      title: 'Click Buy Shop Again',
      tooltip: '5. OPEN SHOP',
      hint: 'Immortality is equipped! Tap the Shop / Gold button top right again.',
      sound: 'click'
    },
    {
      step: 6,
      action: 'select-slot',
      slotIdx: 0,
      itemId: 'immortality',
      targetSel: '#inv-slot-0',
      title: 'Select Immortality (Slot 1)',
      tooltip: '6. TAP IMMO',
      hint: 'Tap Immortality in inventory Slot 1 (bottom left) to select it!',
      sound: 'click'
    },
    {
      step: 7,
      action: 'sell-slot',
      slotIdx: 0,
      itemId: 'immortality',
      targetSel: '#shop-action-btn',
      title: 'Sell Immortality',
      tooltip: '7. SELL IMMO',
      hint: "Immortality is selected. Tap the pink 'Sell' button bottom right!",
      sound: 'coin'
    },
    {
      step: 8,
      action: 'switch-tab',
      tab: 'Magic',
      targetSel: '.shop-tab-btn[data-tab="Magic"]',
      title: 'Go to Magic Tab',
      tooltip: '8. MAGIC TAB',
      hint: "Tap the 'Magic' category tab on the left navigation column!",
      sound: 'click'
    },
    {
      step: 9,
      action: 'select-item',
      itemId: 'winter_crown',
      targetSel: '.shop-item-card[data-item-id="winter_crown"]',
      title: 'Click Winter Crown',
      tooltip: '9. WINTER CROWN',
      hint: 'Tap Winter Crown in the Magic grid!',
      sound: 'click'
    },
    {
      step: 10,
      action: 'buy-item',
      itemId: 'winter_crown',
      targetSel: '#shop-action-btn',
      title: 'Buy Winter Crown',
      tooltip: '10. BUY WINTER',
      hint: "Tap the gold 'Purchase' button at the bottom right!",
      sound: 'coin'
    },
    {
      step: 11,
      action: 'close-shop',
      exitShop: true,
      targetSel: '#shop-close-btn',
      title: 'Exit Shop (X)',
      tooltip: '11. EXIT (X)',
      hint: "Winter Crown bought! Tap the white 'X' button or anywhere outside the shop.",
      sound: 'click'
    },
    {
      step: 12,
      action: 'activate-frozen',
      targetSel: '#hud-frozen',
      title: 'Activate Frozen',
      tooltip: '12. FROZEN!',
      hint: "Activate Winter Crown! Tap the blue 'Frozen' skill button on the HUD!",
      sound: 'freeze'
    },
    {
      step: 13,
      action: 'open-shop',
      targetSel: '#hud-shop',
      title: 'Open Shop (While Frozen)',
      tooltip: '13. OPEN SHOP',
      hint: 'Quickly tap the Shop button top right while Frozen is active!',
      sound: 'click'
    },
    {
      step: 14,
      action: 'select-slot',
      slotIdx: 0,
      itemId: 'winter_crown',
      targetSel: '#inv-slot-0',
      title: 'Select Winter Crown (Slot 1)',
      tooltip: '14. TAP WINTER',
      hint: 'Tap Winter Crown in inventory Slot 1 (bottom left) to select it!',
      sound: 'click'
    },
    {
      step: 15,
      action: 'sell-slot',
      slotIdx: 0,
      itemId: 'winter_crown',
      targetSel: '#shop-action-btn',
      title: 'Sell Winter Crown',
      tooltip: '15. SELL WINTER',
      hint: "Tap the pink 'Sell' button bottom right to sell Winter Crown!",
      sound: 'coin'
    },
    {
      step: 16,
      action: 'switch-tab',
      tab: 'Attack',
      targetSel: '.shop-tab-btn[data-tab="Attack"]',
      title: 'Go to Attack Tab',
      tooltip: '16. ATTACK TAB',
      hint: "Tap the 'Attack' category tab on the left navigation column!",
      sound: 'click'
    },
    {
      step: 17,
      action: 'scroll-to-item',
      type: 'scroll',
      itemId: 'rose_gold_meteor',
      targetSel: '#shop-grid',
      title: 'Scroll to Rose Gold',
      tooltip: '17. SWIPE UP',
      hint: 'Swipe UP on the Attack item list (or scroll down) to reveal Rose Gold Meteor!',
      sound: 'scroll'
    },
    {
      step: 18,
      action: 'select-item',
      itemId: 'rose_gold_meteor',
      targetSel: '.shop-item-card[data-item-id="rose_gold_meteor"]',
      title: 'Click Rose Gold Meteor',
      tooltip: '18. ROSE GOLD',
      hint: 'Tap Rose Gold Meteor in the Attack grid!',
      sound: 'click'
    },
    {
      step: 19,
      action: 'buy-item',
      itemId: 'rose_gold_meteor',
      targetSel: '#shop-action-btn',
      title: 'Buy Rose Gold Meteor',
      tooltip: '19. BUY ROSE GOLD',
      hint: "Tap the gold 'Purchase' button at the bottom right!",
      sound: 'coin'
    },
    {
      step: 20,
      action: 'close-shop',
      exitShop: true,
      targetSel: '#shop-close-btn',
      title: 'Exit Shop (X)',
      tooltip: '20. EXIT (X)',
      hint: "Rose Gold Meteor equipped! Tap the white 'X' button or anywhere outside the shop to finish!",
      sound: 'click'
    }
  ];

  /* ---------- Runtime State ---------- */
  const state = {
    drill: 'triple',         // 'triple' | 'double' | 'sandbox'
    mode: 'practice',        // 'practice' | 'ranked'
    hitboxMode: 'realistic', // 'realistic' | 'strict'
    hintsVisible: true,

    // Drill timer & progress
    currentStepIdx: 0,
    isRunning: false,
    drillCompleted: false,
    startTime: 0,
    stepStartTime: 0,
    lastTapTime: 0,
    splits: [],
    misclicks: 0,
    timerInterval: null,

    // Live MLBB Shop & HUD State
    gold: 29764,
    inventory: [],
    shopOpen: false,
    activeTab: 'Defense',
    renderedGridTab: null,
    selectedSlotIdx: null,
    selectedShopItemId: null,
    prioritizedItemId: 'immortality',
    frozenActive: false,
    frozenCd: 0,
    frozenFxTimer: null,
    sandboxCdTimer: null,

    // Layout editor saved shopOpen before preview
    savedShopBeforeEdit: null
  };

  /* ---------- DOM References ---------- */
  let els = {};

  function cacheDom() {
    els = {
      stage: document.getElementById('game-stage'),
      hudLayer: document.getElementById('hud-layer'),
      hudShop: document.getElementById('hud-shop'),
      hudGoldText: document.getElementById('hud-gold-text'),
      hudQuickBuy: document.getElementById('hud-quickbuy'),
      hudQbName: document.getElementById('hud-qb-name'),
      hudQbStats: document.getElementById('hud-qb-stats'),
      hudQbDesc: document.getElementById('hud-qb-desc'),
      hudQbImg: document.getElementById('hud-qb-img'),
      hudQbPrice: document.getElementById('hud-qb-price'),
      hudFrozen: document.getElementById('hud-frozen'),
      hudFrozenImg: document.getElementById('hud-frozen-img'),
      hudFrozenCd: document.getElementById('hud-frozen-cd'),
      hudFrozenLabel: document.getElementById('hud-frozen-label'),

      shopBackdrop: document.getElementById('shop-backdrop'),
      shopPanel: document.getElementById('shop-panel'),
      shopGoldText: document.getElementById('shop-gold-text'),
      shopCloseBtn: document.getElementById('shop-close-btn'),
      shopTabs: document.getElementById('shop-tabs'),
      shopGrid: document.getElementById('shop-grid'),
      shopPrioritizeBtn: document.getElementById('shop-prioritize-btn'),
      shopBuildTree: document.getElementById('shop-build-tree'),
      detailName: document.getElementById('detail-name'),
      detailStats: document.getElementById('detail-stats'),
      detailPassive: document.getElementById('detail-passive'),
      shopSellAllBtn: document.getElementById('shop-sell-all-btn'),
      shopActionWrap: document.getElementById('shop-action-wrap'),
      shopActionPrice: document.getElementById('shop-action-price'),
      shopActionNote: document.getElementById('shop-action-note'),
      shopActionBtn: document.getElementById('shop-action-btn'),
      shopInventoryBar: document.getElementById('shop-inventory-bar'),
      shopSlots: document.getElementById('shop-slots'),

      guideIndicator: document.getElementById('guide-indicator'),
      guideTip: document.getElementById('guide-tip'),
      statusHint: document.getElementById('status-hint'),
      hudTimer: document.getElementById('hud-timer'),
      stepNumberPill: document.getElementById('step-number-pill'),
      stepDescText: document.getElementById('step-desc-text'),
      miniHud: document.getElementById('mini-hud'),
      menuDrawer: document.getElementById('menu-drawer'),
      victoryModal: document.getElementById('victory-modal')
    };
  }

  /* ---------- Audio Helpers (wired to trainer.html Web Audio engine) ---------- */
  function callAudio(fnName) {
    if (typeof window[fnName] === 'function') {
      window[fnName]();
    }
  }

  function playStepSound(snd) {
    if (snd === 'coin') callAudio('playCoinSound');
    else if (snd === 'freeze') callAudio('playFreezeSound');
    else if (snd === 'scroll') callAudio('playScrollSound');
    else callAudio('playClickSound');
  }

  /* ---------- Active Drill Helpers ---------- */
  function getActiveSteps() {
    if (state.drill === 'sandbox') return [];
    return state.drill === 'double' ? ALL_DRILL_STEPS.slice(0, 12) : ALL_DRILL_STEPS;
  }

  function getCurrentStep() {
    const steps = getActiveSteps();
    return steps[state.currentStepIdx] || null;
  }

  function firstEmptySlot() {
    return state.inventory.findIndex((id) => !id);
  }

  function hasActiveEquipped() {
    return state.inventory.some((id) => {
      const it = getItem(id);
      return !!(it && it.isActive);
    });
  }

  function hasWinterCrown() {
    return state.inventory.includes('winter_crown');
  }

  function getEquippedActiveItem() {
    for (let i = 0; i < state.inventory.length; i++) {
      const it = getItem(state.inventory[i]);
      if (it && it.isActive) return it;
    }
    return null;
  }

  /* ---------- Timer ---------- */
  function startTimer() {
    if (state.isRunning || state.drill === 'sandbox') return;
    state.isRunning = true;
    state.startTime = performance.now();
    state.stepStartTime = state.startTime;
    els.hudTimer.classList.add('running');
    els.miniHud.classList.add('dimmed');
    if (typeof window.closeMenu === 'function') window.closeMenu();
    els.statusHint.style.display = 'none';
    state.timerInterval = setInterval(() => {
      const elapsed = (performance.now() - state.startTime) / 1000;
      els.hudTimer.innerText = elapsed.toFixed(3) + 's';
    }, 25);
  }

  function stopTimer() {
    state.isRunning = false;
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    els.hudTimer.classList.remove('running');
    els.miniHud.classList.remove('dimmed');
    const totalElapsed = state.startTime ? (performance.now() - state.startTime) / 1000 : 0;
    els.hudTimer.innerText = totalElapsed.toFixed(3) + 's';
    return totalElapsed;
  }

  /* ---------- Visual Feedback ---------- */
  function createRipple(e) {
    if (!e || !els.stage) return;
    const rect = els.stage.getBoundingClientRect();
    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
    if (typeof clientX !== 'number' || typeof clientY !== 'number') return;
    const rip = document.createElement('div');
    rip.className = 'tap-ripple';
    rip.style.left = (clientX - rect.left) + 'px';
    rip.style.top = (clientY - rect.top) + 'px';
    els.stage.appendChild(rip);
    setTimeout(() => rip.remove(), 380);
  }

  function registerMisclick() {
    if (state.drill === 'sandbox' || state.drillCompleted || isLayoutEditing()) return;
    callAudio('initAudio');
    state.misclicks++;
    callAudio('playErrorBuzz');
    const flash = document.createElement('div');
    flash.className = 'miss-flash';
    els.stage.appendChild(flash);
    setTimeout(() => flash.remove(), 250);
  }

  function setSandboxToast(msg) {
    if (state.drill !== 'sandbox') return;
    els.statusHint.innerText = msg;
    els.statusHint.style.display = state.hintsVisible ? 'flex' : 'none';
  }

  /* ---------- Rendering ---------- */
  function getQuickBuyItem() {
    if (state.prioritizedItemId) {
      const prio = getItem(state.prioritizedItemId);
      if (prio) return prio;
    }
    // When no item is prioritized: if 6 slots are full, fall back to Power Potion (like MLBB seq=255)
    if (firstEmptySlot() === -1) {
      return getItem('power_potion') || null;
    }
    const recIds = getTabOrder('Recommended');
    const owned = new Set(state.inventory.filter(Boolean));
    const hasAct = hasActiveEquipped();
    for (let i = 0; i < recIds.length; i++) {
      const cand = getItem(recIds[i]);
      if (!cand) continue;
      if (owned.has(cand.id)) continue;
      if (cand.isActive && hasAct) continue;
      return cand;
    }
    return getItem('power_potion') || null;
  }

  function renderHud() {
    const goldStr = formatGold(state.gold);
    els.hudGoldText.textContent = goldStr;
    els.shopGoldText.textContent = '$ ' + goldStr;

    // Quick-Buy card
    const qbItem = getQuickBuyItem();
    if (qbItem) {
      els.hudQuickBuy.style.display = '';
      els.hudQbName.textContent = qbItem.name;
      els.hudQbStats.textContent = Array.isArray(qbItem.stats) ? qbItem.stats.slice(0, 2).join('  ') : '';
      els.hudQbDesc.textContent = qbItem.shortDesc || '';
      els.hudQbImg.src = resolveIcon(qbItem.icon);
      els.hudQbImg.alt = qbItem.name;
      els.hudQbPrice.textContent = qbItem.price;

      const isConsumable = qbItem.id === 'power_potion';
      const canBuy = isConsumable
        ? state.gold >= qbItem.price
        : (firstEmptySlot() !== -1 && state.gold >= qbItem.price && !(qbItem.isActive && hasActiveEquipped()));
      els.hudQuickBuy.classList.toggle('qb-ready', canBuy);
      els.hudQuickBuy.classList.toggle('qb-dimmed', !canBuy);
    } else {
      els.hudQuickBuy.style.display = 'none';
    }

    // Active Skill (Frozen / Wind Chant) button
    const activeItem = getEquippedActiveItem();
    const showFrozen = !!activeItem;
    els.hudFrozen.classList.toggle('hud-hidden', !showFrozen);
    els.hudFrozen.classList.toggle('on-cd', state.frozenCd > 0);
    els.hudFrozenCd.textContent = state.frozenCd > 0 ? String(state.frozenCd) : '';
    const activeIcon = (activeItem && activeItem.activeIcon) || 'trainer_assets/items/skill_frozen.png';
    els.hudFrozenImg.src = resolveIcon(activeIcon);
    if (els.hudFrozenLabel) {
      els.hudFrozenLabel.textContent = (activeItem && activeItem.activeName) || 'Frozen';
    }

    // Stage frozen frost effect
    els.stage.classList.toggle('is-frozen', state.frozenActive);
  }

  function renderShopModalVisibility() {
    els.shopBackdrop.classList.toggle('open', state.shopOpen);
    els.stage.classList.toggle('shop-open', state.shopOpen);
  }

  function renderTabs() {
    const tabs = getTabs();
    els.shopTabs.innerHTML = '';
    tabs.forEach((tab) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'shop-tab-btn' + (state.activeTab === tab ? ' active' : '');
      btn.dataset.tab = tab;
      btn.textContent = tab;
      els.shopTabs.appendChild(btn);
    });
    // Native MLBB muted category rows (Jungling / Roaming)
    const jungling = document.createElement('div');
    jungling.className = 'shop-tab-disabled is-jungling';
    jungling.textContent = 'Jungling';
    const roaming = document.createElement('div');
    roaming.className = 'shop-tab-disabled is-roaming';
    roaming.textContent = 'Roaming';
    els.shopTabs.appendChild(jungling);
    els.shopTabs.appendChild(roaming);
  }

  function renderShopGrid(resetScroll) {
    const ownedSet = new Set(state.inventory.filter(Boolean));

    // In-place update when staying on the same tab so scrollTop NEVER jumps!
    if (!resetScroll && state.renderedGridTab === state.activeTab && els.shopGrid.children.length > 0) {
      const cards = els.shopGrid.querySelectorAll('.shop-item-card');
      cards.forEach((card) => {
        const id = card.dataset.itemId;
        card.classList.toggle('selected', state.selectedShopItemId === id);

        const iconWrap = card.querySelector('.item-icon-wrap');
        if (!iconWrap) return;

        const isOwned = ownedSet.has(id);
        let ownedEl = iconWrap.querySelector('.item-owned-badge');
        if (isOwned && !ownedEl) {
          ownedEl = document.createElement('span');
          ownedEl.className = 'item-owned-badge';
          ownedEl.textContent = '✓';
          iconWrap.appendChild(ownedEl);
        } else if (!isOwned && ownedEl) {
          ownedEl.remove();
        }

        const isPrio = state.prioritizedItemId === id;
        let prioEl = iconWrap.querySelector('.item-prio-badge');
        if (isPrio && !prioEl) {
          prioEl = document.createElement('span');
          prioEl.className = 'item-prio-badge';
          prioEl.textContent = '★';
          iconWrap.appendChild(prioEl);
        } else if (!isPrio && prioEl) {
          prioEl.remove();
        }
      });
      return;
    }

    const savedScrollTop = resetScroll ? 0 : els.shopGrid.scrollTop;
    const ids = getTabOrder(state.activeTab);
    els.shopGrid.innerHTML = '';

    ids.forEach((id) => {
      const item = getItem(id);
      if (!item) return;
      const card = document.createElement('button');
      card.type = 'button';
      card.tabIndex = -1;
      card.className = 'shop-item-card' + (state.selectedShopItemId === id ? ' selected' : '');
      card.dataset.itemId = id;

      const isOwned = ownedSet.has(id);
      const isPrio = state.prioritizedItemId === id;

      card.innerHTML =
        '<div class="item-icon-wrap">' +
          '<img src="' + resolveIcon(item.icon) + '" alt="' + escapeHtml(item.name) + '" draggable="false">' +
          '<span class="item-price-badge">' + item.price + '</span>' +
          (isOwned ? '<span class="item-owned-badge">✓</span>' : '') +
          (isPrio ? '<span class="item-prio-badge">★</span>' : '') +
        '</div>' +
        '<div class="item-meta">' +
          '<div class="item-name">' + escapeHtml(item.name) + '</div>' +
          '<div class="item-short-desc">' + escapeHtml(item.shortDesc || '') + '</div>' +
        '</div>';

      els.shopGrid.appendChild(card);
    });

    state.renderedGridTab = state.activeTab;
    els.shopGrid.scrollTop = savedScrollTop;
  }

  function renderInventorySlots() {
    els.shopSlots.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const id = state.inventory[i] || null;
      const item = getItem(id);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'inv-slot-' + i;
      btn.dataset.slot = String(i);
      btn.className = 'inv-slot' +
        (item ? '' : ' empty') +
        (state.selectedSlotIdx === i ? ' selected' : '');

      if (item) {
        let html = '<img src="' + resolveIcon(item.icon) + '" alt="' + escapeHtml(item.name) + '" draggable="false">';
        if (item.isActive && state.frozenCd > 0) {
          html += '<span class="inv-slot-cd">' + state.frozenCd + '</span>';
        }
        if (item.isActive) {
          html += '<span class="inv-slot-active-dot">❄</span>';
        }
        btn.innerHTML = html;
      }
      els.shopSlots.appendChild(btn);
    }
  }

  function renderDetailPane() {
    const isSlotSelected = state.selectedSlotIdx !== null && !!state.inventory[state.selectedSlotIdx];
    const activeItemId = isSlotSelected
      ? state.inventory[state.selectedSlotIdx]
      : state.selectedShopItemId;
    const item = getItem(activeItemId);

    if (!item) {
      els.shopPrioritizeBtn.classList.add('is-hidden');
      els.shopBuildTree.innerHTML = '<div class="tree-empty">Select an item or equipment slot</div>';
      els.detailName.textContent = '';
      els.detailStats.innerHTML = '';
      els.detailPassive.textContent = '';
      els.shopActionPrice.textContent = '';
      els.shopActionNote.classList.remove('show');
      els.shopActionNote.textContent = '';
      els.shopActionBtn.className = 'mode-disabled';
      els.shopActionBtn.textContent = 'Purchase';
      els.shopActionBtn.disabled = true;
      return;
    }

    // Prioritize button (visible when inspecting a shop item or any item)
    els.shopPrioritizeBtn.classList.remove('is-hidden');
    const isPrio = state.prioritizedItemId === item.id;
    els.shopPrioritizeBtn.classList.toggle('is-prioritized', isPrio);
    els.shopPrioritizeBtn.textContent = isPrio ? '✓ Prioritized' : '🛒 Prioritize';

    // Build path tree visual (3-node recipe for tier-3 items, 2-node for boots)
    const isBoots = item.tab === 'Movement';
    const comp1 = Math.round(item.price * 0.34);
    const comp2 = Math.round(item.price * 0.24);
    const comp3 = Math.round(item.price * 0.16);
    const isOwned = state.inventory.includes(item.id);
    const childrenHtml = isBoots
      ? '<div class="tree-child-node"><div class="tree-child-dot">🥾</div><span class="tree-child-price">' + Math.round(item.price * 0.35) + '</span></div>' +
        '<div class="tree-child-node"><div class="tree-child-dot">📘</div><span class="tree-child-price">' + Math.round(item.price * 0.40) + '</span></div>'
      : '<div class="tree-child-node"><div class="tree-child-dot">⚔</div><span class="tree-child-price">' + comp1 + '</span></div>' +
        '<div class="tree-child-node"><div class="tree-child-dot">💍</div><span class="tree-child-price">' + comp2 + '</span></div>' +
        '<div class="tree-child-node"><div class="tree-child-dot">💎</div><span class="tree-child-price">' + comp3 + '</span></div>';

    els.shopBuildTree.innerHTML =
      '<div class="tree-root-node">' +
        '<img src="' + resolveIcon(item.icon) + '" alt="' + escapeHtml(item.name) + '" draggable="false">' +
        (isOwned ? '<span class="item-owned-badge">✓</span>' : '') +
        '<span class="tree-root-price">' + item.price + '</span>' +
      '</div>' +
      '<div class="tree-connector' + (isBoots ? '' : ' has-mid') + '"></div>' +
      '<div class="tree-children">' + childrenHtml + '</div>';

    // Stats & passive
    els.detailName.textContent = item.name;
    const statsList = Array.isArray(item.stats) ? item.stats : [];
    els.detailStats.innerHTML = statsList.map((s) => '<li>' + escapeHtml(s) + '</li>').join('');
    els.detailPassive.textContent = item.passive || item.shortDesc || '';

    // Action button (Sell vs Purchase)
    els.shopActionNote.classList.remove('show');
    els.shopActionNote.textContent = '';

    if (isSlotSelected) {
      const sellVal = getSellPrice(item);
      els.shopActionPrice.textContent = '$ ' + sellVal;
      els.shopActionBtn.className = 'mode-sell';
      els.shopActionBtn.textContent = 'Sell';
      els.shopActionBtn.disabled = false;
    } else {
      els.shopActionPrice.textContent = '$ ' + item.price;
      const openSlot = firstEmptySlot();
      let blockMsg = '';
      if (item.isActive && hasActiveEquipped()) {
        blockMsg = 'You already have active equipment.';
      } else if (openSlot === -1) {
        blockMsg = 'Equipment slots full.';
      } else if (state.gold < item.price) {
        blockMsg = 'Not enough gold.';
      }

      if (blockMsg) {
        els.shopActionNote.textContent = blockMsg;
        els.shopActionNote.classList.add('show');
        els.shopActionBtn.className = 'mode-disabled';
        els.shopActionBtn.textContent = 'Purchase';
        els.shopActionBtn.disabled = true;
      } else {
        els.shopActionBtn.className = 'mode-buy';
        els.shopActionBtn.textContent = 'Purchase';
        els.shopActionBtn.disabled = false;
      }
    }
  }

  function renderHudMeta() {
    const steps = getActiveSteps();
    if (state.drill === 'sandbox') {
      els.stepNumberPill.textContent = 'FREE';
      els.hudTimer.textContent = 'SANDBOX';
      els.stepDescText.textContent = 'Free Sandbox Mode';
      els.statusHint.style.display = state.hintsVisible ? 'flex' : 'none';
      if (!els.statusHint.textContent.trim()) {
        els.statusHint.textContent = '🆓 Free Sandbox — Open Shop, Buy/Sell, Prioritize to HUD Quick-Buy, or trigger Frozen!';
      }
      return;
    }

    const step = getCurrentStep();
    if (step) {
      els.stepNumberPill.textContent = step.step + '/' + steps.length;
      els.stepDescText.textContent = step.title;
      els.statusHint.textContent = '👉 Step ' + step.step + ': ' + step.hint;
      els.statusHint.style.display = (state.mode === 'practice' && state.hintsVisible && !state.isRunning) ? 'flex' : 'none';
    } else {
      els.stepNumberPill.textContent = steps.length + '/' + steps.length;
      els.stepDescText.textContent = 'Completed!';
      els.statusHint.style.display = 'none';
    }
  }

  function updateGuidePosition() {
    const step = getCurrentStep();
    if (
      state.drill === 'sandbox' ||
      state.mode !== 'practice' ||
      state.drillCompleted ||
      !step ||
      isLayoutEditing()
    ) {
      els.guideIndicator.style.display = 'none';
      return;
    }

    const target = document.querySelector(step.targetSel);
    if (!target) {
      els.guideIndicator.style.display = 'none';
      return;
    }

    const stageRect = els.stage.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    if (stageRect.width < 10 || stageRect.height < 10 || targetRect.width < 2 || targetRect.height < 2) {
      els.guideIndicator.style.display = 'none';
      return;
    }

    let boxLeft = targetRect.left;
    let boxTop = targetRect.top;
    let boxRight = targetRect.right;
    let boxBottom = targetRect.bottom;

    // If target lives inside the scrollable item grid, clip to the visible grid viewport
    if (els.shopGrid && target !== els.shopGrid && els.shopGrid.contains(target)) {
      const gridRect = els.shopGrid.getBoundingClientRect();
      boxLeft = Math.max(boxLeft, gridRect.left);
      boxTop = Math.max(boxTop, gridRect.top);
      boxRight = Math.min(boxRight, gridRect.right);
      boxBottom = Math.min(boxBottom, gridRect.bottom);
      if ((boxBottom - boxTop) < 8 || (boxRight - boxLeft) < 8) {
        els.guideIndicator.style.display = 'none';
        return;
      }
    }

    const left = boxLeft - stageRect.left;
    const top = boxTop - stageRect.top;
    const width = boxRight - boxLeft;
    const height = boxBottom - boxTop;

    els.guideIndicator.style.display = 'block';
    els.guideIndicator.classList.toggle('is-scroll', step.type === 'scroll');
    els.guideIndicator.style.left = left + 'px';
    els.guideIndicator.style.top = top + 'px';
    els.guideIndicator.style.width = width + 'px';
    els.guideIndicator.style.height = height + 'px';
    els.guideTip.textContent = step.tooltip;

    // Edge-clamped vertical tooltip placement (clears top pill AND $ xxxx price above #shop-action-btn)
    const tipH = els.guideTip.offsetHeight || 24;
    const extraAboveGap = target.id === 'shop-action-btn' ? 22 : 6;
    const placeBelow = top < Math.max(46, tipH + extraAboveGap + 8) && (top + height + tipH + 10 < stageRect.height);
    if (placeBelow) {
      els.guideTip.style.top = 'calc(100% + 6px)';
      els.guideTip.style.bottom = 'auto';
    } else {
      els.guideTip.style.bottom = 'calc(100% + ' + extraAboveGap + 'px)';
      els.guideTip.style.top = 'auto';
    }

    // Edge-clamped horizontal tooltip placement within stage bounds
    const tipW = els.guideTip.offsetWidth || 100;
    const desiredStageLeft = left + width / 2 - tipW / 2;
    const clampedStageLeft = Math.max(6, Math.min(stageRect.width - tipW - 6, desiredStageLeft));
    els.guideTip.style.left = (clampedStageLeft - left) + 'px';
    els.guideTip.style.right = 'auto';
    els.guideTip.style.transform = 'none';
  }

  let guideSyncRaf1 = 0;
  let guideSyncRaf2 = 0;
  function scheduleGuideSync() {
    updateGuidePosition();
    if (guideSyncRaf1) cancelAnimationFrame(guideSyncRaf1);
    if (guideSyncRaf2) cancelAnimationFrame(guideSyncRaf2);
    guideSyncRaf1 = requestAnimationFrame(() => {
      guideSyncRaf1 = 0;
      updateGuidePosition();
      guideSyncRaf2 = requestAnimationFrame(() => {
        guideSyncRaf2 = 0;
        updateGuidePosition();
      });
    });
  }

  function renderAll(resetScroll) {
    renderHud();
    renderShopModalVisibility();
    renderTabs();
    renderShopGrid(!!resetScroll);
    renderInventorySlots();
    renderDetailPane();
    renderHudMeta();
    scheduleGuideSync();
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- Drill Step Completion ---------- */
  function completeStep(e, isScroll) {
    const steps = getActiveSteps();
    const step = steps[state.currentStepIdx];
    if (!step) return;

    const now = performance.now();
    if (!isScroll) {
      state.lastTapTime = now;
    }

    if (!state.isRunning) {
      startTimer();
    }

    const splitDuration = (now - state.stepStartTime) / 1000;
    state.splits.push({
      step: step.step,
      title: step.title,
      duration: splitDuration
    });
    state.stepStartTime = now;

    playStepSound(step.sound);
    if (!isScroll && e) createRipple(e);

    state.currentStepIdx++;
    if (state.currentStepIdx >= steps.length) {
      state.drillCompleted = true;
      const total = stopTimer();
      renderAll(false);
      setTimeout(() => showVictory(total), 350);
    } else if (isScroll) {
      // Never mutate #shop-grid DOM or reset scrollTop during active touch/wheel inertia!
      renderHudMeta();
      scheduleGuideSync();
    } else {
      renderAll(false);
      // Immediately check visibility if the newly entered step is a scroll step
      const nextStep = getCurrentStep();
      if (nextStep && nextStep.action === 'scroll-to-item') {
        requestAnimationFrame(checkScrollStepComplete);
      }
    }
  }

  function debounceTap() {
    const now = performance.now();
    if (now - state.lastTapTime < 55) return true;
    state.lastTapTime = now;
    return false;
  }

  /* ---------- Real Shop & HUD Actions ---------- */
  function triggerFrozenEffect() {
    const activeItem = getEquippedActiveItem();
    state.frozenActive = true;
    state.frozenCd = (activeItem && activeItem.activeCd) || 100;
    clearTimeout(state.frozenFxTimer);
    clearTimeout(state.sandboxCdTimer);

    state.frozenFxTimer = setTimeout(() => {
      state.frozenActive = false;
      renderHud();
    }, 2000);

    if (state.drill === 'sandbox') {
      state.sandboxCdTimer = setTimeout(() => {
        state.frozenCd = 0;
        renderHud();
        renderInventorySlots();
      }, 3500);
    }
  }

  function performOpenShop(e) {
    if (isLayoutEditing()) return;
    callAudio('initAudio');
    if (typeof window.closeMenu === 'function') window.closeMenu();

    if (state.drill === 'sandbox') {
      state.shopOpen = true;
      callAudio('playClickSound');
      createRipple(e);
      renderAll(false);
      return;
    }

    const step = getCurrentStep();
    if (!step || step.action !== 'open-shop') {
      registerMisclick();
      return;
    }
    if (debounceTap()) return;

    state.shopOpen = true;
    if (step.step === 1) {
      state.activeTab = 'Defense';
      state.selectedSlotIdx = 0;
      state.selectedShopItemId = null;
    } else {
      state.selectedSlotIdx = null;
      state.selectedShopItemId = null;
    }
    completeStep(e, false);
  }

  function performCloseShop(e) {
    if (isLayoutEditing()) return;
    callAudio('initAudio');
    if (typeof window.closeMenu === 'function') window.closeMenu();

    if (state.drill === 'sandbox') {
      state.shopOpen = false;
      callAudio('playClickSound');
      createRipple(e);
      renderAll(false);
      return;
    }

    const step = getCurrentStep();
    if (!step || step.action !== 'close-shop') {
      registerMisclick();
      return;
    }
    if (debounceTap()) return;

    state.shopOpen = false;
    completeStep(e, false);
  }

  function performQuickBuy(e) {
    if (isLayoutEditing()) return;
    callAudio('initAudio');
    if (typeof window.closeMenu === 'function') window.closeMenu();

    const item = getQuickBuyItem();
    if (!item) return;

    if (state.drill === 'sandbox') {
      if (item.id === 'power_potion') {
        if (state.gold < item.price) {
          callAudio('playErrorBuzz');
          setSandboxToast('⚠️ Not enough gold for Power Potion ($' + item.price + ').');
          return;
        }
        state.gold -= item.price;
        if (state.prioritizedItemId === item.id) state.prioritizedItemId = null;
        callAudio('playCoinSound');
        createRipple(e);
        setSandboxToast('🧪 Consumed Power Potion (-$' + item.price + ')!');
        renderAll(false);
        return;
      }
      const slot = firstEmptySlot();
      if (slot === -1) {
        callAudio('playErrorBuzz');
        setSandboxToast('⚠️ Slots full! Sell an item in Shop before Quick-Buying.');
        return;
      }
      if (item.isActive && hasActiveEquipped()) {
        callAudio('playErrorBuzz');
        setSandboxToast('⚠️ You already have an active item equipped.');
        return;
      }
      if (state.gold < item.price) {
        callAudio('playErrorBuzz');
        setSandboxToast('⚠️ Not enough gold for ' + item.name + ' ($' + item.price + ').');
        return;
      }
      state.inventory[slot] = item.id;
      state.gold -= item.price;
      if (state.prioritizedItemId === item.id) {
        state.prioritizedItemId = null;
      }
      callAudio('playCoinSound');
      createRipple(e);
      setSandboxToast('✅ Quick-Bought ' + item.name + ' into Slot ' + (slot + 1) + '!');
      renderAll(false);
      return;
    }

    const step = getCurrentStep();
    if (!step || step.action !== 'quick-buy') {
      registerMisclick();
      return;
    }
    if (debounceTap()) return;

    const slot = firstEmptySlot();
    const targetItem = getItem(step.itemId) || item;
    if (slot !== -1 && targetItem) {
      state.inventory[slot] = targetItem.id;
      state.gold -= targetItem.price;
      if (state.prioritizedItemId === targetItem.id) {
        state.prioritizedItemId = null;
      }
    }
    completeStep(e, false);
  }

  function performActivateFrozen(e) {
    if (isLayoutEditing()) return;
    callAudio('initAudio');
    if (typeof window.closeMenu === 'function') window.closeMenu();

    if (state.drill === 'sandbox') {
      if (!hasActiveEquipped() || state.frozenCd > 0) {
        callAudio('playErrorBuzz');
        return;
      }
      triggerFrozenEffect();
      callAudio('playFreezeSound');
      createRipple(e);
      setSandboxToast('❄️ Frozen activated! Untargetable for 2s (CD resets in Sandbox).');
      renderAll(false);
      return;
    }

    const step = getCurrentStep();
    if (!step || step.action !== 'activate-frozen') {
      registerMisclick();
      return;
    }
    if (debounceTap()) return;

    triggerFrozenEffect();
    completeStep(e, false);
  }

  function performSwitchTab(tab, e) {
    if (isLayoutEditing()) return;
    callAudio('initAudio');

    if (state.drill === 'sandbox') {
      state.activeTab = tab;
      callAudio('playClickSound');
      createRipple(e);
      renderAll(true);
      return;
    }

    const step = getCurrentStep();
    if (!step || step.action !== 'switch-tab' || step.tab !== tab) {
      registerMisclick();
      return;
    }
    if (debounceTap()) return;

    state.activeTab = tab;
    renderShopGrid(true);
    completeStep(e, false);
  }

  function performSelectShopItem(itemId, e) {
    if (isLayoutEditing()) return;
    callAudio('initAudio');

    if (state.drill === 'sandbox') {
      state.selectedShopItemId = itemId;
      state.selectedSlotIdx = null;
      callAudio('playClickSound');
      createRipple(e);
      renderAll(false);
      return;
    }

    const step = getCurrentStep();
    // Early-tap forgiveness: if player swiped fast and tapped the target item while still on Step 17, accept both steps cleanly!
    if (step && step.action === 'scroll-to-item') {
      if (itemId === step.itemId) {
        if (debounceTap()) return;
        completeStep(null, true);
        state.selectedShopItemId = itemId;
        state.selectedSlotIdx = null;
        completeStep(e, false);
      }
      // Never penalize touching/dragging inside #shop-grid during scroll step
      return;
    }

    if (!step || step.action !== 'select-item' || step.itemId !== itemId) {
      registerMisclick();
      return;
    }
    if (debounceTap()) return;

    state.selectedShopItemId = itemId;
    state.selectedSlotIdx = null;
    completeStep(e, false);
  }

  function performSelectSlot(slotIdx, e) {
    if (isLayoutEditing()) return;
    callAudio('initAudio');

    if (!state.inventory[slotIdx]) {
      registerMisclick();
      return;
    }

    if (state.drill === 'sandbox') {
      state.selectedSlotIdx = slotIdx;
      state.selectedShopItemId = null;
      callAudio('playClickSound');
      createRipple(e);
      renderAll(false);
      return;
    }

    const step = getCurrentStep();
    if (!step || step.action !== 'select-slot' || step.slotIdx !== slotIdx) {
      registerMisclick();
      return;
    }
    if (debounceTap()) return;

    state.selectedSlotIdx = slotIdx;
    state.selectedShopItemId = null;
    completeStep(e, false);
  }

  function performPrioritize(e) {
    if (isLayoutEditing()) return;
    callAudio('initAudio');

    if (state.drill !== 'sandbox') {
      registerMisclick();
      return;
    }

    const targetId = state.selectedShopItemId ||
      (state.selectedSlotIdx !== null ? state.inventory[state.selectedSlotIdx] : null);
    const item = getItem(targetId);
    if (!item) return;

    state.prioritizedItemId = item.id;
    callAudio('playClickSound');
    createRipple(e);
    setSandboxToast('📌 Prioritized ' + item.name + ' to HUD Quick-Buy!');
    renderAll(false);
  }

  function performSellAll(e) {
    if (isLayoutEditing()) return;
    callAudio('initAudio');

    if (state.drill !== 'sandbox') {
      registerMisclick();
      return;
    }

    let refund = 0;
    let soldCount = 0;
    for (let i = 0; i < 6; i++) {
      const it = getItem(state.inventory[i]);
      if (it) {
        refund += getSellPrice(it);
        state.inventory[i] = null;
        soldCount++;
      }
    }
    if (soldCount > 0) {
      state.gold += refund;
      state.selectedSlotIdx = null;
      state.frozenActive = false;
      state.frozenCd = 0;
      callAudio('playCoinSound');
      createRipple(e);
      setSandboxToast('💰 Sold all ' + soldCount + ' items (+$' + formatGold(refund) + ')!');
      renderAll(false);
    }
  }

  function performPrimaryAction(e) {
    if (isLayoutEditing()) return;
    callAudio('initAudio');

    const isSlotSelected = state.selectedSlotIdx !== null && !!state.inventory[state.selectedSlotIdx];

    if (state.drill === 'sandbox') {
      if (isSlotSelected) {
        const it = getItem(state.inventory[state.selectedSlotIdx]);
        if (!it) return;
        const refund = getSellPrice(it);
        state.inventory[state.selectedSlotIdx] = null;
        state.gold += refund;
        if (it.isActive) {
          state.frozenActive = false;
          state.frozenCd = 0;
        }
        state.selectedSlotIdx = null;
        callAudio('playCoinSound');
        createRipple(e);
        setSandboxToast('💰 Sold ' + it.name + ' (+$' + refund + ')');
        renderAll(false);
      } else if (state.selectedShopItemId) {
        const it = getItem(state.selectedShopItemId);
        if (!it) return;
        const openSlot = firstEmptySlot();
        if (openSlot === -1 || state.gold < it.price || (it.isActive && hasActiveEquipped())) {
          callAudio('playErrorBuzz');
          return;
        }
        state.inventory[openSlot] = it.id;
        state.gold -= it.price;
        if (state.prioritizedItemId === it.id) {
          state.prioritizedItemId = null;
        }
        callAudio('playCoinSound');
        createRipple(e);
        setSandboxToast('✅ Purchased ' + it.name + ' (-$' + it.price + ')');
        renderAll(false);
      }
      return;
    }

    const step = getCurrentStep();
    if (!step) return;

    if (step.action === 'sell-slot' && isSlotSelected && state.selectedSlotIdx === step.slotIdx) {
      if (debounceTap()) return;
      const it = getItem(state.inventory[step.slotIdx]);
      const refund = getSellPrice(it);
      state.inventory[step.slotIdx] = null;
      state.gold += refund;
      if (it && it.isActive) {
        state.frozenActive = false;
      }
      state.selectedSlotIdx = null;
      completeStep(e, false);
      return;
    }

    if (step.action === 'buy-item' && state.selectedShopItemId === step.itemId) {
      if (debounceTap()) return;
      const it = getItem(step.itemId);
      const openSlot = firstEmptySlot();
      if (it && openSlot !== -1 && state.gold >= it.price) {
        state.inventory[openSlot] = it.id;
        state.gold -= it.price;
        if (state.prioritizedItemId === it.id) {
          state.prioritizedItemId = null;
        }
      }
      completeStep(e, false);
      return;
    }

    registerMisclick();
  }

  function checkScrollStepComplete() {
    if (isLayoutEditing() || state.drill === 'sandbox') return;
    const step = getCurrentStep();
    if (!step || step.action !== 'scroll-to-item') return;

    const targetCard = els.shopGrid.querySelector('.shop-item-card[data-item-id="' + step.itemId + '"]');
    if (!targetCard) return;

    const gridRect = els.shopGrid.getBoundingClientRect();
    const cardRect = targetCard.getBoundingClientRect();
    if (gridRect.height < 10 || cardRect.height < 4) return;

    const cardVisible = cardRect.top < gridRect.bottom - 12 && cardRect.bottom > gridRect.top + 12;
    if (cardVisible) {
      completeStep(null, true);
    }
  }

  function handleShopGridScroll() {
    if (isLayoutEditing()) return;
    // Dynamically keep the Training hint ring locked onto scrolling grid targets
    updateGuidePosition();
    checkScrollStepComplete();
  }

  /* ---------- Victory Modal ---------- */
  function showVictory(total) {
    callAudio('playVictoryChime');
    if (els.miniHud) els.miniHud.classList.remove('dimmed');

    let rankClass = 'rank-epic';
    let rankName = 'Epic / Grandmaster';
    let comment = 'Immortality will expire before you freeze! Keep practicing finger speed.';

    const thresholds = (state.drill === 'triple')
      ? [4.10, 5.40, 7.00, 9.00]
      : [2.20, 3.00, 4.00, 5.50];

    if (total < thresholds[0]) {
      rankClass = 'rank-immortal';
      rankName = 'Mythical Immortal';
      comment = '🔥 INHUMAN REACTION! Pro MPL player tier fast swap!';
    } else if (total < thresholds[1]) {
      rankClass = 'rank-glory';
      rankName = 'Mythical Glory';
      comment = '⚡ Flawless swap! You can pull this off in high rank teamfights.';
    } else if (total < thresholds[2]) {
      rankClass = 'rank-mythic';
      rankName = 'Mythic';
      comment = '👍 Good speed! With a bit more muscle memory, you will be unstoppable.';
    } else if (total < thresholds[3]) {
      rankClass = 'rank-legend';
      rankName = 'Legend';
      comment = 'Decent, but you might get bursted down before your swap completes.';
    }

    const resRank = document.getElementById('res-rank');
    resRank.className = 'rank-badge ' + rankClass;
    resRank.innerText = rankName;

    document.getElementById('res-time').innerText = total.toFixed(3) + 's';
    const missNote = state.misclicks > 0
      ? '  •  ' + state.misclicks + ' misclick' + (state.misclicks === 1 ? '' : 's')
      : '  •  0 misclicks (Clean!)';
    document.getElementById('res-comment').innerText = comment + missNote;

    const tbody = document.getElementById('split-table-body');
    tbody.innerHTML = '';

    let maxDuration = -1;
    let slowestIdx = -1;
    state.splits.forEach((s, idx) => {
      if (s.duration > maxDuration) {
        maxDuration = s.duration;
        slowestIdx = idx;
      }
    });

    state.splits.forEach((s, idx) => {
      const tr = document.createElement('tr');
      if (idx === slowestIdx) tr.className = 'slowest';
      tr.innerHTML =
        '<td>' + s.step + '</td>' +
        '<td>' + escapeHtml(s.title) + (idx === slowestIdx ? ' <span style="font-size: 10px; color:#f87171;">(Slowest)</span>' : '') + '</td>' +
        '<td style="text-align: right; font-family: monospace;">' + s.duration.toFixed(3) + 's</td>';
      tbody.appendChild(tr);
    });

    els.victoryModal.classList.add('show');
  }

  /* ---------- Public Controls (called by trainer.html UI buttons) ---------- */
  function resetDrill() {
    clearInterval(state.timerInterval);
    clearTimeout(state.frozenFxTimer);
    clearTimeout(state.sandboxCdTimer);
    state.timerInterval = null;
    state.isRunning = false;
    state.drillCompleted = false;
    state.currentStepIdx = 0;
    state.lastTapTime = 0;
    state.splits = [];
    state.misclicks = 0;

    state.gold = typeof window.MLBB_START_GOLD === 'number' ? window.MLBB_START_GOLD : 29764;
    const baseLoadout = Array.isArray(window.MLBB_START_LOADOUT) ? window.MLBB_START_LOADOUT : FALLBACK_LOADOUT;
    state.inventory = baseLoadout.slice(0, 6);
    while (state.inventory.length < 6) state.inventory.push(null);

    state.shopOpen = false;
    state.activeTab = 'Defense';
    state.selectedSlotIdx = 0;
    state.selectedShopItemId = null;
    state.prioritizedItemId = window.MLBB_START_QUICKBUY || 'immortality';
    state.frozenActive = false;
    state.frozenCd = 0;

    els.hudTimer.innerText = state.drill === 'sandbox' ? 'SANDBOX' : '0.000s';
    els.hudTimer.classList.remove('running');
    els.miniHud.classList.remove('dimmed');
    if (typeof window.closeMenu === 'function') window.closeMenu();
    closeModal();
    if (state.drill === 'sandbox') {
      els.statusHint.textContent = '🆓 Free Sandbox — Open Shop, Buy/Sell, Prioritize to HUD Quick-Buy, or trigger Frozen!';
    }
    renderAll(true);
  }

  function setDrill(newDrill) {
    state.drill = newDrill;
    const map = {
      triple: 'btn-drill-triple',
      double: 'btn-drill-double',
      sandbox: 'btn-drill-sandbox'
    };
    Object.keys(map).forEach((k) => {
      const btn = document.getElementById(map[k]);
      if (btn) btn.className = 'mode-btn' + (state.drill === k ? ' active' : '');
    });
    resetDrill();
  }

  function setMode(newMode) {
    state.mode = newMode;
    const pBtn = document.getElementById('btn-mode-practice');
    const rBtn = document.getElementById('btn-mode-ranked');
    if (pBtn) pBtn.className = 'mode-btn' + (state.mode === 'practice' ? ' active' : '');
    if (rBtn) rBtn.className = 'mode-btn' + (state.mode === 'ranked' ? ' active' : '');
    if (typeof window.closeMenu === 'function') window.closeMenu();
    resetDrill();
  }

  function toggleHitboxMode() {
    state.hitboxMode = state.hitboxMode === 'realistic' ? 'strict' : 'realistic';
    document.body.classList.toggle('hitbox-realistic', state.hitboxMode === 'realistic');
    document.body.classList.toggle('hitbox-strict', state.hitboxMode === 'strict');
    const btn = document.getElementById('hitbox-mode-btn');
    if (btn) {
      btn.innerText = state.hitboxMode === 'realistic' ? '👍 Hitbox: Realistic' : '🎯 Hitbox: Strict';
    }
  }

  function toggleHints() {
    state.hintsVisible = !state.hintsVisible;
    const btn = document.getElementById('hint-toggle-btn');
    if (btn) btn.innerText = state.hintsVisible ? '💬 Hints: ON' : '💬 Hints: OFF';
    renderHudMeta();
  }

  function closeModal() {
    if (els.victoryModal) els.victoryModal.classList.remove('show');
  }

  function openLayoutEditor() {
    if (typeof window.closeMenu === 'function') window.closeMenu();
    if (!window.LayoutEditor || typeof window.LayoutEditor.enter !== 'function') return;
    state.savedShopBeforeEdit = state.shopOpen;
    els.stage.classList.add('layout-editing');
    els.guideIndicator.style.display = 'none';
    window.LayoutEditor.enter();
  }

  /* ---------- LayoutEditor Registration ---------- */
  function initLayoutEditor() {
    if (!window.LayoutEditor || typeof window.LayoutEditor.init !== 'function') return;

    window.LayoutEditor.init({
      containerEl: els.stage,
      items: [
        {
          id: 'hud-shop',
          label: 'Shop ($)',
          el: els.hudShop,
          scope: 'hud',
          defaultX: 98.2,
          defaultY: 1.8,
          defaultScale: 1.0,
          minScale: 0.7,
          maxScale: 1.8,
          movable: true,
          scalable: true,
          anchor: 'top-right'
        },
        {
          id: 'hud-quickbuy',
          label: 'Quick-Buy',
          el: els.hudQuickBuy,
          scope: 'hud',
          defaultX: 92.5,
          defaultY: 16.5,
          defaultScale: 1.0,
          minScale: 0.7,
          maxScale: 1.55,
          movable: true,
          scalable: true,
          anchor: 'top-right'
        },
        {
          id: 'hud-frozen',
          label: 'Frozen Skill',
          el: els.hudFrozen,
          scope: 'hud',
          defaultX: 86.5,
          defaultY: 36.0,
          defaultScale: 1.0,
          minScale: 0.7,
          maxScale: 1.8,
          movable: true,
          scalable: true,
          anchor: 'top-right'
        },
        {
          id: 'shop-panel',
          label: 'Shop Panel',
          el: els.shopPanel,
          scope: 'shop',
          defaultScale: 1.0,
          minScale: 0.72,
          maxScale: 1.08,
          movable: true,
          scalable: true,
          anchor: 'center',
          applyGlobalScale: false
        },
        {
          id: 'shop-close',
          label: 'Exit (X)',
          el: els.shopCloseBtn,
          scope: 'shop',
          defaultScale: 1.0,
          minScale: 0.75,
          maxScale: 1.6,
          movable: false,
          scalable: true,
          anchor: 'top-right',
          applyGlobalScale: true
        },
        {
          id: 'shop-action',
          label: 'Sell / Buy',
          el: els.shopActionWrap,
          scope: 'shop',
          defaultScale: 1.0,
          minScale: 0.75,
          maxScale: 1.5,
          movable: false,
          scalable: true,
          anchor: 'bottom-right',
          applyGlobalScale: true
        },
        {
          id: 'shop-inventory',
          label: '6-Slot Bar',
          el: els.shopSlots,
          scope: 'shop',
          defaultScale: 1.0,
          minScale: 0.75,
          maxScale: 1.15,
          movable: false,
          scalable: true,
          anchor: 'center',
          applyGlobalScale: false
        }
      ],
      onEditChange: function (editing) {
        if (editing) {
          els.stage.classList.add('layout-editing');
          els.guideIndicator.style.display = 'none';
        } else {
          els.stage.classList.remove('layout-editing');
          if (state.savedShopBeforeEdit !== null) {
            state.shopOpen = state.savedShopBeforeEdit;
            state.savedShopBeforeEdit = null;
          }
          renderAll(false);
          scheduleGuideSync();
        }
      },
      onShopPreview: function (showShop) {
        if (typeof showShop === 'boolean') {
          state.shopOpen = showShop;
          if (showShop && state.selectedSlotIdx === null && !state.selectedShopItemId) {
            const firstOwned = state.inventory.findIndex((id) => !!id);
            state.selectedSlotIdx = firstOwned !== -1 ? firstOwned : null;
          }
          renderShopModalVisibility();
          renderInventorySlots();
          renderDetailPane();
        }
      },
      onChange: function () {
        scheduleGuideSync();
      }
    });
  }

  /* ---------- Event Wiring ---------- */
  function bindEvents() {
    els.hudShop.addEventListener('pointerdown', (e) => {
      if (isLayoutEditing()) return;
      e.stopPropagation();
      performOpenShop(e);
    });

    els.hudQuickBuy.addEventListener('pointerdown', (e) => {
      if (isLayoutEditing()) return;
      e.stopPropagation();
      performQuickBuy(e);
    });

    els.hudFrozen.addEventListener('pointerdown', (e) => {
      if (isLayoutEditing()) return;
      e.stopPropagation();
      performActivateFrozen(e);
    });

    els.shopCloseBtn.addEventListener('pointerdown', (e) => {
      if (isLayoutEditing()) return;
      e.stopPropagation();
      performCloseShop(e);
    });

    // Click anywhere outside #shop-panel closes shop!
    els.shopBackdrop.addEventListener('pointerdown', (e) => {
      if (isLayoutEditing()) return;
      if (e.target === els.shopBackdrop) {
        e.stopPropagation();
        performCloseShop(e);
      }
    });

    // Prevent clicks on shop panel empty area from closing shop, but count misclicks in drill mode
    els.shopPanel.addEventListener('pointerdown', (e) => {
      if (isLayoutEditing()) return;
      e.stopPropagation();
      if (typeof window.closeMenu === 'function') window.closeMenu();
      const interactive = e.target.closest(
        'button, .shop-item-card, #shop-grid, .inv-slot'
      );
      if (!interactive) {
        registerMisclick();
      }
    });

    // Tabs delegation
    els.shopTabs.addEventListener('pointerdown', (e) => {
      if (isLayoutEditing()) return;
      const btn = e.target.closest('.shop-tab-btn');
      if (!btn) return;
      e.stopPropagation();
      performSwitchTab(btn.dataset.tab, e);
    });

    // Item grid tap delegation (use click on scroll-capable grid so touch swipes don't accidentally fire tap!)
    let gridDownPos = null;
    els.shopGrid.addEventListener('mousedown', (e) => {
      if (isLayoutEditing()) return;
      // Prevent browser focus auto-scrolling the grid when clicking an item card
      if (e.target.closest('.shop-item-card')) {
        e.preventDefault();
      }
    });
    els.shopGrid.addEventListener('pointerdown', (e) => {
      if (isLayoutEditing()) return;
      gridDownPos = { x: e.clientX, y: e.clientY, t: performance.now() };
    });

    els.shopGrid.addEventListener('click', (e) => {
      if (isLayoutEditing()) return;
      const card = e.target.closest('.shop-item-card');
      const down = gridDownPos;
      gridDownPos = null;
      if (!card) return;
      if (down && (performance.now() - down.t) < 600) {
        const dx = Math.abs(e.clientX - down.x);
        const dy = Math.abs(e.clientY - down.y);
        if (dx > 14 || dy > 14) return; // was a scroll swipe, not a tap
      }
      e.stopPropagation();
      performSelectShopItem(card.dataset.itemId, e);
    });

    els.shopGrid.addEventListener('scroll', handleShopGridScroll, { passive: true });

    // Inventory slots delegation
    els.shopSlots.addEventListener('pointerdown', (e) => {
      if (isLayoutEditing()) return;
      const slotBtn = e.target.closest('.inv-slot');
      if (!slotBtn) return;
      e.stopPropagation();
      performSelectSlot(parseInt(slotBtn.dataset.slot, 10), e);
    });

    // Prioritize, Sell All, Primary Action (Sell / Purchase)
    els.shopPrioritizeBtn.addEventListener('pointerdown', (e) => {
      if (isLayoutEditing()) return;
      e.stopPropagation();
      performPrioritize(e);
    });

    els.shopSellAllBtn.addEventListener('pointerdown', (e) => {
      if (isLayoutEditing()) return;
      e.stopPropagation();
      performSellAll(e);
    });

    els.shopActionBtn.addEventListener('pointerdown', (e) => {
      if (isLayoutEditing()) return;
      e.stopPropagation();
      performPrimaryAction(e);
    });

    // Misclick on bare battlefield background (when shop is closed)
    els.stage.addEventListener('pointerdown', (e) => {
      if (isLayoutEditing()) return;
      if (e.target === els.stage || e.target === els.hudLayer) {
        if (typeof window.closeMenu === 'function') window.closeMenu();
        registerMisclick();
      }
    });

    window.addEventListener('resize', scheduleGuideSync);
    window.addEventListener('orientationchange', () => setTimeout(scheduleGuideSync, 120));
    document.addEventListener('fullscreenchange', scheduleGuideSync);
    document.addEventListener('webkitfullscreenchange', scheduleGuideSync);
    if (typeof ResizeObserver === 'function' && els.stage) {
      const ro = new ResizeObserver(scheduleGuideSync);
      ro.observe(els.stage);
    }
  }

  /* ---------- Init ---------- */
  function init() {
    cacheDom();
    document.body.classList.add('hitbox-realistic');
    bindEvents();
    initLayoutEditor();
    resetDrill();
  }

  // Expose global hooks for trainer.html onclick handlers & verification
  window.resetDrill = resetDrill;
  window.setDrill = setDrill;
  window.setMode = setMode;
  window.toggleHitboxMode = toggleHitboxMode;
  window.toggleHints = toggleHints;
  window.closeModal = closeModal;
  window.openLayoutEditor = openLayoutEditor;
  window.ShopTrainer = {
    getState: () => state,
    updateGuidePosition: updateGuidePosition,
    resetDrill: resetDrill
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

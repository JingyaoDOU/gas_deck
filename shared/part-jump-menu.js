(() => {
  if (window.__partJumpMenuInitialized) return;
  window.__partJumpMenuInitialized = true;

  function isPartPage(pathname) {
    return /\/part\d+\//.test(pathname);
  }

  function resolveMenuHref(pathFromPartDir, pathFromRoot) {
    const path = window.location.pathname.toLowerCase();
    return isPartPage(path) ? pathFromPartDir : pathFromRoot;
  }

  const parts = [
    { key: 'opening', href: resolveMenuHref('../open_index.html', 'open_index.html'), eyebrow: 'Start', title: '开场首页' },
    { key: 'part1', href: resolveMenuHref('../part1/index.html', 'part1/index.html'), eyebrow: 'Part 1', title: 'AI 发展概览' },
    { key: 'part2', href: resolveMenuHref('../part2/index.html', 'part2/index.html'), eyebrow: 'Part 2', title: '地质与地球物理建模' },
    { key: 'part3', href: resolveMenuHref('../part3/pinn_slides.html', 'part3/pinn_slides.html'), eyebrow: 'Part 3', title: '油藏数值模拟' },
    { key: 'part4', href: resolveMenuHref('../part4/index.html', 'part4/index.html'), eyebrow: 'Part 4', title: 'AI 工作流与落地' }
  ];

  function detectCurrentPart() {
    const path = window.location.pathname.toLowerCase();
    if (path.endsWith('/open_index.html')) return 'opening';
    if (path.includes('/part1/')) return 'part1';
    if (path.includes('/part2/')) return 'part2';
    if (path.includes('/part3/')) return 'part3';
    if (path.includes('/part4/')) return 'part4';
    return '';
  }

  function closeMenu(root, button) {
    root.dataset.open = 'false';
    button.setAttribute('aria-expanded', 'false');
  }

  function openMenu(root, button) {
    root.dataset.open = 'true';
    button.setAttribute('aria-expanded', 'true');
  }

  function toggleMenu(root, button) {
    if (root.dataset.open === 'true') closeMenu(root, button);
    else openMenu(root, button);
  }

  function buildMenu() {
    if (document.getElementById('partJumpMenu')) return;

    const currentPart = detectCurrentPart();
    const root = document.createElement('div');
    root.className = 'part-jump-menu';
    root.id = 'partJumpMenu';
    root.dataset.open = 'false';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'part-jump-menu__toggle';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'partJumpMenuPanel');
    button.setAttribute('aria-label', '打开分部跳转菜单');
    button.innerHTML = `
      <span class="part-jump-menu__toggle-label">目录</span>
      <svg class="part-jump-menu__chevron" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M2.2 4.1 6 7.9l3.8-3.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    `;

    const panel = document.createElement('nav');
    panel.className = 'part-jump-menu__panel';
    panel.id = 'partJumpMenuPanel';
    panel.setAttribute('aria-label', '分部跳转');

    parts.forEach((part) => {
      const link = document.createElement('a');
      link.className = 'part-jump-menu__link';
      link.href = part.href;
      if (part.key === currentPart) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
      link.innerHTML = `
        <span class="part-jump-menu__eyebrow">${part.eyebrow}</span>
        <span class="part-jump-menu__title">${part.title}</span>
      `;
      panel.appendChild(link);
    });

    root.appendChild(button);
    root.appendChild(panel);
    document.body.appendChild(root);

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleMenu(root, button);
    });

    panel.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    document.addEventListener('click', (event) => {
      if (!root.contains(event.target)) {
        closeMenu(root, button);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu(root, button);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildMenu, { once: true });
  } else {
    buildMenu();
  }
})();

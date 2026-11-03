/* Small, event-driven enhancements. All content is available without JavaScript. */
(() => {
  'use strict';
  const year = document.getElementById('year');
  year.textContent = new Date().getFullYear();

  // Animation settings: lower interval = more signals; lower duration = faster signals.
  const signalSettings = {
    interval: 550,       // Milliseconds between signals.
    duration: 1600,      // Average travel time in milliseconds.
    maxSignals:20       // Fixed pool bounds the amount of animated work.
  };

  const ns = 'http://www.w3.org/2000/svg';
  const edges = document.getElementById('network-edges');
  const nodeGroup = document.getElementById('network-nodes');
  const signalGroup = document.getElementById('network-signals');
  // Points follow the two hemispheres; geometry is built only once.
  const leftHemisphere = [
    [215, 112], [176, 127], [139, 151], [111, 192], [108, 238],
    [119, 278], [151, 325], [182, 353], [218, 350], [231, 311],
    [211, 275], [235, 239], [218, 197], [234, 157], [185, 166],
    [155, 197], [147, 236], [172, 275], [187, 313], [183, 223]
  ];
  const nodes = leftHemisphere.concat(leftHemisphere.map(([x, y]) => [520 - x, y]))
    .map(([x, y]) => ({ x, y }));
  const connections = [];
  const connectedPairs = new Set();
  nodes.forEach((node, i) => {
    // Three nearest neighbors keep the graph sparse and give every node a route.
    const neighbors = nodes.map((other, index) => ({
      other,
      index,
      distance: Math.hypot(node.x - other.x, node.y - other.y)
    })).filter(item => item.index !== i)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    neighbors.forEach(({ other, index }) => {
      const key = [Math.min(i, index), Math.max(i, index)].join('-');
      if (connectedPairs.has(key)) return;
      connectedPairs.add(key);
      const line = document.createElementNS(ns, 'line');
      Object.entries({ x1: node.x, y1: node.y, x2: other.x, y2: other.y })
        .forEach(([name, value]) => line.setAttribute(name, value));
      edges.appendChild(line);
      connections.push([node, other]);
    });
    const dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('cx', node.x);
    dot.setAttribute('cy', node.y);
    dot.setAttribute('r', i % 5 === 0 ? 3.7 : 2.6);
    if (i % 7 === 0) dot.setAttribute('fill', '#b85b42');
    nodeGroup.appendChild(dot);
  });

  // Horizontal connections remain visible but have no upward/downward meaning.
  const signalRoutes = connections.filter(([a, b]) => a.y !== b.y);

  // Native browser animations move a small, reusable pool of signal dots.
  // JavaScript only chooses a new route a couple of times per second.
  const slots = Array.from({ length: signalSettings.maxSignals }, () => {
    const dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('class', 'neural-signal');
    dot.setAttribute('r', '3.5');
    signalGroup.appendChild(dot);
    return { dot, animation: null };
  });
  const figure = document.querySelector('.model-figure');
  const toggle = document.getElementById('motion-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canAnimate = typeof slots[0].dot.animate === 'function';
  let paused = false;
  let visible = !('IntersectionObserver' in window);
  let signalTimer = null;

  function sendSignal() {
    const slot = slots.find(item => !item.animation);
    if (!slot || !signalRoutes.length) return;
    const route = signalRoutes[Math.floor(Math.random() * signalRoutes.length)];
    const [from, to] = Math.random() < .5 ? route : [route[1], route[0]];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    // SVG y increases downward: predictions descend; prediction errors ascend.
    slot.dot.setAttribute('class', `neural-signal ${dy > 0 ? 'prediction' : 'prediction-error'}`);
    slot.dot.setAttribute('cx', from.x);
    slot.dot.setAttribute('cy', from.y);
    slot.animation = slot.dot.animate([
      { transform: 'translate(0px, 0px)', opacity: 0 },
      { transform: `translate(${dx * .12}px, ${dy * .12}px)`, opacity: 1, offset: .12 },
      { transform: `translate(${dx * .88}px, ${dy * .88}px)`, opacity: 1, offset: .88 },
      { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
    ], {
      duration: signalSettings.duration * (.75 + Math.random() * .5),
      easing: 'linear'
    });
    slot.animation.onfinish = () => {
      slot.animation.cancel();
      slot.animation = null;
    };
  }

  function scheduleSignal() {
    signalTimer = window.setTimeout(() => {
      signalTimer = null;
      sendSignal();
      scheduleSignal();
    }, signalSettings.interval * (.65 + Math.random() * .7));
  }

  function updateMotion() {
    const running = !reducedMotion.matches && !paused && visible && !document.hidden;
    figure.classList.toggle('motion-on', !reducedMotion.matches);
    figure.classList.toggle('motion-paused', !running);
    toggle.hidden = reducedMotion.matches;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Resume motion ▷' : 'Pause motion Ⅱ';
    slots.forEach(slot => {
      if (!slot.animation) return;
      if (reducedMotion.matches) {
        slot.animation.cancel();
        slot.animation = null;
      } else if (running) {
        slot.animation.play();
      } else {
        slot.animation.pause();
      }
    });
    if (running && canAnimate && signalTimer === null) {
      sendSignal();
      scheduleSignal();
    } else if (!running && signalTimer !== null) {
      window.clearTimeout(signalTimer);
      signalTimer = null;
    }
  }
  toggle.addEventListener('click', () => { paused = !paused; updateMotion(); });
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', updateMotion);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      updateMotion();
    }).observe(figure);
  }
  updateMotion();

  const filters = document.querySelector('.filters');
  const buttons = Array.from(filters.querySelectorAll('button'));
  const papers = Array.from(document.querySelectorAll('.paper'));
  const status = document.getElementById('publication-status');
  function filterPapers(topic) {
    let count = 0;
    papers.forEach(paper => {
      paper.hidden = topic !== 'all' && !paper.dataset.topics.split(' ').includes(topic);
      if (!paper.hidden) count++;
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === topic)));
    status.textContent = `${count} selected publications shown.`;
  }
  buttons.forEach(button => button.addEventListener('click', () => filterPapers(button.dataset.filter)));
  document.querySelectorAll('[data-topic-link]').forEach(link => link.addEventListener('click', () => filterPapers(link.dataset.topicLink)));
  filters.hidden = false;
})();

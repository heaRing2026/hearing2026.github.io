'use strict';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  document.documentElement.classList.add('js-motion');
}
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '打开导航菜单');
  nav.classList.remove('open');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menuToggle.focus(); }
});
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
if ('IntersectionObserver' in window) {
  const activeObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) nav.querySelectorAll('a').forEach(link => {
      const active = link.hash === '#' + entry.target.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  }), { rootMargin: '-15% 0px -60% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => activeObserver.observe(section));
}
// A synthetic diagram illustrates scale normalization; it contains no recorded user data.
const points = [[140,53],[140,78],[104,93],[176,93],[82,132],[193,131],[100,160],[177,159],[119,160],[161,160],[114,203],[167,203],[109,242],[173,242]];
const bones = [[0,1],[1,2],[1,3],[2,3],[2,4],[4,6],[3,5],[5,7],[2,8],[3,9],[8,9],[8,10],[10,12],[9,11],[11,13]];
function drawSkeleton(target, scale) {
  const scaled = points.map(([x,y]) => [(x-140)*scale+140,(y-140)*scale+140]);
  let drawing = '<g class="skeleton-body">' + bones.map(([a,b]) => '<path d="M'+scaled[a].join(' ')+' L'+scaled[b].join(' ')+'"/>').join('') + '</g>';
  drawing += scaled.map(([x,y],i) => '<circle class="'+(i===0?'skeleton-anchor':'skeleton-node')+'" cx="'+x+'" cy="'+y+'" r="'+(i===0?5:4)+'"/>').join('');
  drawing += '<path d="M'+(scaled[0][0]-9)+' '+scaled[0][1]+'h18m-9 -9v18" stroke="#f5f3df" stroke-width="1"/>';
  target.innerHTML = drawing;
}
const distance = document.getElementById('distance');
function updateDiagram() {
  const distanceFactor = Number(distance.value) / 100;
  drawSkeleton(document.getElementById('raw-body'), 0.72 / distanceFactor);
  drawSkeleton(document.getElementById('normalized-body'), 0.72);
  document.getElementById('distance-value').textContent = distanceFactor.toFixed(2) + ' ×';
}
distance.addEventListener('input', updateDiagram);
updateDiagram();
const scenarios = {
  daily: ['你好，很高兴认识你。','Hello, nice to meet you.'],
  learning: ['老师，可以再解释一遍吗？','Could you explain that once more, please?'],
  service: ['你好，请帮我写下详细信息。','Hello, please write down the details for me.']
};
const speechStatus = document.getElementById('speech-status');
const speakButton = document.getElementById('speak-button');
const speakLabel = document.getElementById('speak-label');
const conversation = document.querySelector('.conversation');
let speaking = false;
let utterance = null;
let speechTimer = null;
function resetSpeech(message) {
  speaking = false;
  conversation.classList.remove('is-speaking');
  speakLabel.textContent = '播放这句话';
  clearTimeout(speechTimer);
  if (message) speechStatus.textContent = message;
}
function stopSpeech() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (utterance) { utterance.onend = null; utterance.onerror = null; }
  utterance = null;
  resetSpeech();
}
// Implement arrow-key navigation for both ARIA tab groups.
document.querySelectorAll('[role="tablist"]').forEach(list => {
  const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
  list.addEventListener('keydown', event => {
    const index = tabs.indexOf(document.activeElement);
    if (index < 0) return;
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); tabs[next].focus(); tabs[next].click();
  });
});
function selectTab(list, selected) {
  list.querySelectorAll('[role="tab"]').forEach(tab => {
    tab.setAttribute('aria-selected', String(tab === selected));
    tab.tabIndex = tab === selected ? 0 : -1;
  });
}
document.querySelectorAll('[data-scenario]').forEach(button => button.addEventListener('click', () => {
  stopSpeech();
  const [sentence,english] = scenarios[button.dataset.scenario];
  selectTab(button.parentElement, button);
  document.getElementById('scenario-panel').setAttribute('aria-labelledby', button.id);
  document.getElementById('example-sentence').textContent = sentence;
  document.getElementById('example-english').textContent = english;
  speechStatus.textContent = '语音由浏览器合成。无需上传个人数据。';
}));
speakButton.addEventListener('click', () => {
  if (speaking) { stopSpeech(); speechStatus.textContent = '语音已停止。'; return; }
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    speechStatus.textContent = '此浏览器暂不支持语音合成，可复制文字使用。'; return;
  }
  window.speechSynthesis.cancel();
  utterance = new SpeechSynthesisUtterance(document.getElementById('example-sentence').textContent);
  utterance.lang = 'zh-CN'; utterance.rate = 0.95;
  const voice = window.speechSynthesis.getVoices().find(item => /^zh(-|_)/i.test(item.lang));
  if (voice) utterance.voice = voice;
  speaking = true;
  speakLabel.textContent = '停止播放';
  conversation.classList.add('is-speaking');
  speechStatus.textContent = '正在请求浏览器语音播放…';
  utterance.onstart = () => { clearTimeout(speechTimer); speechStatus.textContent = '正在播放。'; };
  utterance.onend = () => resetSpeech('播放完成。');
  utterance.onerror = () => resetSpeech('语音暂不可用，可复制文字使用。');
  speechTimer = setTimeout(() => { stopSpeech(); speechStatus.textContent = '未能启动语音，请检查浏览器语音支持或复制文字。'; }, 12000);
  window.speechSynthesis.speak(utterance);
});
window.addEventListener('pagehide', stopSpeech);
document.getElementById('copy-sentence').addEventListener('click', async () => {
  try {
    if (!navigator.clipboard) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(document.getElementById('example-sentence').textContent);
    speechStatus.textContent = '文字已复制。';
  } catch {
    const selection = getSelection(); const range = document.createRange();
    range.selectNodeContents(document.getElementById('example-sentence'));
    selection.removeAllRanges(); selection.addRange(range);
    speechStatus.textContent = '已选中文字，请长按或使用 Ctrl+C 复制。';
  }
});
const results = {
  paper: {
    rows: [ ['原始关键点 · 3 层 Transformer','5,794','50.26%','74.20%'], ['＋头锚归一化 · 同一架构','5,794','70.94%','89.16%'], ['手部子流＋鲁棒增强 · 12 层 Transformer','5,766','69.93%','87.98%'] ],
    source: '来源：所提供论文 Table 1 与 CNSL-5s 实验；头锚数值与 v2 training_summary.json 一致。第三行使用不同子集与模型容量。'
  },
  v2: {
    rows: [ ['big5s_exo · 6 层 Transformer','5,766','76.85%','92.51%'], ['big5s_ego · 头部坐标变换合成版本','5,766','73.66%','90.89%'] ],
    source: '来源：v2 的 models_a100/big5s_exo 与 big5s_ego/training_summary.json（2026-10-10 核对）。约 12.97M 参数；ego 为坐标变换合成版本，不能视为真实第一人称泛化结果。与论文实验配置不同。'
  }
};
document.querySelectorAll('[data-results]').forEach(button => button.addEventListener('click', () => {
  selectTab(button.parentElement, button);
  document.getElementById('results-panel').setAttribute('aria-labelledby',button.id);
  const result = results[button.dataset.results];
  const body = document.getElementById('results-body'); body.replaceChildren();
  result.rows.forEach((row,index) => {
    const tr = document.createElement('tr');
    if (button.dataset.results === 'paper' && index === 1) tr.className = 'featured-row';
    row.forEach((value,column) => {
      const cell = document.createElement(column === 0 ? 'th' : 'td');
      if (column === 0) cell.scope = 'row';
      cell.textContent = value; tr.appendChild(cell);
    }); body.appendChild(tr);
  });
  document.getElementById('results-source').textContent = result.source;
}));

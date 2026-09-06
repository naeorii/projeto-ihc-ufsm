const CLASS_META = {
  mamifero: { label: 'Mamífero', plural: 'Mamíferos', color: '#9C4A2E' },
  ave: { label: 'Ave', plural: 'Aves', color: '#3E6E80' },
  reptil: { label: 'Réptil', plural: 'Répteis', color: '#A65D3A' },
  anfibio: { label: 'Anfíbio', plural: 'Anfíbios', color: '#4C6B3D' },
  inseto: { label: 'Inseto', plural: 'Insetos', color: '#6E8F5A' }
};

const ICONS = {
  mamifero: '<svg viewBox="0 0 64 64" fill="none" stroke="#565C4C" stroke-width="2"><ellipse cx="32" cy="38" rx="20" ry="14"/><circle cx="20" cy="24" r="7"/><path d="M14 19 L10 12 M26 19 L28 11"/><circle cx="46" cy="42" r="3" fill="#565C4C"/></svg>',
  ave: '<svg viewBox="0 0 64 64" fill="none" stroke="#565C4C" stroke-width="2"><path d="M12 40 C12 26 24 18 36 20 C48 22 54 30 52 34 C48 32 44 33 42 36 C46 38 48 42 46 46 C40 42 30 44 24 48 C18 50 12 48 12 40Z"/><path d="M52 34 L60 30 L54 38 Z"/><circle cx="40" cy="26" r="1.6" fill="#565C4C"/></svg>',
  reptil: '<svg viewBox="0 0 64 64" fill="none" stroke="#565C4C" stroke-width="2"><path d="M8 44 C16 30 20 46 28 38 C36 30 34 46 44 40 C50 36 54 30 58 24"/><circle cx="10" cy="42" r="4"/></svg>',
  anfibio: '<svg viewBox="0 0 64 64" fill="none" stroke="#565C4C" stroke-width="2"><ellipse cx="32" cy="38" rx="16" ry="12"/><circle cx="22" cy="24" r="5"/><circle cx="42" cy="24" r="5"/><circle cx="22" cy="24" r="1.6" fill="#565C4C"/><circle cx="42" cy="24" r="1.6" fill="#565C4C"/></svg>',
  inseto: '<svg viewBox="0 0 64 64" fill="none" stroke="#565C4C" stroke-width="2"><ellipse cx="32" cy="34" rx="6" ry="10"/><path d="M26 26 C14 16 10 26 20 30 M38 26 C50 16 54 26 44 30"/><circle cx="32" cy="20" r="4"/></svg>'
};

const posts = [
  { id: 'p1', author: 'Larissa Menezes', ai: 'LM', class: 'ave', species: 'João-de-barro', sci: 'Furnarius rufus', status: 'confirmed', loc: 'Entorno do RU', date: '2026-08-25', caption: 'Achei esse ninho de barro em cima do poste, e o dono não parava de cantar por perto!', comments: 2 },
  { id: 'p2', author: 'Sandra Oliveira', ai: 'SO', class: 'mamifero', species: 'Capivara', sci: 'Hydrochoerus hydrochaeris', status: 'confirmed', loc: 'Frente do CT', date: '2026-08-24', caption: 'Uma família inteira pastando na beira da lagoa hoje de manhã, com filhotinhos pequenos!', comments: 2 },
  { id: 'p3', author: 'Taiana dos Santos', ai: 'TS', class: 'reptil', species: null, sci: null, status: 'pending', loc: 'Bosque da UFSM', date: '2026-08-22', caption: 'Vi esse bicho atravessando a trilha rapidinho, alguém sabe o que é? Tinha uns 40cm.', comments: 1 }
];

let activeFilter = 'todos';
let searchTerm = '';

function fmtDate(date) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

function renderRail() {
  const rail = document.getElementById('railNav');
  const items = [['todos', 'Todos'], ...Object.entries(CLASS_META).map(([key, meta]) => [key, meta.plural]), ['pendentes', 'Pendentes']];
  rail.innerHTML = '<p class="rail-title">Explorar</p>' + items.map(([key, label]) => `
    ${key === 'pendentes' ? '<div class="rail-sep"></div>' : ''}
    <div class="rail-item ${activeFilter === key ? 'active' : ''}" data-filter="${key}"><span>○</span><span>${label}</span></div>`).join('');
  rail.querySelectorAll('.rail-item').forEach(item => item.addEventListener('click', () => {
    activeFilter = item.dataset.filter;
    render();
  }));
}

function renderFeed() {
  const term = searchTerm.trim().toLowerCase();
  const filtered = posts.filter(post => {
    const filterMatch = activeFilter === 'todos' || (activeFilter === 'pendentes' ? post.status === 'pending' : post.class === activeFilter);
    const text = `${post.species || ''} ${post.loc} ${post.caption}`.toLowerCase();
    return filterMatch && (!term || text.includes(term));
  });
  document.getElementById('countTag').textContent = `${filtered.length} avistamento${filtered.length === 1 ? '' : 's'}`;
  document.getElementById('feed').innerHTML = filtered.map(post => {
    const meta = CLASS_META[post.class];
    return `<article class="post">
      <div class="post-head"><div class="avatar">${post.ai}</div><div><div class="who">${post.author}</div><div class="meta">${fmtDate(post.date)} · ${post.loc}</div></div><span class="ribbon-tag" style="background:${meta.color};">${meta.label.toUpperCase()}</span></div>
      <div class="photo-frame">${post.photo ? `<img src="${post.photo}" alt="Registro de ${post.species || 'espécie não identificada'}">` : ICONS[post.class]}</div>
      <div class="post-body"><div class="species-row"><h3>${post.species || 'Espécie não identificada'}</h3>${post.sci ? `<span class="sci">${post.sci}</span>` : ''}<span class="badge ${post.status}">${post.status === 'confirmed' ? '✓ identificado' : 'aguardando identificação'}</span></div><div class="loc-line"><span>⌖ ${post.loc}</span><span>▣ ${fmtDate(post.date)}</span></div><p class="caption">${post.caption}</p></div>
      <div class="post-footer"><button type="button">◌ ${post.comments} comentário${post.comments === 1 ? '' : 's'}</button>${post.status === 'pending' ? '<button type="button" class="cta-help">Ajudar a identificar →</button>' : '<button type="button" style="margin-left:auto;">Ver conversa</button>'}</div>
    </article>`;
  }).join('');
  document.getElementById('emptyState').style.display = filtered.length ? 'none' : 'block';
}

function renderSidebar() {
  document.getElementById('statSpecies').textContent = new Set(posts.filter(post => post.status === 'confirmed').map(post => post.species)).size;
  document.getElementById('statPosts').textContent = posts.length;
  document.getElementById('statPending').textContent = posts.filter(post => post.status === 'pending').length;
}

function render() {
  renderRail();
  renderFeed();
  renderSidebar();
}

const addOverlay = document.getElementById('addOverlay');
function openAdd() {
  document.getElementById('newPostForm').reset();
  addOverlay.classList.add('open');
}

document.getElementById('searchInput').addEventListener('input', event => {
  searchTerm = event.target.value;
  renderFeed();
});
document.getElementById('openAddPost').addEventListener('click', openAdd);
document.getElementById('fabAdd').addEventListener('click', openAdd);
document.getElementById('closeAdd').addEventListener('click', () => addOverlay.classList.remove('open'));
document.getElementById('cancelAdd').addEventListener('click', () => addOverlay.classList.remove('open'));
addOverlay.addEventListener('click', event => { if (event.target === addOverlay) addOverlay.classList.remove('open'); });

document.getElementById('bellBtn').addEventListener('click', event => {
  event.stopPropagation();
  document.getElementById('notifPanel').classList.toggle('open');
});
document.addEventListener('click', () => document.getElementById('notifPanel').classList.remove('open'));

document.getElementById('newPostForm').addEventListener('submit', event => {
  event.preventDefault();
  const location = document.getElementById('ns-loc').value.trim();
  const error = document.getElementById('ns-error');
  if (!location) {
    error.classList.add('show');
    return;
  }
  error.classList.remove('show');
  posts.unshift({
    id: `p${Date.now()}`,
    author: 'Você',
    ai: 'EU',
    class: document.getElementById('ns-class').value,
    species: null,
    sci: null,
    status: 'pending',
    loc: location,
    date: document.getElementById('ns-date').value || new Date().toISOString().slice(0, 10),
    caption: document.getElementById('ns-caption').value.trim() || 'Novo avistamento registrado.',
    comments: 0,
  });
  addOverlay.classList.remove('open');
  activeFilter = 'todos';
  render();
});

render();

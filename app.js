(() => {
  const projects = window.PORTFOLIO;
  const modal = document.getElementById('project-dialog');
  const content = document.getElementById('case-content');
  let lastFocus = null;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function videoGallery(p) {
    if (!p.videos || !p.videos.length) return '';
    return `<section class="video-section" aria-labelledby="videos-title"><div class="video-section-head"><div><span class="video-intro">▷ SOUND ON / ${p.videos.length} LYRICAL VIDEOS</span><h3 id="videos-title">THE MOTION SIDE.</h3></div><p>Selected lyrical videos from Hai Junoon. Choose a track and press play.</p></div><div class="video-grid">${p.videos.map((v,i) => `<figure class="video-card"><video controls playsinline preload="none" poster="https://ik.imagekit.io/8lnetcpov/portfolio/${escape(v.poster)}" aria-label="${escape(v.title)} lyrical video"><source src="${escape(v.src)}" type="video/mp4">Your browser cannot play this video. <a href="${escape(v.src)}">Open the video</a>.</video><figcaption class="video-caption"><div><h4>${escape(v.title)}</h4><small>${String(i+1).padStart(2,'0')} / LYRIC VIDEO · ${Math.floor(v.duration/60)}:${String(v.duration%60).padStart(2,'0')}</small></div><a href="${escape(v.src)}" target="_blank" rel="noopener" aria-label="Open ${escape(v.title)} video">↗</a></figcaption></figure>`).join('')}</div></section>`;
  }
  function pauseVideos() { content.querySelectorAll('video').forEach(video => video.pause()); }
  function route() {
    pauseVideos();
    const id = location.hash.startsWith('#project/') ? location.hash.slice(9) : null;
    const index = projects.findIndex(p => p.id === id);
    if (index < 0) {
      if (modal.open) modal.close();
      document.body.style.overflow = '';
      document.title = 'Pritesh Mayekar — Art Director';
      return;
    }
    const p = projects[index];
    const next = projects[(index + 1) % projects.length];
    if (!modal.open) lastFocus = document.activeElement;
    content.innerHTML = `<article class="reveal"><header class="case-header"><div class="eyebrow">${String(index+1).padStart(2,'0')} / ${escape(p.type)}</div><h2 id="case-title">${escape(p.name)}</h2><p class="case-deck">${escape(p.tag)}</p></header><img class="case-hero" src="https://ik.imagekit.io/8lnetcpov/portfolio/assets/${p.hero}" alt="${escape(p.alt)}">${p.heroCaption ? `<p class="hero-credit">${escape(p.heroCaption)}</p>` : ''}<div class="case-details"><section><h3>THE CHALLENGE</h3><p>${escape(p.context)}</p></section><section><h3>THE DIRECTION</h3><p>${escape(p.approach)}</p>${p.pdf ? `<a class="pdf-link" href="https://ik.imagekit.io/8lnetcpov/portfolio/projects/${p.id}.pdf" target="_blank" rel="noopener">View the complete project PDF</a>` : ''}</section></div>${videoGallery(p)}<div class="case-gallery">${p.images.map(([image,caption,full]) => `<figure class="${full?'full':''}"><img loading="lazy" src="https://ik.imagekit.io/8lnetcpov/portfolio/assets/${image}" alt="${escape(caption)}"><figcaption>${escape(caption)}</figcaption></figure>`).join('')}</div><a class="case-next" href="#project/${next.id}"><small>NEXT PROJECT</small><span>${escape(next.name)} +</span></a></article>`;
    content.querySelectorAll('video').forEach(video => video.addEventListener('play', () => {
      content.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
    }));
    document.title = `${p.name} — Pritesh Mayekar`;
    document.body.style.overflow = 'hidden';
    if (!modal.open) modal.showModal();
    modal.scrollTop = 0;
  }
  function closeProject() {
    pauseVideos();
    history.replaceState(null, '', '#work');
    modal.close();
    document.body.style.overflow = '';
    document.title = 'Pritesh Mayekar — Art Director';
    if (lastFocus && lastFocus !== document.body) lastFocus.focus({preventScroll:true});
  }
  document.querySelector('.close-case').addEventListener('click', closeProject);
  modal.addEventListener('cancel', event => {event.preventDefault();closeProject();});
  window.addEventListener('hashchange', route);
  route();
})();
// Project discovery and lightweight motion.
(() => {
 const cards=[...document.querySelectorAll('.project[data-category]')];
 const filters=[...document.querySelectorAll('.filter')];
 filters.forEach(button=>button.addEventListener('click',()=>{
  filters.forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  let count=0;cards.forEach(card=>{card.hidden=button.dataset.filter!=='All work'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++;});
  document.getElementById('project-count').textContent=count+' PROJECTS';
 }));
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window){
  document.body.classList.add('js-motion');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('awaiting');observer.unobserve(entry.target);}}),{rootMargin:'0px 0px 100px 0px',threshold:.05});
  cards.forEach(card=>{card.classList.add('awaiting');observer.observe(card);});
 }
 const modal=document.getElementById('project-dialog');
 const progress=document.createElement('div');progress.className='case-progress';progress.setAttribute('aria-hidden','true');modal.prepend(progress);
 modal.addEventListener('scroll',()=>{const total=modal.scrollHeight-modal.clientHeight;progress.style.setProperty('--progress',total>0?`${modal.scrollTop/total*100}%`:'0%');},{passive:true});
})();

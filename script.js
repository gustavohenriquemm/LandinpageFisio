/* ============================================================
   SCRIPT.JS — Clínica Nova Fisio
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. NAVEGAÇÃO ATIVA NO SCROLL ──────────────────────────
  const navLinks = document.querySelectorAll('.nav a');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }
  window.addEventListener('scroll', updateActiveLink);


  // ── 2. HEADER SOMBRA NO SCROLL ───────────────────────────
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 24px rgba(0,0,0,0.10)'
      : '0 2px 16px rgba(0,0,0,0.06)';
  });


  // ── 3. MENU HAMBURGUER ───────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const nav       = document.querySelector('.nav');

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    const bars = hamburger.querySelectorAll('span');
    if (nav.classList.contains('open')) {
      bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });

  // Fechar menu ao clicar em link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    });
  });


  // ── 4. FAQ ACORDEÃO ──────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item     = btn.parentElement;
      const isOpen   = item.classList.contains('open');

      // Fecha todos
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
      document.querySelectorAll('.faq-question').forEach(q => q.setAttribute('aria-expanded', 'false'));

      // Abre o atual se estava fechado
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });


  // ── 5. ANIMAÇÃO DE ENTRADA (INTERSECTION OBSERVER) ───────
  const observerOptions = { threshold: 0.12 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Elementos a animar
  const animTargets = document.querySelectorAll(
    '.esp-card, .serv-card, .equipe-card, .depo-card, .passo, .stat-item, .faq-item'
  );
  animTargets.forEach((el, i) => {
    const delay = Math.min(i * 0.02, 0.25);
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = `opacity 0.35s ease ${delay}s, transform 0.35s ease ${delay}s`;
    observer.observe(el);
  });

  // Quando visível
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      .visible { opacity: 1 !important; transform: translateY(0) !important; }
    </style>
  `);


  // ── 6. CONTADOR ANIMADO (ESTATÍSTICAS) ───────────────────
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el      = entry.target;
        const text    = el.textContent;
        const suffix  = text.includes('+') ? '+' : '';
        const target  = parseInt(text.replace(/\D/g, ''), 10);
        const duration = 2000;
        const step    = Math.ceil(target / (duration / 16));
        let current   = 0;

        const tick = () => {
          current += step;
          if (current >= target) {
            el.textContent = target + suffix;
          } else {
            el.textContent = current + suffix;
            requestAnimationFrame(tick);
          }
        };
        tick();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));


  // ── 7. BUSCA — DESTAQUE DE ESPECIALIDADE ─────────────────
  const searchInput = document.querySelector('.search-bar input');
  const espCards    = document.querySelectorAll('.esp-card');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      espCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (q && text.includes(q)) {
          card.style.borderColor  = 'var(--accent)';
          card.style.background   = '#EAF3F6';
        } else {
          card.style.borderColor  = '';
          card.style.background   = '';
        }
      });
    });
  }


  // ── 8. BARRA DE PROGRESSO DE SCROLL ──────────────────────
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px;
    background: linear-gradient(to right, #7FAFBD, #4F8FA3);
    z-index: 9999; transition: width 0.1s linear; width: 0;
  `;
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const total  = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = (window.scrollY / total) * 100;
    progressBar.style.width = pct + '%';
  });


  // ── 9. BOTÃO VOLTAR AO TOPO ──────────────────────────────
  const backTop = document.createElement('button');
  backTop.innerHTML   = '<i class="fas fa-arrow-up"></i>';
  backTop.setAttribute('aria-label', 'Voltar ao topo');
  backTop.style.cssText = `
    position: fixed; bottom: 28px; right: 28px;
    width: 46px; height: 46px; border-radius: 50%;
    background: linear-gradient(135deg, #7FAFBD, #4F8FA3);
    color: #fff; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; box-shadow: 0 4px 16px rgba(79,143,163,0.4);
    z-index: 998; opacity: 0; transform: translateY(12px);
    transition: opacity 0.3s, transform 0.3s;
  `;
  document.body.appendChild(backTop);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backTop.style.opacity   = '1';
      backTop.style.transform = 'translateY(0)';
    } else {
      backTop.style.opacity   = '0';
      backTop.style.transform = 'translateY(12px)';
    }
  });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  // ── 10. FORMULÁRIO → WHATSAPP ────────────────────────────
  const contatoForm = document.getElementById('contatoForm');
  if (contatoForm) {
    contatoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome    = document.getElementById('cf-nome').value.trim();
      const tel     = document.getElementById('cf-tel').value.trim();
      const servico = document.getElementById('cf-servico').value;
      const msg     = document.getElementById('cf-msg').value.trim();

      const texto = [
        `Olá! Meu nome é *${nome}*.`,
        tel     ? `Meu telefone: *${tel}*`              : '',
        servico ? `Serviço de interesse: *${servico}*`  : '',
        msg     ? `Mensagem: ${msg}`                    : '',
      ].filter(Boolean).join('%0A');

      const numero = '5511999998888'; // ← troque pelo número real
      window.open(`https://wa.me/${numero}?text=${texto}`, '_blank');
    });
  }


  // ── 11. ABAS DA SEÇÃO CONTATO ────────────────────────────
  document.querySelectorAll('.contato-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active de todos
      document.querySelectorAll('.contato-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.contato-panel').forEach(p => p.classList.remove('active'));

      // Ativa o clicado
      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // ── 12. BOTÕES "AGENDAR CONSULTA" → ABA DO FORMULÁRIO ────
  document.querySelectorAll('.btn-agendar').forEach(btn => {
    btn.addEventListener('click', () => {
      // Garante que a aba do formulário esteja ativa
      document.querySelectorAll('.contato-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.contato-panel').forEach(p => p.classList.remove('active'));

      const tabForm = document.querySelector('.contato-tab[data-tab="form"]');
      const panelForm = document.getElementById('tab-form');
      if (tabForm) tabForm.classList.add('active');
      if (panelForm) panelForm.classList.add('active');
    });
  });

});

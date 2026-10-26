/* ═══════════════════════════════════════
   Portfolio Script — Killari Ganesh
   ═══════════════════════════════════════ */

/* ─── Navbar: scroll shadow + active link ─── */
const navbar = document.getElementById('navbar');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('main section[id]');

function updateNav() {
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 90) current = s.id;
  });
  navItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ─── Mobile hamburger ─── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ─── Role cycling ─── */
const roles = [
  'Full Stack Web Apps',
  'Real-Time Platforms',
  'AI-Powered Systems',
  'Distributed Backends',
  'Electron Desktop Apps',
];
let roleIndex = 0;
const roleCycling = document.getElementById('roleCycling');
if (roleCycling) {
  setInterval(() => {
    roleCycling.style.opacity = '0';
    setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleCycling.textContent = roles[roleIndex];
      roleCycling.style.opacity = '1';
    }, 300);
  }, 2800);
}

/* ─── Scroll-in animations ─── */
const aosElements = document.querySelectorAll('[data-aos]');
const aosObs = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('aos-visible');
        aosObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
aosElements.forEach(el => aosObs.observe(el));

/* ─── Stats counter ─── */
const counters = document.querySelectorAll('.stat-val[data-target]');
const counterObs = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target, 10);
      const start  = performance.now();
      const dur    = 1500;

      function step(now) {
        const progress = Math.min((now - start) / dur, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      counterObs.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
counters.forEach(c => counterObs.observe(c));

/* ─── Resume Modal ─── */
function openModal(id)  {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); el.removeAttribute('aria-hidden'); }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); }
}

document.getElementById('heroResumeBtn')?.addEventListener('click', () => openModal('resumeModal'));
document.getElementById('navResumeBtn')?.addEventListener('click',  () => openModal('resumeModal'));

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});
document.getElementById('resumeModal')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal('resumeModal');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal('resumeModal');
});

/* ─── Toast ─── */
const toastArea = document.getElementById('toastArea');

function showToast(msg, type = 'success', duration = 3500) {
  const icons = {
    success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3fb950" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f85149" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    info:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `${icons[type] || ''}<span>${msg}</span>`;
  toastArea.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(30px)';
    t.style.transition = '0.3s ease';
    setTimeout(() => t.remove(), 300);
  }, duration);
}

/* ─── Copy buttons ─── */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async e => {
    e.preventDefault(); e.stopPropagation();
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!', 'success');
    } catch {
      showToast('Copy failed. Please copy manually.', 'error');
    }
  });
});

/* ─── Contact Form ─── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'fname',    errId: 'err-name',    check: v => v.trim().length >= 2 },
      { id: 'femail',   errId: 'err-email',   check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id: 'fsubject', errId: 'err-subject',  check: v => v.trim().length >= 2 },
      { id: 'fmessage', errId: 'err-message',  check: v => v.trim().length >= 10 },
    ];

    fields.forEach(({ id, errId, check }) => {
      const input = document.getElementById(id);
      const err   = document.getElementById(errId);
      const ok    = check(input.value);
      input.classList.toggle('invalid', !ok);
      err.classList.toggle('visible', !ok);
      if (!ok) valid = false;
    });

    if (!valid) return;

    const btn      = document.getElementById('formSubmitBtn');
    const statusEl = document.getElementById('formStatus');
    const name     = document.getElementById('fname').value.trim();
    const email    = document.getElementById('femail').value.trim();
    const subject  = document.getElementById('fsubject').value.trim();
    const message  = document.getElementById('fmessage').value.trim();

    const originalBtnHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Sending message...`;
    if (statusEl) statusEl.style.display = 'none';

    (async () => {
      try {
        const response = await fetch('https://formsubmit.co/ajax/ganeshkillari7624@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: `Portfolio Inquiry from ${name}: ${subject}`,
            message: message,
            _captcha: false
          })
        });

        const data = await response.json();

        if (data.success === 'true' || response.ok) {
          form.reset();
          if (statusEl) {
            statusEl.className = 'form-status success';
            statusEl.innerHTML = `<strong>Message Sent Successfully!</strong> Thank you, ${name}. Your message has been delivered to Ganesh. You will receive a response at <em>${email}</em>.`;
            statusEl.style.display = 'block';
          }
          showToast('Message sent successfully! Ganesh will get back to you soon.', 'success', 5000);
        } else if (data.message && data.message.toLowerCase().includes('activation')) {
          form.reset();
          if (statusEl) {
            statusEl.className = 'form-status success';
            statusEl.innerHTML = `<strong>Message Registered!</strong> An activation notice was sent to <em>ganeshkillari7624@gmail.com</em> to confirm receipt.`;
            statusEl.style.display = 'block';
          }
          showToast('Message submitted! Notification sent to Ganesh.', 'success', 5000);
        } else {
          throw new Error(data.message || 'Error sending message');
        }
      } catch (err) {
        if (statusEl) {
          statusEl.className = 'form-status error';
          const mailtoFallback = `mailto:ganeshkillari7624@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} <${email}>\n\n${message}`)}`;
          statusEl.innerHTML = `Submission encountered an issue. You can <a href="${mailtoFallback}" target="_blank" style="text-decoration:underline; font-weight:600; color:inherit;">click here to email Ganesh directly</a> or call <a href="tel:+919347561849" style="text-decoration:underline; font-weight:600; color:inherit;">+91 93475 61849</a>.`;
          statusEl.style.display = 'block';
        }
        showToast('Could not complete submission. Direct email link available.', 'error', 6000);
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalBtnHtml;
      }
    })();
  });

  // Live validation clear
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      const errId = 'err-' + input.id.replace('f', '');
      const errEl = document.getElementById(errId);
      if (errEl) errEl.classList.remove('visible');
    });
  });
}

/* ─── Projects Carousel ─── */
const scrollTrack = document.getElementById('projectsScrollTrack');
const prevBtn     = document.getElementById('prevProjectsBtn');
const nextBtn     = document.getElementById('nextProjectsBtn');
const dots        = document.querySelectorAll('#carouselDots .dot');
const counterEl   = document.getElementById('carouselCounter');

if (scrollTrack && prevBtn && nextBtn) {
  const cards = Array.from(scrollTrack.querySelectorAll('.project-card'));
  let activeIndex = 0;
  let isTicking = false;

  // Calculate target scrollLeft for any card index
  function getTargetScrollLeft(index) {
    if (!cards[index]) return 0;
    const maxScroll = Math.max(0, scrollTrack.scrollWidth - scrollTrack.clientWidth);
    if (index >= cards.length - 1) {
      return maxScroll;
    }
    if (index <= 0) {
      return 0;
    }
    const cardLeft = cards[index].offsetLeft - scrollTrack.offsetLeft;
    return Math.min(Math.max(0, cardLeft), maxScroll);
  }

  function scrollToCard(index, smooth = true) {
    const targetLeft = getTargetScrollLeft(index);
    scrollTrack.scrollTo({
      left: targetLeft,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }

  // Update active dot, counter, and button disabled states without layout thrashing
  function updateActiveState() {
    if (!cards.length) return;
    const maxScroll = Math.max(0, scrollTrack.scrollWidth - scrollTrack.clientWidth);
    const scrollLeft = scrollTrack.scrollLeft;

    let newIndex = 0;
    if (maxScroll > 0 && scrollLeft >= maxScroll - 20) {
      newIndex = cards.length - 1;
    } else if (scrollLeft <= 20) {
      newIndex = 0;
    } else {
      let closestDist = Infinity;
      const trackOffset = scrollTrack.offsetLeft;
      cards.forEach((card, i) => {
        const cardOffset = card.offsetLeft - trackOffset;
        const dist = Math.abs(cardOffset - scrollLeft);
        if (dist < closestDist) {
          closestDist = dist;
          newIndex = i;
        }
      });
    }

    activeIndex = newIndex;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
    if (counterEl) {
      counterEl.textContent = `0${activeIndex + 1} / 0${cards.length}`;
    }

    // Update navigation buttons
    const atStart = scrollLeft <= 8;
    const atEnd = maxScroll > 0 && scrollLeft >= maxScroll - 8;
    prevBtn.classList.toggle('disabled', atStart);
    nextBtn.classList.toggle('disabled', atEnd);
    prevBtn.setAttribute('aria-disabled', atStart ? 'true' : 'false');
    nextBtn.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
  }

  // Navigation button handlers
  prevBtn.addEventListener('click', () => {
    if (activeIndex > 0) {
      scrollToCard(activeIndex - 1);
    } else {
      scrollToCard(0);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (activeIndex < cards.length - 1) {
      scrollToCard(activeIndex + 1);
    } else {
      scrollToCard(cards.length - 1);
    }
  });

  // Dots click navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      scrollToCard(index);
    });
  });

  // Passive, RAF-throttled scroll listener for 60/120fps performance
  scrollTrack.addEventListener('scroll', () => {
    if (!isTicking) {
      requestAnimationFrame(() => {
        updateActiveState();
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  // Update on resize
  window.addEventListener('resize', () => {
    updateActiveState();
  }, { passive: true });

  // Initial state setup
  updateActiveState();

  // Desktop Mouse Grab-to-Scroll
  let isDown = false;
  let startX = 0;
  let scrollLeftStart = 0;
  let dragDistance = 0;

  scrollTrack.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Only primary mouse button
    isDown = true;
    dragDistance = 0;
    startX = e.pageX;
    scrollLeftStart = scrollTrack.scrollLeft;
    scrollTrack.classList.add('is-dragging');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const dx = e.pageX - startX;
    dragDistance += Math.abs(dx);
    scrollTrack.scrollLeft = scrollLeftStart - dx;
  });

  const stopDrag = () => {
    if (!isDown) return;
    isDown = false;
    scrollTrack.classList.remove('is-dragging');
    if (dragDistance > 10) {
      setTimeout(() => {
        updateActiveState();
      }, 60);
    }
  };

  window.addEventListener('mouseup', stopDrag);

  // Suppress link click if user was dragging
  scrollTrack.addEventListener('click', (e) => {
    if (dragDistance > 10) {
      e.preventDefault();
      e.stopPropagation();
      dragDistance = 0;
    }
  }, true);

  // Keyboard navigation when track has focus
  scrollTrack.setAttribute('tabindex', '0');
  scrollTrack.setAttribute('role', 'region');
  scrollTrack.setAttribute('aria-label', 'Projects Carousel');
  scrollTrack.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextBtn.click();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevBtn.click();
    }
  });
}

/* ─── Back to Top ─── */
document.getElementById('backTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── Add data-aos to sections ─── */
document.querySelectorAll('.section .container > *:not(.section-label):not(.section-title):not(.section-sub)').forEach((el, i) => {
  if (!el.hasAttribute('data-aos')) {
    el.setAttribute('data-aos', 'fade-up');
    el.style.transitionDelay = `${i * 60}ms`;
    aosObs.observe(el);
  }
});

// Only run on non-touch devices
if (window.matchMedia('(hover: hover)').matches) {

  // Create glow element only
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });

  // Suppress glow over navbar
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.addEventListener('mouseenter', () => glow.style.opacity = '0');
    navbar.addEventListener('mouseleave', () => glow.style.opacity = '1');
  }

  // Intensify on interactive elements
  const interactives = document.querySelectorAll('a, button, .card, [class*="btn"]');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => glow.classList.add('glow-active'));
    el.addEventListener('mouseleave', () => glow.classList.remove('glow-active'));
  });

  // Fade on window leave/enter
  document.addEventListener('mouseleave', () => glow.style.opacity = '0');
  document.addEventListener('mouseenter', () => glow.style.opacity = '1');
}

// Mobile tap burst — suppressed inside navbar
const navbarEl = document.getElementById('navbar');
document.addEventListener('touchstart', (e) => {
  Array.from(e.touches).forEach(touch => {
    if (navbarEl && navbarEl.contains(touch.target)) return;
    const burst = document.createElement('div');
    burst.className = 'tap-burst';
    burst.style.left = touch.clientX + 'px';
    burst.style.top = touch.clientY + 'px';
    document.body.appendChild(burst);
    burst.addEventListener('animationend', () => burst.remove());
  });
}, { passive: true });

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function setupMotion(root: HTMLElement) {
  const media = gsap.matchMedia();
  const styles = getComputedStyle(root);
  const token = (name: string, fallback: number) => parseFloat(styles.getPropertyValue(name)) || fallback;
  try {
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const distance = Math.min(window.innerWidth < 640 ? 12 : 24, token('--motion-distance', 24));
      const duration = token('--motion-duration', .7);
      const ease = styles.getPropertyValue('--motion-ease').trim() || 'power2.out';
      const hero = root.querySelectorAll('[data-hero-reveal]');
      if (hero.length) gsap.from(hero, {
        y: distance, duration, ease, stagger: token('--motion-stagger', .1), clearProps: 'transform',
      });
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
        // Never hide content while waiting for scroll or a failed script.
        gsap.from(element, {
          y: distance, duration, ease, clearProps: 'transform',
          scrollTrigger: { trigger: element, start: 'top 92%', once: true },
        });
      });
    }, root);
  } catch (error) {
    media.revert();
    throw error;
  }
  return () => media.revert();
}

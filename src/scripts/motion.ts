import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Opt-in, scoped motion. Static HTML and native scrolling remain the baseline. */
export function setupMotion(root: HTMLElement) {
  const media = gsap.matchMedia();
  const revealed = new WeakSet<HTMLElement>();
  const styles = getComputedStyle(root);
  const token = (name: string, fallback: number) => {
    const value = Number.parseFloat(styles.getPropertyValue(name));
    return Number.isFinite(value) ? value : fallback;
  };

  try {
    media.add({
      desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
    }, context => {
      const mobile = Boolean(context.conditions?.mobile);
      const distance = Math.min(mobile ? 14 : 22, token('--motion-distance', 22));
      const duration = Math.max(.1, token('--motion-duration', .7));
      const ease = styles.getPropertyValue('--motion-ease').trim() || 'power3.out';
      const records: { targets: HTMLElement[]; tween: gsap.core.Tween }[] = [];
      const claimed = new Set<HTMLElement>();
      let disposed = false;
      let driftCount = 0;

      const addReveal = (elements: HTMLElement[], trigger: HTMLElement) => {
        const targets = elements.filter(element => {
          if (claimed.has(element) || revealed.has(element)) return false;
          claimed.add(element);
          const rect = element.getBoundingClientRect();
          if (!rect.width || !rect.height) return false;
          // Never make visible or previously passed content disappear during startup.
          if (rect.top < window.innerHeight) {
            revealed.add(element);
            return false;
          }
          return true;
        });
        if (!targets.length) return;

        const stagger = targets.length > 1
          ? Math.min(token('--motion-stagger', .08), .4 / (targets.length - 1))
          : 0;
        const tween = gsap.fromTo(targets,
          { y: distance, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration,
            ease,
            stagger,
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger, start: 'top 88%', once: true },
            onComplete: () => { targets.forEach(element => revealed.add(element)); },
          },
        );
        records.push({ targets, tween });
      };

      root.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach(group => {
        addReveal([...group.children].filter((element): element is HTMLElement =>
          element instanceof HTMLElement && !element.matches('script,style,template'),
        ), group);
      });
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
        // A marked parent already supplies this element's entrance.
        if (element.parentElement?.closest('[data-reveal], [data-reveal-group]')) return;
        addReveal([element], element);
      });

      root.querySelectorAll<HTMLElement>('[data-scroll-drift]').forEach(element => {
        if (!element.getBoundingClientRect().height || claimed.has(element)) return;
        driftCount++;
        gsap.fromTo(element, { y: mobile ? 8 : 18 }, {
          y: mobile ? -6 : -12,
          ease: 'none',
          scrollTrigger: {
            trigger: element.parentElement || element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: .65,
            invalidateOnRefresh: true,
          },
        });
      });

      const revealTarget = (target: Element | null) => {
        if (!target || !root.contains(target)) return;
        records.forEach(({ targets, tween }) => {
          if (!targets.some(element => element === target || element.contains(target) || target.contains(element))) return;
          // Keyboard and anchor users reach usable content immediately.
          tween.progress(1);
          tween.scrollTrigger?.kill();
        });
      };
      const hashTarget = (hash: string) => {
        try { return hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null; }
        catch { return null; }
      };
      const onHashChange = () => revealTarget(hashTarget(window.location.hash));
      const onFocus = (event: FocusEvent) => revealTarget(event.target instanceof Element ? event.target : null);
      const onAnchorClick = (event: MouseEvent) => {
        if (!(event.target instanceof Element)) return;
        const link = event.target.closest<HTMLAnchorElement>('a[href]');
        if (!link) return;
        const url = new URL(link.href, window.location.href);
        if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search) {
          revealTarget(hashTarget(url.hash));
        }
      };

      root.addEventListener('focusin', onFocus);
      document.addEventListener('click', onAnchorClick, true);
      window.addEventListener('hashchange', onHashChange);
      onHashChange();
      root.dataset.motionState = 'active';
      root.dataset.motionRevealCount = String(records.length);
      root.dataset.motionDriftCount = String(driftCount);
      // Self-hosted fonts can settle after the deferred module arrives.
      void document.fonts?.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });

      return () => {
        disposed = true;
        root.removeEventListener('focusin', onFocus);
        document.removeEventListener('click', onAnchorClick, true);
        window.removeEventListener('hashchange', onHashChange);
        delete root.dataset.motionRevealCount;
        delete root.dataset.motionDriftCount;
      };
    }, root);
  } catch (error) {
    media.revert();
    root.dataset.motionState = 'static';
    throw error;
  }

  return () => {
    media.revert();
    root.dataset.motionState = 'static';
  };
}

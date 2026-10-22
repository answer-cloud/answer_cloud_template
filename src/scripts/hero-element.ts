import type { SceneController } from './hero-scene';

// The element owns lifecycle; the large Three.js module is fetched only when needed.
export class HeroSceneElement extends HTMLElement {
  private scene?: SceneController;
  private observer?: IntersectionObserver;
  private reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  private visible = false;
  private paused = false;
  private generation = 0;
  private loading = false;
  private failed = false;

  connectedCallback() {
    this.reduced.addEventListener('change', this.sync);
    document.addEventListener('visibilitychange', this.sync);
    this.querySelector('button')?.addEventListener('click', this.toggle);
    this.observer = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      void this.sync();
    });
    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.generation++;
    this.loading = false;
    this.observer?.disconnect();
    this.reduced.removeEventListener('change', this.sync);
    document.removeEventListener('visibilitychange', this.sync);
    this.querySelector('button')?.removeEventListener('click', this.toggle);
    this.clear();
  }

  private clear() {
    this.scene?.dispose();
    this.scene = undefined;
    this.dataset.state = 'static';
    this.dataset.running = 'false';
    const button = this.querySelector('button');
    if (button) button.hidden = true;
  }

  private toggle = () => {
    this.paused = !this.paused;
    const button = this.querySelector('button')!;
    button.textContent = this.paused ? 'Resume motion' : 'Pause motion';
    button.setAttribute('aria-pressed', String(this.paused));
    void this.sync();
  };

  private sync = async () => {
    if (!this.isConnected) return;
    if (this.reduced.matches || this.dataset.animated === 'false') {
      this.generation++;
      this.loading = false;
      this.clear();
      return;
    }
    const active = this.visible && !document.hidden;
    if (!this.scene && !this.loading && !this.failed && active) {
      this.loading = true;
      const generation = ++this.generation;
      try {
        const { createHeroScene } = await import('./hero-scene');
        if (generation !== this.generation || !this.isConnected) return;
        this.scene = createHeroScene(this, () => {
          this.failed = true;
          this.clear();
          this.dataset.state = 'fallback';
        });
        this.dataset.state = 'ready';
        this.querySelector('button')!.hidden = false;
      } catch {
        if (generation === this.generation) {
          this.failed = true;
          this.clear();
          this.dataset.state = 'fallback';
        }
      } finally {
        if (generation === this.generation) this.loading = false;
      }
    }
    // Visibility may have changed while the import was pending.
    const running = !!this.scene && this.visible && !document.hidden && !this.paused;
    this.scene?.setRunning(running);
    this.dataset.running = String(running);
  };
}

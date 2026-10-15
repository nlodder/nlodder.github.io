// Media viewer -- opens a project's scroller in the glass panel with zoom + pan
function initViewer(viewer) {
    if (!viewer) return null;


    const stage = viewer.querySelector('.viewer-stage');
    const canvas = viewer.querySelector('.viewer-canvas');
    const titleEl = viewer.querySelector('.viewer-title');
    const captionEl = viewer.querySelector('.viewer-caption');
    const counterEl = viewer.querySelector('.viewer-counter');
    const dotsEl = viewer.querySelector('.viewer-dots');
    const prevBtn = viewer.querySelector('.viewer-nav.prev');
    const nextBtn = viewer.querySelector('.viewer-nav.next');
    const closeBtn = viewer.querySelector('.viewer-close');

    const MIN_SCALE = 1;
    const MAX_SCALE = 6;

    let gallery = [];
    let index = 0;
    let lastFocus = null;
    let scale = 1, tx = 0, ty = 0;

    // A. Transform helpers
    const apply = () => {
        canvas.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
        stage.classList.toggle('is-zoomed', scale > 1.01);
    };

    // Keeps the media from being dragged off the stage
    const clampPan = () => {
        const media = canvas.firstElementChild;
        if (!media) return;
        const bounds = stage.getBoundingClientRect();
        const maxX = Math.max(0, (media.clientWidth * scale - bounds.width) / 2);
        const maxY = Math.max(0, (media.clientHeight * scale - bounds.height) / 2);
        tx = Math.min(maxX, Math.max(-maxX, tx));
        ty = Math.min(maxY, Math.max(-maxY, ty));
    };

    const resetView = () => {
        scale = 1;
        tx = 0;
        ty = 0;
        apply();
    };

    // Pointer position relative to the centre of the stage
    const stagePoint = (clientX, clientY) => {
        const bounds = stage.getBoundingClientRect();
        return [clientX - bounds.left - bounds.width / 2, clientY - bounds.top - bounds.height / 2];
    };

    // Zooms toward a point so it stays put under the cursor
    const zoomTo = (target, px, py) => {
        const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, target));
        if (next === scale) return;
        tx = px - (px - tx) * (next / scale);
        ty = py - (py - ty) * (next / scale);
        scale = next;
        if (scale === MIN_SCALE) { tx = 0; ty = 0; }
        clampPan();
        apply();
    };

    // B. Rendering
    const render = () => {
        const item = gallery[index];
        canvas.innerHTML = '';

        let media;
        if (item.type === 'video') {
            media = document.createElement('video');
            media.controls = true;
            media.autoplay = true;
            media.loop = true;
            media.muted = true;
            media.playsInline = true;
            if (item.poster) media.poster = item.poster;
            item.sources.forEach((entry) => {
                const source = document.createElement('source');
                source.src = entry.src;
                source.type = entry.type;
                media.appendChild(source);
            });
        } else {
            media = document.createElement('img');
            media.src = item.src;
            media.alt = item.alt;
        }

        canvas.appendChild(media);
        captionEl.textContent = item.caption;
        counterEl.textContent = `${index + 1} / ${gallery.length}`;
        dotsEl.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('active', i === index));
        resetView();
    };

    const go = (delta) => {
        if (gallery.length < 2) return;
        index = (index + delta + gallery.length) % gallery.length;
        render();
    };

    const buildDots = () => {
        dotsEl.innerHTML = '';
        if (gallery.length < 2) return;
        gallery.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.addEventListener('click', () => { index = i; render(); });
            dotsEl.appendChild(dot);
        });
    };

    // C. Open / close
    const openViewer = (items, start, title, trigger) => {
        gallery = items;
        index = start;
        lastFocus = trigger;
        titleEl.textContent = title;
        prevBtn.disabled = nextBtn.disabled = items.length < 2;
        buildDots();
        render();
        viewer.classList.add('is-open');
        viewer.setAttribute('aria-hidden', 'false');
        document.body.classList.add('viewer-open');
        closeBtn.focus();
    };

    const closeViewer = () => {
        viewer.classList.remove('is-open');
        viewer.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('viewer-open');
        canvas.innerHTML = ''; // Stops any playing video
        if (lastFocus) lastFocus.focus();
    };

    const isOpen = () => viewer.classList.contains('is-open');

    closeBtn.addEventListener('click', closeViewer);
    viewer.querySelector('.viewer-scrim').addEventListener('click', closeViewer);
    prevBtn.addEventListener('click', () => go(-1));
    nextBtn.addEventListener('click', () => go(1));

    document.addEventListener('keydown', (evt) => {
        if (!isOpen()) return;
        if (evt.key === 'Escape') closeViewer();
        else if (evt.key === 'ArrowRight') go(1);
        else if (evt.key === 'ArrowLeft') go(-1);
        else if (evt.key === '0') resetView();
    });

    // D. Zoom -- wheel and trackpad pinch both arrive here
    stage.addEventListener('wheel', (evt) => {
        evt.preventDefault();
        const [px, py] = stagePoint(evt.clientX, evt.clientY);
        zoomTo(scale * Math.exp(-evt.deltaY * 0.0022), px, py);
    }, { passive: false });

    stage.addEventListener('dblclick', (evt) => {
        const [px, py] = stagePoint(evt.clientX, evt.clientY);
        if (scale > 1.01) resetView();
        else zoomTo(2.5, px, py);
    });

    // E. Drag to pan, two-finger pinch, swipe to navigate
    const pointers = new Map();
    let panStart = null;
    let pinchStart = null;

    stage.addEventListener('pointerdown', (evt) => {
        if (evt.target.closest('.viewer-nav')) return;
        // Leave native video controls alone until the media is zoomed
        if (evt.target.tagName === 'VIDEO' && scale <= 1.01) return;

        stage.setPointerCapture(evt.pointerId);
        pointers.set(evt.pointerId, evt);

        if (pointers.size === 1) {
            panStart = { x: evt.clientX, y: evt.clientY, tx, ty };
            stage.classList.add('is-panning');
        } else if (pointers.size === 2) {
            const [a, b] = [...pointers.values()];
            pinchStart = { dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), scale };
        }
    });

    stage.addEventListener('pointermove', (evt) => {
        if (!pointers.has(evt.pointerId)) return;
        pointers.set(evt.pointerId, evt);

        if (pointers.size === 2 && pinchStart) {
            const [a, b] = [...pointers.values()];
            const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
            const [px, py] = stagePoint((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2);
            zoomTo(pinchStart.scale * (dist / pinchStart.dist), px, py);
            return;
        }

        if (panStart && scale > 1.01) {
            tx = panStart.tx + (evt.clientX - panStart.x);
            ty = panStart.ty + (evt.clientY - panStart.y);
            clampPan();
            apply();
        }
    });

    const endPointer = (evt) => {
        if (!pointers.has(evt.pointerId)) return;

        // A horizontal flick moves through the gallery when not zoomed
        if (pointers.size === 1 && panStart && scale <= 1.01) {
            const dx = evt.clientX - panStart.x;
            if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
        }

        pointers.delete(evt.pointerId);
        if (pointers.size < 2) pinchStart = null;
        if (pointers.size === 0) {
            panStart = null;
            stage.classList.remove('is-panning');
        }
    };
    stage.addEventListener('pointerup', endPointer);
    stage.addEventListener('pointercancel', endPointer);

    // F. Wire each project's scroller to the viewer
    const attach = (block) => {
        const scroller = block.querySelector('.media-scroller');
        if (!scroller) return;

        const title = block.querySelector('.project-header')?.textContent.trim() ?? '';
        const figures = [...scroller.querySelectorAll('.media-item')];

        const items = figures.map((figure) => {
            const video = figure.querySelector('video');
            const image = figure.querySelector('img');
            const caption = figure.querySelector('figcaption')?.textContent.trim() ?? '';

            if (video) {
                return {
                    type: 'video',
                    poster: video.getAttribute('poster'),
                    sources: [...video.querySelectorAll('source')].map((s) => ({ src: s.src, type: s.type })),
                    caption
                };
            }
            return { type: 'image', src: image?.src, alt: image?.alt ?? '', caption };
        });

        figures.forEach((figure, i) => {
            // Expand affordance is added here so the markup stays clean
            const badge = document.createElement('span');
            badge.className = 'media-expand';
            badge.innerHTML = '<i class="fa-solid fa-up-right-and-down-left-from-center"></i>';
            figure.appendChild(badge);

            figure.setAttribute('role', 'button');
            figure.setAttribute('tabindex', '0');
            figure.setAttribute('aria-label', 'Open media viewer');

            // Only counts as a click if the scroller was not being dragged
            let downX = 0, downY = 0;
            figure.addEventListener('pointerdown', (evt) => {
                downX = evt.clientX;
                downY = evt.clientY;
            });
            figure.addEventListener('click', (evt) => {
                if (Math.hypot(evt.clientX - downX, evt.clientY - downY) > 6) return;
                openViewer(items, i, title, figure);
            });
            figure.addEventListener('keydown', (evt) => {
                if (evt.key === 'Enter' || evt.key === ' ') {
                    evt.preventDefault();
                    openViewer(items, i, title, figure);
                }
            });
        });
    };

    return { attach };
}

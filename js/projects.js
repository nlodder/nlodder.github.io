// Renders data/projects.js into project blocks, and runs each block's scroller
const el = (tag, className, html) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
};

const renderMedia = (item, i) => {
    const figure = el('figure', 'media-item');

    if (item.type === 'video') {
        const video = el('video');
        video.setAttribute('autoplay', '');
        video.setAttribute('loop', '');
        video.setAttribute('playsinline', '');
        video.muted = true;
        video.setAttribute('muted', '');
        if (item.poster) video.setAttribute('poster', item.poster);
        const source = el('source');
        source.src = item.src;
        source.type = item.mime ?? 'video/mp4';
        video.append(source, 'Your browser does not support the video tag.');
        figure.appendChild(video);
    } else {
        const img = el('img');
        img.src = item.src;
        img.alt = item.alt ?? item.caption;
        img.loading = 'lazy';
        figure.appendChild(img);
    }

    const caption = el('figcaption');
    caption.textContent = `${i + 1}. ${item.caption}`;
    figure.appendChild(caption);
    return figure;
};

const renderPills = (className, headerClass, label, items) => {
    const ul = el('ul', className);
    ul.appendChild(el('li', headerClass, label));
    items.forEach((text) => ul.appendChild(el('li', '', text)));
    return ul;
};

function renderProject(project) {
    const block = el('section', 'project-block');

    // Media: scroller + dots (one dot per item)
    const media = el('div', 'project-media');
    const scroller = el('div', 'media-scroller');
    project.media.forEach((item, i) => scroller.appendChild(renderMedia(item, i)));
    const dots = el('div', 'scroller-dots');
    project.media.forEach((_, i) => dots.appendChild(el('span', i === 0 ? 'dot active' : 'dot')));
    media.append(scroller, dots);

    // Info: heading, pills, summary, optional details
    const info = el('div', 'project-info');
    const heading = el('h2', 'project-header');
    heading.textContent = project.title;
    info.appendChild(heading);
    if (project.tools?.length) info.appendChild(renderPills('project-tools', 'project-tool-header', 'Tools', project.tools));
    if (project.skills?.length) info.appendChild(renderPills('project-skills', 'project-skill-header', 'Skills', project.skills));
    info.appendChild(el('p', 'project-summary', project.summary));

    if (project.details) {
        block.classList.add('has-details');
        info.appendChild(el('p', 'project-hint expand-hint', '<i class="fa-solid fa-chevron-down"></i> Click to expand for details'));

        const details = el('div', 'project-details');
        (project.links ?? []).forEach((link) => {
            const a = el('a', 'social-link', `<i class="${link.icon ?? 'fa-brands fa-github'}"></i>`);
            a.href = link.href;
            a.target = '_blank';
            const label = el('span');
            label.textContent = link.label;
            a.appendChild(label);
            details.appendChild(a);
        });
        details.appendChild(el('p', 'project-description', project.details));
        details.appendChild(el('p', 'project-hint collapse-hint', '<i class="fa-solid fa-chevron-up"></i> Click to collapse'));
        info.appendChild(details);
    }

    block.append(media, info);
    return block;
}

// Horizontal media scroller: dot navigation, stepped wheel scrolling, dot sync
function initScroller(block) {
    const scroller = block.querySelector('.media-scroller');
    if (!scroller) return;

    let isScrolling = false;
    let queuedDirection = 0; // Remembers intent that arrives mid-animation instead of dropping it
    const container = scroller.closest('.project-media');
    const dotsContainer = container?.querySelector('.scroller-dots');
    const items = scroller.querySelectorAll('.media-item');

    // Helper to get exact scroll distance between items
    const getScrollStep = () => {
        if (items.length <= 1) return scroller.clientWidth;
        return items[1].offsetLeft - items[0].offsetLeft;
    };

    // A. Click on dots to jump to image
    if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                scroller.scrollTo({
                    left: i * getScrollStep(),
                    behavior: 'smooth'
                });
            });
        });
    }

    // B. Wheel Scroll Logic (Desktop)
    // Steps one item per animation, queuing the latest direction that
    // arrives mid-scroll instead of dropping it -- lets a fast, continuous
    // scroll gesture cascade through items instead of stalling after the first.
    const stepScroll = (direction) => {
        isScrolling = true;
        scroller.scrollBy({
            left: getScrollStep() * direction,
            behavior: 'smooth'
        });
        setTimeout(() => {
            isScrolling = false;
            if (queuedDirection !== 0) {
                const next = queuedDirection;
                queuedDirection = 0;
                stepScroll(next);
            }
        }, 350);
    };

    scroller.addEventListener('wheel', (evt) => {
        if (window.innerWidth > 768) {
            // Only prevent default if we are scrolling horizontally
            if (Math.abs(evt.deltaY) > Math.abs(evt.deltaX)) {
                evt.preventDefault();

                const threshold = 5;
                if (Math.abs(evt.deltaY) <= threshold) return;
                const direction = evt.deltaY > 0 ? 1 : -1;

                if (isScrolling) {
                    queuedDirection = direction;
                    return;
                }
                stepScroll(direction);
            }
        }
    }, { passive: false });

    // C. Update Dots on Scroll
    scroller.addEventListener('scroll', () => {
        if (!dotsContainer || items.length <= 1) return;
        const dots = dotsContainer.querySelectorAll('.dot');
        const index = Math.round(scroller.scrollLeft / getScrollStep());
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    });
}

// Build every project from data/projects.js
const list = document.getElementById('project-list');
const viewer = initViewer(document.getElementById('media-viewer'));

projects.forEach((project) => {
    const block = renderProject(project);
    list.appendChild(block);
    initScroller(block);
    viewer?.attach(block);

    // Click anywhere outside the media/links toggles the details
    if (block.classList.contains('has-details')) {
        block.addEventListener('click', (evt) => {
            if (evt.target.closest('.project-media, a, button')) return;
            block.classList.toggle('is-expanded');
        });
    }
});

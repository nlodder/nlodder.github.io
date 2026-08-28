# Working in this repo

## How I want you to work

- Work in large batched edits, not incremental ones. Rewrite a file rather than making eight small edits to it.
- Don't narrate progress or summarize what you did unless I ask. No status reports mid-task.
- Keep responses short. Answer the question, don't add a report.
- Ask clarifying questions in one batch, up front, before writing code — not as they occur to you.

## Project

Personal portfolio at nlodder.github.io. Static site served by GitHub Pages.

**No build step, no framework, no dependencies.** Three files do everything:

- `index.html` — all markup, plus one inline `<script>` at the bottom for behaviour
- `style.css` — all styling
- `assets/images/<project>/`, `assets/videos/<project>/` — media, one folder per project

Font Awesome is the only external resource (CDN link in `<head>`).

## Conventions

- **Colors live in `:root` in `style.css`.** Never hardcode a color elsewhere — add a variable. The palette is warm slate + rose accent; `--glass-*` tokens exist for the media viewer's frosted surfaces.
- **Vanilla JS only**, in the inline `<script>` at the bottom of `index.html`. No modules, no bundler, no npm.
- **Mobile-first CSS.** Base rules target mobile; `@media (min-width: 768px)` holds desktop overrides. Project blocks are a single column on mobile and a `1.5fr 3.5fr` grid on desktop.
- Each project is a `<section class="project-block">` containing a `.project-media` (scroller + dots) and a `.project-info` (heading, tool/skill pills, description).
- Media scrollers are built from `.media-scroller` > `.media-item` figures. The dots in `.scroller-dots` are hand-written in the markup and must match the number of figures.
- The expand affordance and viewer wiring are added by JS at runtime, so `.media-item` markup stays clean — don't hand-add those elements.

## Don't

- Don't change the wording of any visible copy unless I explicitly ask. Project descriptions are mine.
- Don't add a build step, package.json, or framework.
- Don't reformat files wholesale — it makes the diff unreviewable.

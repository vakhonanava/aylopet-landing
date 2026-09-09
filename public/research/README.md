# Research documents

Study PDFs linked from `/why-fresh-food` are served from this folder.

To publish one:

1. Drop the PDF here, e.g. `lippert-sapy-2003-lifespan.pdf`.
2. Set the matching `ctaHref` in `src/lib/content/why-fresh.ts` to
   `/research/<filename>.pdf`.

While `ctaHref` is empty the card shows the `ctaPending` message instead of a
download link, so the UI never renders a link that 404s.

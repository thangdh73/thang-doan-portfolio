# Technical Corner — add your plots & demos

## Data Analysis Lab

Interactive tool: **`tools/data-lab.html`** — upload CSV, crossplot, histogram.

Sample CSV: `sample-well-data.csv` (included in this folder).

# Screenshots for portfolio cards

Save screenshots (PNG or JPG) here, then link them in `index.html` in the **Technical Corner** section.

## Suggested filenames

| File | Card |
|------|------|
| `stochastic-volume.png` | Stochastic volume calculation |
| `deterministic-volume.png` | Deterministic volume calculation |
| `crossplot.png` | Crossplot analysis |
| `histogram.png` | Histogram & distribution plots |
| `data-analysis.png` | Data mining / ML |

## How to enable an image

In `index.html`, find the card and update the `<img>` tag, for example:

```html
<img src="assets/technical/crossplot.png" alt="Porosity-permeability crossplot" class="technical-card__img">
```

Remove the `hidden` attribute from that `<img>` when `src` is set.

## Optional: link to a notebook or PDF

Add below the tags in a card:

```html
<a href="assets/technical/my-workflow.pdf" class="btn btn--outline" style="margin-top:0.5rem">View workflow (PDF)</a>
```

## Tips

- Use landscape screenshots (~1200×750 px) for best fit.
- Avoid confidential client data — use anonymized or synthetic examples.

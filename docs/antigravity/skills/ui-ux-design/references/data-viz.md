# Data Visualization & Charts

Charts are where most dashboards visibly fail — default rainbow palettes, 3D pie charts, dual axes,
chartjunk. Good data viz is mostly *restraint plus honesty*: show the data clearly, encode it truthfully,
and remove everything that isn't the data. Read this for any dashboard, analytics, or reporting UI (and
pair it with the dashboard archetype in `web-design.md`).

## Contents
- [Start from the question](#start-from-the-question)
- [Choosing the chart](#choosing-the-chart)
- [Color for data](#color-for-data)
- [Remove the chartjunk](#remove-the-chartjunk)
- [Labeling & legends](#labeling--legends)
- [Honesty](#honesty)
- [Accessible charts](#accessible-charts)

## Start from the question

A chart answers a question — decide the question first, then pick the form that answers it fastest.
Map the *data relationship* to the chart:

- **Comparison** between categories → bar chart (horizontal if labels are long or there are many).
- **Change over time** → line chart (or area for cumulative); time on the x-axis.
- **Part-to-whole** → stacked bar or, sparingly, a single donut for 2–4 parts; a plain "% of total" or a
  100%-stacked bar usually beats a pie.
- **Distribution** → histogram or box plot.
- **Correlation / relationship** → scatter plot.
- **Single key number** → a big, bold stat ("KPI card"), not a chart. Don't over-visualize one value.

## Choosing the chart

- **Bars beat pies almost always.** Humans compare lengths far more accurately than angles/areas. Use a
  pie only for a rough part-to-whole with very few slices, never for precise comparison, and never in 3D.
- **Avoid dual y-axes** — they imply relationships that may not exist and are easy to manipulate. Prefer
  two aligned charts or indexing both series to a common baseline.
- **Don't use a chart where a number or a small table is clearer.** A trend of one metric is a line; a
  precise lookup of values is a table; "up 12% vs last week" is text.
- **Sort meaningfully.** Order bars by value (not alphabetically) unless the category has a natural order
  (days, sizes). The sort *is* part of the insight.

## Color for data

Color in charts encodes meaning, so choose the scale to match the data type (OKLCH gives perceptually
even ramps — see `design-foundations.md`):

- **Categorical** (distinct groups) → distinct hues, but as few as possible. Beyond ~6–7 categories,
  color stops distinguishing — group, filter, or use direct labels/small multiples instead.
- **Sequential** (low → high, one direction) → a single-hue ramp light→dark.
- **Diverging** (deviation from a midpoint, e.g. profit/loss) → two hues meeting at a neutral middle.
- **Reserve saturated color for meaning.** Keep the chart chrome (axes, gridlines, labels) neutral and let
  the *data* be the only saturated thing. One highlighted series in color against grayed-out others
  directs attention far better than every series in a different bright color.
- Use color-blind-safe palettes and don't rely on hue alone (see accessibility below).

## Remove the chartjunk

Everything that isn't data or essential context is noise (Tufte's "data-ink" idea). Strip it:

- No 3D, no drop shadows on bars, no gradients-for-decoration, no heavy chart borders or background fills.
- Gridlines: light and few, or none. Axis lines: thin or removed. Ticks: minimal.
- Don't label every data point on a dense line — that's noise; label the endpoints or the notable points.
- The result should look almost bare. Clean data viz feels empty compared to the default library output —
  that's correct.

## Labeling & legends

- **Direct-label where you can.** Putting the series name at the end of its line (or on/next to its bar)
  beats forcing the eye to bounce to a legend and back. Reserve legends for when direct labeling is
  impossible.
- **Title says the takeaway.** "Revenue grew 18% in Q3," not "Revenue by quarter." A good title states the
  insight, not just the axes.
- **Label axes and units** (%, $, k) clearly; format numbers for humans (abbreviate large values, keep
  precision where it matters). Include the time range and data source where credibility matters.

## Honesty

Charts can mislead; a designer's job is to make them truthful:

- **Bar charts must start the y-axis at zero** — a truncated baseline exaggerates differences. (Line
  charts showing *change* may use a non-zero baseline, but label it clearly.)
- Keep scales linear unless a log scale is genuinely warranted (and labeled).
- Don't cherry-pick ranges to imply a trend; show enough context.
- Consistent scales across small multiples so they're comparable.

## Accessible charts

- **Never encode by color alone.** Add direct labels, distinct shapes/markers, patterns, or varied line
  styles so the chart works in grayscale and for color-blind users.
- Ensure text and meaningful marks meet contrast against the background (see `accessibility.md`).
- Provide the underlying data as an accessible table (or a "view as table" toggle) and meaningful alt
  text / summary for screen-reader users — a chart image alone is invisible to them.
- Don't rely on hover-only tooltips for essential values; those are unreachable by keyboard and touch.
  Make key values available without hover.

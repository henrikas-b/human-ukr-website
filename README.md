# HUMAN-UKR — A human-centered perspective on the consequences of war in Ukraine

A single-page website for HUMAN-UKR, a five-year, interdisciplinary research
project (2027–2031) on how the war in Ukraine has impacted the lives of
Ukrainian people across six domains (economics, politics, the environment,
well-being, information and social relations), and what the lessons are for
the Baltic Sea Region and Eastern Europe.

**🔗 Live site:** https://henrikas-b.github.io/human-ukr-website/

Funded by the Foundation for Baltic and East European Studies (Grand Project) ·
Administered by Södertörn University · Partners: PRIO, BI Norwegian Business
School, Kyiv School of Economics

## About

The site is a static, dependency-free presentation built with plain HTML, CSS
and JavaScript. It walks through why the project matters, the seven research
questions, the multi-method design, earlier research the project builds on,
the team and partners, planned outputs and news, and contact details.

The design follows the conventions of a printed policy brief: a ruled
masthead, an "At a glance" box beside the title, a small table of key figures,
numbered sections, a table of the seven research questions, and a sticky
sidebar with the contents list, partners and contact details. Text is set in Literata, labels and navigation
in Source Sans 3; the palette is white, black and the blue and yellow of the
Ukrainian flag.

## Structure

| File / folder        | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| `index.html`         | Page content and structure                                     |
| `styles.css`         | Design tokens, layout, components, print styles                |
| `main.js`            | Timeline graphic, navigation, scroll effects, news and links   |
| `assets/fonts/`      | Self-hosted Literata and Source Sans 3 fonts with their licences |
| `assets/map-ukraine-raions.png` | District-level map of Ukraine (OCHA COD-AB)         |

Editable content that changes over time (contact persons, links, news items,
publications) lives in the `SITE` object at the top of `main.js`.

## Running locally

No build step is required—just serve the folder over HTTP:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Deployment

The site is published with GitHub Pages from the `main` branch (root).
Any push to `main` is automatically deployed.

## Analytics

Aggregate visitor statistics are collected with
[GoatCounter](https://www.goatcounter.com/): no cookies, no stored IP addresses,
and visitors with "Do Not Track" enabled are not counted.

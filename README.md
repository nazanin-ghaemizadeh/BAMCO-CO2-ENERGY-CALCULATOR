# BAMCO CO₂ & Energy Calculator

Persian, responsive static calculator implementing **INSO 4241-2:1404 (2025), sixth revision**, based on the PDF supplied for this project.

## Features

- Product benchmark for M1 / M2 / N1 / N2, product stages 1–2.
- Automatic M₀: 1278 kg for M1, 1431 kg for M2/N1/N2. Stage 2 deliberately uses stage 1 M₀, as requested; disclosed on screen.
- Van, automatic transmission, permanent AWD allowances, applied additively to the unrounded base benchmark, followed by mathematical rounding to one decimal (5-1-3).
- Full A–G+ boundaries, correct open lower / closed upper intervals, no grade beyond 110%.
- Energy label preview using figure 1 structure and specified hexadecimal arrow colors; optional descriptive and fuel-consumption inputs. Preview is not an officially approved label.
- Bi-fuel equivalent emissions (formulas 1–3), including the 240 km discontinuity and 300 km cap prescribed in the source.
- Corporate formulas 4–8, actual registration counts n, corrected counts N, automatic table 4 credits, table 5 C and table 6 D for all four corporate stages.
- Both corporate target formulas displayed explicitly; separate family evaluation for mixed fleets. No invented combined compliance target.
- CSV details and browser print report. No external dependencies or remote data transmission.

## Interpretation choices and assumptions

1. Table 1 explicitly grants 5% for each qualifying condition; three conditions produce +15%, not compound 1.05³.
2. Table 2 omits the phrase “separately for each case.” Default is a single +5% if any qualifying condition exists. The alternative per-case interpretation is selectable, disclosed, and not presented as settled official interpretation.
3. Stage 2 M₀ equals stage 1 by user request. Corporate stages 3–4 also use these M₀ values as explicitly disclosed scenarios; tables 5–6 provide C/D but do not supply new M₀.
4. Corporate mass uses actual n; corporate emissions use corrected N=n×v. Product 5% allowances are not applied to corporate formulas 6–7.
5. The source gives no single combination rule for M1 and commercial-family corporate targets. Both whole-fleet scenario calculations and separate family results are shown; no blanket mixed-fleet authorization is issued.
6. ICE super-credit 2 requires both CO₂<100 and product grade A. Product stage follows corporate stage 1/2; for corporate stages 3/4 the product stage is selected separately.
7. Missing specifications cannot silently become zero. A fallback row requires supplied worst-case emission and valid mass; credit is forced to 1 (Annex A-1). Unknown mass must be resolved before relying on compliance.
8. No cross-year credit transfer or credit ledger is implemented. Annex A rules and their scope are explained in the reference tab.

## Source map

Source PDF: `4241-2-1404.pdf`, 22 PDF pages (14 numbered content pages plus front matter).

| Implementation | Source (printed pages) |
| --- | --- |
| Product formulas, M₀, allowances, rounding | 5-1-1–5-1-3, tables 1–2, pp. 6–7 |
| Bi-fuel equivalence | 5-1-4, formulas 1–3, pp. 7–8 |
| Grade boundaries | 5-2, table 3, p. 8 |
| Label structure/colors | 6-1-1–6-1-3, figure 1, pp. 8–10 |
| Corporate actual emissions | 8-1-1, formulas 4–5, table 4, pp. 11–12 |
| Corporate targets/mass | 8-1-2, formulas 6–8, tables 5–6, pp. 12–13 |
| Supply limits and implementation | Annex A, p. 14 |

## Development and validation

Open `index.html` or serve this directory with any static HTTP server. Deploy the `main` branch root using GitHub Pages.

```sh
node --check app.js
node --check engine.js
node engine.test.js
```

Tests cover all grade boundaries, M₀ selection, both product stages, additive allowances, decimal half-rounding, table 2 interpretations, bi-fuel boundaries, weighted mass vs. corrected-count emissions, corporate stages/constants, all credit types, strict ICE eligibility, fallback credit, mixed family evaluation and input validation.

`engine.js` contains calculation logic only; `app.js` handles presentation. The supplied PDF is not republished in this public repository.

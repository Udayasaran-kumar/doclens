---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

The build order below is the sequence requested for `5-build`: sample path first, then the rest of the approved screen, then uploads, tests, and a production build. Fast mode is recorded because the request was to finish the working proof and report the results, rather than pause after each slice.

## Slices

- [x] **1. Analyze the sample offer and see the six sections**
  Becomes usable: Opening the app, choosing the built-in sample, and clicking Analyze Document shows the six-part first pass.
  Why now: This is the kernel. The sample is the reliable demo, so it lands before file parsing.
  PRD ref: `prd.md > The Core Journey`
  Spec ref: `spec.md > The Core Journey Through the System`, `spec.md > Sample Offer Letter`
  Build: Scaffold the Vite app, add the sample letter, the deterministic reader, and the one screen through a successful sample analysis.
  Verify (mechanical): `npm test` covers the sample reader, and `npm run build` succeeds for this slice.
  Learner check: Open the app, choose the sample, click Analyze Document, and confirm all six sections have real content.
  Commit: `Show the sample offer as a six-part first pass`

- [x] **2. Walk the approved screen states**
  Becomes usable: Unsupported files, a failed read, Try again, Analyze another document, and empty sections behave as specified.
  Why now: The demo can already show a success. These transitions keep a bad file from looking like a failed reading.
  PRD ref: `prd.md > States and Boundaries`
  Spec ref: `spec.md > UI State Machine`, `spec.md > Error Handling`
  Build: Add the remaining reducer transitions and the panels that show them, with the exact PRD messages.
  Verify (mechanical): `npm test` covers selection, unsupported files, empty sections, failure and retry, and Analyze another document.
  Learner check: Choose a non-PDF file and confirm the inline unsupported message. After a success, click Analyze another document and confirm the results are gone.
  Commit: `Add the approved selection and error states`

- [x] **3. Read PDF, DOCX, and TXT uploads**
  Becomes usable: A supported offer file can be selected and analyzed with the same reader. PDF is the format to show.
  Why now: Extraction is separate from analysis, and the sample demo already works if a parser fails.
  PRD ref: `prd.md > Providing the offer letter`
  Spec ref: `spec.md > Document Input`, `spec.md > Analysis`
  Build: Extract text from `.txt`, `.docx`, and `.pdf` in the browser, then pass it to `analyzeOffer`.
  Verify (mechanical): `npm test` and `npm run build` pass, including a text-file upload through the screen.
  Learner check: Upload `sample` text saved as a `.txt` file, or a digital PDF, and confirm Analyze Document produces a first pass.
  Commit: `Read PDF, DOCX, and TXT offers in the browser`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after slice 1, folded into the final session because the request was to finish the proof before pausing
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning wrap-up completed — activity, evidence, and app map recorded below

## Revisions

- The three slices were implemented as one screen and verified together: 11 tests passed, `npm run build` passed, and the sample path was clicked through in the browser. The hands-on checkpoint is still open for the learner.

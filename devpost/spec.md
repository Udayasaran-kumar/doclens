---
doc: spec
status: approved
---

# DocLens — Technical Spec

Implements `scope.md > The Unique Kernel` and `prd.md > What We're Building`. One browser screen. No accounts, database, history, chatbot, retrieval index, or required deployment.

The local reader is approved. The pipeline is document extraction, then deterministic offer-letter analysis, then a structured first-pass result. The page does not claim that a model read the letter.

## How This Works, In Plain Language

DocLens is one web page that runs on your computer. Nothing is saved. Refreshing the page starts over.

The work happens in two steps, and they stay separate. **Document extraction** turns a PDF, DOCX, TXT file, or the built-in sample into plain text. **Deterministic analysis** then reads only that text for dates, amounts, explicit requests, and names the letter actually states, and fills the six sections. If a section has nothing it can support, it says so. It does not call a model, and it does not invent a salary, a person, or a deadline.

The sample letter is the reliable demo. Its wording is explicit, and a test checks that the six sections come back with the facts that are actually in the letter. Uploaded letters use the same reader. A scanned page, a locked PDF, or a model outage cannot block the sample path, because there is no model and no server.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. The browser opens `index.html`. React shows the before-analysis screen. No file is active. Analyze Document is inactive.
2. Choosing "Try the sample offer letter" stores the sample text in memory and marks it active. Choosing a `.pdf`, `.docx`, or `.txt` file checks the extension first. A supported file is read only after Analyze Document. An unsupported file never becomes active.
3. Analyze Document asks the browser to extract text, then runs `analyzeOffer`. The screen shows "Analyzing your offer letter…" and the active name. The six cards stay hidden. The button cannot start a second run.
4. If extraction or the reader throws, the screen replaces that waiting state with "DocLens could not analyze the document" and "Try again". Try again shows the selection area again, keeps the same document in memory when the browser still has it, and does not analyze.
5. If the reader returns, the large upload area is replaced by six cards. Empty sections use the PRD messages. "Analyze another document" drops the result and the active document and returns to the first screen.

## Stack

Chosen for this draft because you asked for the simplest stack that fits React and TypeScript, and because the proof is one local screen. Versions below were read from the npm registry on October 26, 2026. Confirm them when dependencies are first installed. Do not install them during spec review.

| Piece | Choice | Why |
| --- | --- | --- |
| UI | React 19.3.1, TypeScript 7.0.2, Vite 8.3.5 | One page, no server. Vite's dev server is the local demo. You already use React and TypeScript. |
| Node.js | `^20.19.0` or `>=22.12.0` | The range Vite 8 publishes in its `engines` field. |
| Tests | Vitest 5.0.5, React Testing Library 16.3.3, jsdom | Runs the reader and the screen states without a browser service. Pin jsdom to the current release at install. |
| PDF text | `pdfjs-dist` 6.4.299 | Reads text from a digital PDF in the browser. |
| DOCX text | `mammoth` 1.13.0 | Reads the document text from `.docx` in the browser. |
| TXT | The platform `File.text()` | No library. |
| Styling | One plain CSS file | The look is a calm document page, not a component kit. |

Documentation to use during the build:

- Vite: https://vite.dev/guide/
- React: https://react.dev/
- Vitest: https://vitest.dev/guide/
- pdf.js: https://github.com/mozilla/pdf.js
- Mammoth: https://github.com/mwilliamson/mammoth.js

Not verified yet, and the first file-reading slice must check it: how Vite 8 should load the pdf.js worker for version 6.4.299. If the published import path differs, adjust the worker setup in that slice. Do not switch libraries until that check fails.

No model SDK, no database client, no router.

## Where It Runs and How Someone Tries It

The app runs in a local browser. A public URL is optional and is not part of this proof. The hackathon still needs a short screen recording and a public GitHub repository.

From a clean checkout, with Node.js in the range above:

```bash
npm install
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173`.

Demo recording, about one minute:

1. Show the first screen: DocLens, the value statement, the upload line, and the sample action.
2. Click "Try the sample offer letter", then Analyze Document.
3. Point at Summary and "What should I do next?", then the dates, the two amounts, the actions, and the people.

No API key. No `.env` file. `npm test` runs the tests. `npm run build` writes a static `dist/` folder. `npm run preview` serves that folder locally if you want to record the production build. Deployment steps are intentionally absent.

## Look and Feel

Implements `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`. Direction for the build, not a new visual system.

Calm, light, and document-like. Not a chat transcript. No bubbles, no gradient backdrop, no glow.

- Type: `system-ui, "Segoe UI", sans-serif`. No webfont download, so the demo does not wait on a font host.
- Page background `#F6F4EF`. Cards `#FFFDF8` with a 1px border `#E4E0D8` and a very soft shadow. Ink `#1F2933`. Secondary text `#5C6B73`.
- One accent, `#1F6F5B`, for Analyze Document and other primary controls. No second brand color.
- Error text `#8E2F2F`. Empty-section text uses the secondary color, not the error color.
- Spacing is loose. Summary and "What should I do next?" use a larger heading than the other four cards.
- The page column is centered, about 960px wide. Below 720px, the card pairs stack in one column. At 720px and above, dates sit beside money, and actions sit beside people. Summary and the next step stay the first row and keep the stronger type.

Copy stays the PRD strings: "Understand your offer letter in seconds.", "Upload an offer letter — PDF, DOCX, or TXT", "Try the sample offer letter", "Analyzing your offer letter…", "Try again", "Analyze another document", and the six empty messages.

## Components

One screen. No routes.

### App shell

Holds the screen state and renders one of the panels below. The header, DocLens plus the value statement, stays visible and becomes compact after success.
PRD ref: `prd.md > Screens and Layout`.

### Selection panel

Upload control, sample button, filename of the active supported file, inline unsupported-file error, guidance text, and Analyze Document. Shown in the initial, ready, and unsupported states, and again after Try again. Hidden during analysis and after success.
PRD ref: `prd.md > Providing the offer letter`.

### Analyzing panel

Loading indicator, "Analyzing your offer letter…", one line that DocLens is extracting the important details and preparing the first pass, and the active document name. No cards and no second Analyze action.
PRD ref: `prd.md > While analysis is running`.

### Failure panel

"DocLens could not analyze the document" and a prominent "Try again".
PRD ref: `prd.md > After a failed analysis`.

### Results

Compact toolbar with the document name and "Analyze another document". Then six cards, in this order of emphasis: Summary, What should I do next?, Important dates, Money / compensation, Action items, People & organizations. A card with no content shows its empty message and does not use error styling.
PRD ref: `prd.md > After a successful analysis`, `prd.md > Reading the first pass`.

### Screen state

A single reducer in the page. It is the only place transitions are allowed. See **UI State Machine**.

### Text extraction

`extractText` turns a sample string, or a supported `File`, into a string. PDF, DOCX, and TXT each have one branch.
PRD ref: `prd.md > Providing the offer letter`.

### Offer reader

`analyzeOffer` is a pure function from text to the analysis object. No network.
PRD ref: `prd.md > Reading the first pass`.

## Data Model

Nothing is stored on disk or on a server. The active document and the result live in React memory. Leaving the page or refreshing clears them. That matches `prd.md > States and Boundaries`: one sitting, no history.

### Analysis

```ts
type Analysis = {
  summary: string | null
  nextStep: string | null
  importantDates: Array<{ label: string; date: string }>
  compensation: {
    amounts: Array<{ label: string; amount: string }>
    benefitsNote: string | null
  }
  actionItems: string[]
  peopleOrganizations: Array<{
    name: string
    role: "candidate" | "employer" | "person"
  }>
}
```

A filled section is a non-null string or a non-empty list. An empty section is `null`, an empty list, or compensation with no amounts and no benefits note. The UI then shows:

- Summary: "No summary available."
- Important dates: "No important dates found."
- Action items: "No action items found."
- People and organizations: "No people or organizations found."
- Money: "No compensation amounts found."
- Next step: "No specific next step identified."

Analysis failure is not this object. It is the `failed` screen state. Unsupported type is the `unsupported` screen state. Those three must not share one message.

`benefitsNote` stays inside the money card. It is not a seventh section. It is shown only when the letter has a benefits sentence, and it is labeled as benefits rather than as a dollar amount.

### Active document

```ts
type ActiveDocument =
  | { kind: "sample"; name: "Sample offer letter"; text: string }
  | { kind: "file"; name: string; file: File }
```

The sample name is always "Sample offer letter". A file keeps the browser `File` until Try again needs it again. Analyze another drops it.

## UI State Machine

Implements `prd.md > States and Boundaries`. Empty cards are part of `success`, not their own screen.

```ts
type Screen =
  | { status: "initial" }
  | { status: "ready"; active: ActiveDocument }
  | { status: "unsupported"; message: string; active: ActiveDocument | null }
  | { status: "analyzing"; active: ActiveDocument }
  | { status: "success"; active: ActiveDocument; analysis: Analysis }
  | { status: "failed"; active: ActiveDocument }
```

The unsupported message is exactly: "Unsupported file type. Please upload a PDF, DOCX, or TXT file."

The failure message is exactly: "DocLens could not analyze the document."

Allowed transitions:

- `initial` plus the sample, or plus a supported file, goes to `ready`. Selecting does not analyze.
- `initial` plus an unsupported file goes to `unsupported` with `active: null`. Analyze Document stays inactive.
- `ready` plus a different valid choice replaces `active`. The most recent valid choice wins. The previous one is visually quiet.
- `ready` or `unsupported` plus an unsupported file goes to `unsupported` and keeps the previous `active` value. The bad file does not replace it, and it does not by itself enable Analyze Document.
- `unsupported` plus a valid choice goes to `ready` and clears the inline error.
- `ready` plus Analyze Document goes to `analyzing`, then to `success` or `failed`.
- `analyzing` ignores Analyze Document, file selection, and the sample button.
- `failed` plus Try again goes to `ready` with the same `active` document. It does not analyze. If the file object is gone, it goes to `initial` instead. In this single page, the file object is still in memory, so the normal path is `ready`.
- `success` plus Analyze another document goes to `initial`. Results and the active document are cleared. Analyze Document is inactive until a new valid choice.

A repeated failure of the same document shows `failed` again. There is no separate loop state.

## Document Input

Implements `prd.md > Providing the offer letter`.

The upload control's visible text is "Upload an offer letter — PDF, DOCX, or TXT". The file input also sets `accept=".pdf,.docx,.txt"`. The extension check still runs, because the browser hint is not a guarantee.

| Input | Before Analyze | At Analyze |
| --- | --- | --- |
| Sample button | Store the sample text. Name it "Sample offer letter". | Pass that text straight to `analyzeOffer`. |
| `.pdf` | Keep the file. Show its filename. | `pdfjs-dist` reads each page's text items and joins them. |
| `.docx` | Keep the file. Show its filename. | `mammoth` extracts raw text from the array buffer. |
| `.txt` | Keep the file. Show its filename. | `file.text()`. |
| Anything else, including `.doc`, images, sheets, slides, and `.zip` | Inline unsupported error. Do not store it as active. | Never called. |

Extension comparison is case-insensitive. A name that does not end in exactly one of those three extensions is unsupported. The reader does not use MIME type as the decision.

PDF, DOCX, and TXT extraction happen in the browser on the Analyze click, not when the file is chosen. The sample text is already in the bundle.

## Analysis

Implements `prd.md > Reading the first pass` and `prd.md > Starting the analysis`.

There is no model and no analysis API. `analyzeOffer(text)` is deterministic.

1. Normalize whitespace. Split sentences on `.`, `!`, and `?`.
2. Dates. Match a month name plus a day and a four-digit year, or `YYYY-MM-DD`. Classify from the same sentence:
   - "start" or "joining" → Start date
   - "accept", "acceptance", or "respond by" → Acceptance deadline
   - "offer date" or a date in the opening line → Offer date
   - any other matched date → one "Other date" entry
3. Money. Match `$` amounts with thousands separators. "Salary", "annual", or "compensation" → Annual salary. "Bonus" → Joining bonus or Performance bonus, using the words beside the amount. A benefits sentence with no dollar amount becomes `benefitsNote`, not an amount.
4. Actions. Keep a sentence only when it both asks and names the act: it contains "please", "you must", "you will need to", or "required to", and it also contains "sign", "accept", "submit", "return", "complete", or "provide".
5. People. "Dear {Name}" is the candidate. "{Company} is pleased to offer" is the employer. "the role of {Role}" is stored on the employer entry as context for the summary, not as a new card. "hiring manager, {Name}" or "recruiter, {Name}" is the other person. If a pattern does not match, that entity is omitted.
6. Summary. Only if a company and a role were found: "{Company} offers {candidate or "you"} the {role} role." Add a second sentence with the annual amount and the start date only when those were found. If company and role were not found, `summary` is `null`.
7. Next step. Only from found actions and the acceptance deadline. If there is a sign-or-accept action and an acceptance deadline, the sentence says to complete that action by that date. Append a submit action and its date when one was found. If there is no action and no acceptance deadline, `nextStep` is `null`.

No step may insert a number, name, or date that step 2–5 did not return.

The sample is written so these patterns match. An uploaded letter that does not phrase a fact this clearly gets an empty section rather than a guess. That is the accepted tradeoff of refusing a live model.

## Sample Offer Letter

Implements the sample rules in `prd.md > Providing the offer letter`.

The text below lives in `src/sample/offerLetter.ts` as a string export named `sampleOfferLetter`. The app does not ship a separate PDF for the sample. The sample button uses this string. It is fictional and safe to publish.

Facts the reader must surface:

- Candidate: Priya Shah
- Role: Product Designer
- Company: Northwind Labs
- Other person: Elena Vasquez, hiring manager
- Offer date: January 15, 2026
- Acceptance deadline: January 29, 2026
- Start date: March 2, 2026
- Other date: February 12, 2026, for identification documents
- Annual salary: $145,000
- Joining bonus: $15,000
- Benefits, not an amount: medical coverage, dental coverage, and 15 days of paid vacation
- Actions: sign and return the letter by the acceptance deadline; submit identification documents by February 12, 2026

```
January 15, 2026

Dear Priya Shah,

Northwind Labs is pleased to offer you the role of Product Designer. We enjoyed learning how you work through a problem with a team, and we would like you to join us.

Your start date will be March 2, 2026. You will report to your hiring manager, Elena Vasquez. The team is based in our Chicago studio, and this role is a full-time position.

Your annual salary will be $145,000, paid on the regular monthly cycle. You will also receive a joining bonus of $15,000, paid with your first paycheck. Northwind Labs provides medical coverage, dental coverage, and 15 days of paid vacation. Those benefits are separate from the salary and the joining bonus.

Please sign and return this letter by January 29, 2026 to accept the offer. Please submit your identification documents by February 12, 2026 so we can complete your file before your start date.

If you have a question before then, Elena Vasquez can walk you through the letter. We hope you will join Northwind Labs.

Sincerely,
Elena Vasquez
Hiring Manager
Northwind Labs
```

Expected next step, composed only from those facts: sign and return the letter by January 29, 2026, and submit the identification documents by February 12, 2026.

The test for this letter fails if any displayed date, amount, or name is absent from the text above.

## Error Handling

Implements `prd.md > After a failed analysis` and the unsupported-file rules in `prd.md > Providing the offer letter`.

| Situation | What the user sees |
| --- | --- |
| Unsupported extension | Inline "Unsupported file type. Please upload a PDF, DOCX, or TXT file." No analyzing state. Previous valid selection stays. |
| Empty PDF, or a PDF whose extracted text is blank | Failure panel. "Try again". This covers a scanned page with no text layer. |
| Password-protected or otherwise unreadable PDF | Same failure panel. The library error is not shown raw. |
| DOCX that mammoth cannot read | Same failure panel. |
| TXT that is empty after trimming, or that `file.text()` rejects | Same failure panel. |
| `analyzeOffer` throws | Same failure panel. |
| A section has no grounded fact | That card's empty message. The rest of a successful result still shows. |

There is no model response to validate. A missing field is an empty section, not a crash, as long as `analyzeOffer` returns the object.

## Testing

Vitest, in jsdom for the screen tests. No hosted browser service.

- `analyzeOffer` on `sampleOfferLetter` returns a summary, a next step, the four dates, both amounts, a benefits note, both actions, Priya Shah, Northwind Labs, and Elena Vasquez. Every name, date, and amount in the result occurs in the letter.
- A text with no dates, amounts, requests, or name patterns returns nulls and empty lists, not invented strings.
- A `.png` name moves the reducer to `unsupported` and does not set that file active. From `ready`, the same action keeps the previous active document.
- Choosing the sample, then a supported file, leaves the file active. Choosing the file, then the sample, leaves the sample active. Neither transition is `analyzing`.
- Analyze Document from `ready` becomes `analyzing`. A second analyze action while `analyzing` does not change the state.
- A successful result renders six cards, with the summary heading before the other sections.
- An empty analysis renders the six exact empty messages.
- A rejected extraction moves to `failed`. Try again returns to `ready` with the same active document and does not call the reader again until Analyze Document.
- Analyze another document from `success` returns to `initial` with no active document and no cards.
- Blank extracted text is `failed`, not the unsupported message.

## File Structure

```
doclens/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md                 # install, dev, test, build, demo clicks
├── LICENSE                   # MIT, added when the repo is prepared to publish
├── .gitignore                # already ignores learner-profile and .env files
├── devpost/                  # planning docs, not imported by the app
└── src/
    ├── main.tsx
    ├── App.tsx               # shell and visible states
    ├── styles.css
    ├── sample/
    │   └── offerLetter.ts    # the letter in this spec
    ├── lib/
    │   ├── fileKind.ts       # extension check
    │   ├── extractText.ts    # pdf, docx, txt
    │   └── analyzeOffer.ts   # pure reader
    ├── state/
    │   └── screen.ts         # reducer and transitions
    ├── components/
    │   ├── SelectionPanel.tsx
    │   ├── AnalyzingPanel.tsx
    │   ├── FailurePanel.tsx
    │   └── Results.tsx
    └── test/
        ├── analyzeOffer.test.ts
        ├── screen.test.ts
        └── App.test.tsx
```

No `server/`, no database, no shared package, no `.env`.

## External Services and Dependencies

None. The page does not call an API. Libraries are the ones in **Stack**, installed from npm, with no keys. pdf.js and mammoth run in the browser after they are bundled. There is no account, rate limit, or per-analysis cost.

If a later version of this project adds a model, that is a new decision. This proof does not leave a hidden client or a placeholder key.

## Important Failure Modes

- **The PDF worker fails to bundle.** The sample path still works, because it never touches pdf.js. The PDF branch shows the failure panel rather than a blank wait. Fix the worker in the file-reading slice before calling the PDF path done.
- **An uploaded letter is phrased in a way the reader does not recognize.** The matching cards show the empty messages. The sample demo is unaffected.
- **Someone expects a live model.** The README says the reading is local and rule-based, so the recording does not describe a model call that did not happen.

## What Was Simplified and Why

- **A local reader** instead of a model API. A key, a server, and a network call would make the one-minute sample path depend on an account. The reader only emits facts it matched. The loss is that unusual wording becomes an empty card.
- **The sample is text in the bundle** instead of a sample PDF. The demo does not depend on PDF parsing. PDF remains the upload format to show when you want the real-letter path.
- **Memory only** instead of a database. The PRD already ends the session when the page closes.
- **No host** instead of a deployed site. The recording and the repository are the submission. `npm run dev` is the way someone tries it.

## Decisions and Open Issues

- **React, TypeScript, and Vite.** You asked this spec to choose the simplest stack from tools you already use. Tradeoff: there is no API process to hide a key in, so analysis stays in the page. That is what this proof needs.
- **No live model. Approved.** You accepted the local, deterministic reader for this proof of concept. Extraction and analysis stay separate. The sample letter is explicit so every section has a supported result. Uploaded letters only yield facts the patterns recognize. The sample test fails if a result contains a fact the letter does not contain. The interface must not say that a model analyzed the document.
- **Unsupported files keep the previous valid selection.** This follows your rule that a bad file must not silently replace a good one. The screen also shows the inline error.
- **Empty or protected PDFs use the analysis failure.** They are supported types that could not be read. They do not use the unsupported-type message.

`prd.md > Open Questions` has none.

Nothing is unresolved for this proof of concept. The local reader is the approved analysis path.

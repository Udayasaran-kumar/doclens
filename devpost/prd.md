---
doc: prd
status: approved
---

# DocLens — Product Requirements

A browser tool that gives a job seeker a clear first pass of an offer letter.
Source: `scope.md > Who It's For`, `scope.md > The Unique Kernel`.

## The Core Journey

Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

1. The job seeker opens DocLens in a browser and lands on one document-analysis screen, before any analysis.
2. They see the DocLens name, a short value statement, a way to provide an offer letter, and one Analyze Document action.
3. They upload a supported offer letter or choose the built-in sample. Only the most recently selected valid option is active, and the screen shows that clearly. A supported file's name is shown. Analyze Document stays inactive until a valid file or the sample is active.
4. They click Analyze Document.
5. The large upload area becomes an analysis-in-progress state: a loading indicator, "Analyzing your offer letter…", a short line that DocLens is extracting the important details and preparing the first pass, and the selected document or sample name. No result cards appear yet, and another analysis cannot be started.
6. If analysis fails, that loading state is replaced by a clear error that DocLens could not analyze the document, plus a prominent "Try again" action. "Try again" returns to document selection on the same screen and does not start a new analysis. The user clicks Analyze Document again, on the same document or on the built-in sample.
7. When analysis succeeds, the upload area collapses into a compact header or toolbar. The screen prioritizes the first pass, in this order of emphasis: summary and "What should I do next?", then important dates and money, then action items and people and organizations.

The journey succeeds when, about a minute after opening the app, the same screen shows a useful first pass the job seeker can grasp in a few seconds, without scrolling past the original upload area.

## Screens and Layout

One screen. Source: `scope.md > The POC Boundary`.

No dashboard, sidebar, navigation, chat, authentication, history, or a second workflow.

### Before analysis

Top to bottom, in this visual hierarchy: DocLens, then the short value statement, then the upload or sample choice, then Analyze Document.

1. **Header.** The name DocLens and a short explanation: "Understand your offer letter in seconds." Minimal. No navigation, account controls, or unrelated features.
2. **Upload area.** Near the center. The user can drag and drop an offer letter or choose a file. The control says “Upload an offer letter — PDF, DOCX, or TXT”. Once a supported file is chosen, its filename is shown.
3. **Sample.** A clear secondary option next to or below the upload area, labeled "Try the sample offer letter." Easy to select, because it is the reliable path for the one-minute demo. Source: `scope.md > The Core Loop`.
4. **Analyze Document.** One prominent button. Inactive until a supported file or the sample is the active selection, and it clearly indicates that a document is required. After a valid selection, the button is actionable. Selecting a document does not start analysis.
5. **Guidance.** Small text, secondary to the upload and sample actions. It says DocLens extracts the important parts of an offer letter: summary, dates, actions, people and organizations, compensation, and next steps.

The user should know what to do without reading instructions.

### While analysis is running

Same screen. The large upload area transitions into a calm, focused in-progress state. It shows:

- a clear loading indicator
- a short message: "Analyzing your offer letter…"
- a secondary line explaining that DocLens is extracting the important details and preparing the first pass
- the selected document or sample name, so the user knows which document is being analyzed

The six result cards stay hidden. No partial or guessed results. No progress percentage and no multi-step processing display, unless a later implementation actually has meaningful progress to report. The user cannot start another analysis while this one is running. The state should be brief enough to stay inside the one-minute demo.

The intended transition is: Upload / Sample → Analyze Document, then "Analyzing your offer letter…", then the completed analysis.

### After a failed analysis

The loading state is replaced by a clear error message: DocLens could not analyze the document. A prominent "Try again" action is the way forward.

"Try again" resets the failed analysis and returns to the upload and sample selection area on the same screen. It does not start another analysis. The previously selected document stays available when that is possible, so the user does not have to start over. From there they can analyze that same document again or choose the built-in sample instead. Either way, they must click Analyze Document themselves.

If that same document fails again, the screen shows this same error state. It does not enter a different or looping failure.

The path is: Analyze Document, analysis fails, clear error plus "Try again", document selection, Analyze Document.

A supported file that cannot be read, such as an empty or protected PDF, uses this failure path. It is not the unsupported-type error, because analysis was attempted.

### After a successful analysis

Same screen. The large upload area collapses into a compact header or toolbar. The results are what the user sees, without scrolling past the original upload area.
Source: `scope.md > What "Working" Looks Like`.

The six sections use a responsive grid of cards. No seventh category. Visual emphasis, from strongest to quietest:

1. **Summary** and **"What should I do next?"** sit together and carry the strongest emphasis. Summary comes first and states the plain-language meaning of the offer. "What should I do next?" sits near it, because the core value is an actionable next step.
2. **Important dates** and **Money / compensation.** Dates are easy to scan: deadlines, joining or start dates, response dates, and other relevant dates. Money clearly surfaces salary, bonuses, benefits, or other amounts mentioned in the offer.
3. **Action items** and **People & organizations.** Action items are things the job seeker needs to do, provide, sign, or complete. People and organizations name the employer, candidate, recruiter, hiring manager, or other relevant entities.

The intended feel is: Summary + Next Step, then Dates / Money, then Actions / People & Organizations.

A small secondary action remains available, labeled "Analyze another document." It must not compete with the results. Clicking it leaves the completed-results state immediately and returns to the initial document-selection state on the same screen. The current results are cleared. The active document selection is cleared. The upload area and the built-in sample option are back. Analyze Document is unavailable until a new file or the sample is selected. Nothing starts automatically. Previous results are not shown beside the selection area. The user then chooses a new offer letter or the sample and clicks Analyze Document again.

The flow is: completed results, Analyze another document, initial selection state, select a document or the sample, Analyze Document. Results from one document are never visible while the user is choosing another.

## Look and Feel

Source: `scope.md > Inspiration & Identity`.

Calm, professional, and document-centric. It should feel like a trustworthy tool for reading an important document: simple, readable, and actionable. It should not feel like an AI chatbot that happens to read documents. No specific existing product is the reference. Reliability and clarity matter more than feature count.

Before analysis, the hierarchy is name, value statement, upload or sample, then Analyze Document. That first state is as clean and focused as the results. After success, cards in a responsive grid give Summary and "What should I do next?" the strongest emphasis. Dates, money, actions, and people stay visually distinct and secondary.

**Typography.** A clean, highly readable sans-serif. Readability over decoration. Headings have a clear hierarchy, with Summary and "What should I do next?" stronger than the other sections. Body text is comfortable to scan. No overly futuristic, playful, or highly stylized fonts.

**Color.** A restrained neutral light background with strong text contrast. A minimal palette. One subtle accent for primary actions, including Analyze Document, and for important interactive elements. Semantic colors only sparingly, for states such as success, warning, or error. No neon gradients, excessive purple or blue AI styling, glowing effects, or noisy backgrounds.

**Layout.** Clean cards with subtle borders or shadows, and enough whitespace to scan the six sections. No dashboard, sidebar, extra navigation, chat bubbles, or decoration that does not help the analysis.

- [ ] The type is a readable sans-serif, and Summary and "What should I do next?" are visually stronger than the other four sections.
- [ ] The background is a light neutral, text contrast is strong, and primary actions use one subtle accent.
- [ ] Error, empty, and success states are distinguishable, and semantic color is used sparingly.
- [ ] Result sections are cards with subtle borders or shadows and enough space to scan.
- [ ] The screen has no chat bubbles, neon gradients, glowing effects, sidebar, or dashboard chrome.

## Features and Behavior

### Providing the offer letter

On the before-analysis screen, the user can drag and drop a file, choose a file, or select the built-in sample. The sample is a first-class path, not a hidden extra. After a supported file is chosen, the screen shows that file's name.

Only one valid option is the active document. The most recently selected valid option wins. If the user selects a supported file and then the sample, the sample is analyzed. If the user selects the sample and then a supported file, the file is analyzed. Selecting one option does not analyze the other. Analyze Document always uses the active selection. The active choice is visually obvious. Selecting one de-emphasizes or clears the other, so two choices never look equally active.

- [ ] Before a file or the sample is selected, Analyze Document is inactive and it is clear that a document is required.
- [ ] After a supported file is chosen, its filename is visible.
- [ ] After the sample is selected, Analyze Document is actionable, and the sample is visibly the active document.
- [ ] After a supported file is chosen, Analyze Document is actionable, and that file is visibly the active document.
- [ ] If the sample is selected after a file, the sample becomes the only active document and is the one Analyze Document uses.
- [ ] If a file is selected after the sample, that file becomes the only active document and is the one Analyze Document uses.
- [ ] Selecting a file or the sample does not start analysis.
- [ ] The sample control reads "Try the sample offer letter" and can be used without uploading a file.

The built-in sample is a realistic fictional job offer, safe to publish in a public repository, about one to two pages, written in ordinary professional language. It exists to demonstrate the six approved sections. It does not add a new feature. It is detailed enough that each section has a meaningful result, and small enough to follow during the one-minute demo. It includes:

- **Summary.** A believable role, employer, and offer context, enough for a useful plain-language summary.
- **Important dates.** An offer date, a clear deadline to accept, a joining or start date, and optionally another relevant date such as a signing or document deadline.
- **Action items.** At least two concrete actions the candidate must complete, such as accepting or signing the offer and submitting required documents. Those actions are explicit in the letter.
- **People and organizations.** A candidate name, an employer name, and at least one other person, such as a recruiter or hiring manager, appearing naturally in the letter.
- **Money / compensation.** Annual salary and at least one other amount, such as a joining bonus or performance bonus. Any benefits stay simple, and monetary amounts stay distinct from general benefits.
- **What should I do next?** Explicit deadlines and required actions, enough for a next-step recommendation grounded in the letter. The recommendation is not invented beyond what the letter contains.

- [ ] Analyzing the sample produces a meaningful result in all six sections, not the empty-state lines.
- [ ] The sample's dates include an offer date, an acceptance deadline, and a start date.
- [ ] The sample states at least two concrete actions, annual compensation, one additional amount, the candidate, the employer, and at least one other person.
- [ ] "What should I do next?" after the sample is grounded in those dates and actions.
- [ ] The sample is fictional, about one to two pages, and safe to publish.

The upload accepts PDF (`.pdf`), Microsoft Word (`.docx`), and plain text (`.txt`). PDF is the primary format to demonstrate. DOCX and TXT keep the real-letter path practical for testing. The upload control says “Upload an offer letter — PDF, DOCX, or TXT”.

Images, legacy `.doc` files, spreadsheets, presentations, ZIP files, and any other format are not accepted. An unsupported file is rejected before analysis is attempted, so it does not enter the in-progress state. The error explains that the file type is unsupported and names PDF, DOCX, and TXT. The built-in sample stays available whether or not the uploaded file is usable.

An unsupported file is rejected immediately, at selection time, before Analyze Document is involved. The screen shows a clear inline error near the upload area: “Unsupported file type. Please upload a PDF, DOCX, or TXT file.” That file does not become the active document, and it does not enable Analyze Document. The screen does not enter “Analyzing your offer letter…”. The sample stays available. The user can choose a supported file next, without reloading the page. If a valid document was already selected, the unsupported file does not silently replace it. The valid selection stays active unless the screen clearly shows that the selection was reset.

The three paths stay distinct. An unsupported file is an immediate upload error. A supported file can be selected, then Analyze Document starts the in-progress state. A supported file that fails during processing uses the analysis error and “Try again”. An unsupported file is never treated as a failed analysis.

- [ ] The upload control communicates PDF, DOCX, and TXT.
- [ ] A PDF, DOCX, or TXT offer letter can be selected, and Analyze Document becomes actionable.
- [ ] Choosing an image, `.doc`, spreadsheet, presentation, ZIP, or other unsupported file shows “Unsupported file type. Please upload a PDF, DOCX, or TXT file.” beside the upload area.
- [ ] That unsupported file is not the active document, does not enable Analyze Document, and does not show “Analyzing your offer letter…”.
- [ ] After that error, the user can choose a supported file or the sample without reloading.
- [ ] Choosing an unsupported file does not silently replace a valid selection that was already active.
- [ ] The header shows DocLens and "Understand your offer letter in seconds," with no navigation or account controls.
- [ ] Guidance text mentions summary, dates, actions, people and organizations, compensation, and next steps, and it is visually secondary to the upload and sample actions.

### Starting the analysis

The only primary action is Analyze Document. It runs against the selected file or the built-in sample.

After the click, the screen shows the in-progress state in **Screens and Layout**. Another analysis cannot be started until this one succeeds or fails.

- [ ] After Analyze Document is clicked, the large upload area is replaced by a loading indicator and the message "Analyzing your offer letter…".
- [ ] A secondary line says that DocLens is extracting the important details and preparing the first pass.
- [ ] The name of the selected file or sample is visible during analysis.
- [ ] The six result cards are hidden until analysis completes successfully.
- [ ] No partial or guessed results are shown.
- [ ] The user cannot start a second analysis while one is running.
- [ ] The in-progress state does not show a progress percentage or a list of processing steps.
- [ ] If analysis fails, the loading state is replaced by a clear message that DocLens could not analyze the document, plus a prominent "Try again" action.
- [ ] "Try again" returns to the upload and sample selection area and does not start an analysis.
- [ ] After "Try again", the previously selected document is still available when that is possible.
- [ ] After "Try again", the user can analyze that document again or choose the built-in sample, and nothing runs until they click Analyze Document.
- [ ] A repeated failure of the same document shows the same error state.

### Reading the first pass

When analysis succeeds, the job seeker sees only the six approved sections, arranged as in **Screens and Layout**. They can understand the important parts of the offer within a few seconds, without searching the letter and without scrolling past the upload area. Source: `scope.md > The Unique Kernel`.

- [ ] After a successful analysis, the large upload area is gone, replaced by a compact header or toolbar.
- [ ] Summary is the first and most prominent result, in plain language.
- [ ] "What should I do next?" is visually paired with the summary and is easy to see without a long scroll.
- [ ] Important dates are easy to scan and can show deadlines, a joining or start date, a response date, or other relevant dates from the letter.
- [ ] Money / compensation clearly shows salary, bonuses, benefits, or other amounts mentioned in the letter.
- [ ] Action items show things to do, provide, sign, or complete.
- [ ] People & organizations identify the employer, candidate, recruiter, hiring manager, or other relevant entities from the letter.
- [ ] No result category beyond these six is shown.
- [ ] A section with nothing relevant still appears, with a clear empty message: "No important dates found.", "No action items found.", "No people or organizations found.", "No compensation amounts found.", "No specific next step identified.", or "No summary available."
- [ ] An empty section does not contain invented information, and it is visually distinct from both a real result and an error.
- [ ] "Analyze another document" is available as a small secondary action and does not compete with the results.
- [ ] Clicking "Analyze another document" clears the results and the active selection, and shows the initial upload and sample state.
- [ ] After "Analyze another document", Analyze Document is unavailable until a new file or the sample is selected, and no analysis starts on its own.
- [ ] Results from the previous document are not visible while another document is being chosen.

## States and Boundaries

- **Before a document is selected.** Header, upload area, sample option, inactive Analyze Document, and secondary guidance. No results.
- **File selected.** A supported file’s name is shown, that file is visibly the only active document, and Analyze Document is actionable. A previously selected sample is de-emphasized or cleared.
- **Unsupported file.** An inline error near the upload area says “Unsupported file type. Please upload a PDF, DOCX, or TXT file.” The file is not active. Analyze Document is not enabled by it. There is no in-progress state. The sample remains available. A previously valid selection is not silently replaced.
- **Sample selected.** The built-in sample is visibly the only active document, and Analyze Document is actionable. A previously selected file is de-emphasized or cleared.
- **Analysis in progress.** Loading indicator, "Analyzing your offer letter…", the secondary explanation, and the selected document or sample name. No result cards. No second analysis.
- **Analysis failed.** A clear error says DocLens could not analyze the document. "Try again" is prominent.
- **Returned to selection after failure.** The upload and sample area is back. The previous document remains available when possible. Analyze Document waits for an explicit click. Choosing the sample is available. A repeated failure shows the same error.
- **Successful analysis.** The upload area has collapsed. The six cards are visible in the hierarchy above. A small "Analyze another document" action is present and visually secondary.
- **Analyze another document.** Results and the active selection are cleared. The initial upload and sample state is back. Analyze Document is inactive until a new choice is made. Previous results are not kept on screen.
- **Empty result section.** The section stays visible. It shows "No important dates found.", "No action items found.", "No people or organizations found.", "No compensation amounts found.", "No specific next step identified.", or "No summary available." It does not look like an error, and it does not contain guessed content.

Nothing is stored. Closing the page ends the session. There is no account and no history. Source: `scope.md > Explicitly Cut`.

No product behavior is still undefined for this proof of concept.

## Product Decisions

- **One landing state on the same screen, before any analysis.** The first view is the upload and sample choice, so the job seeker knows what to do immediately.
- **Hierarchy is DocLens, value statement, upload or sample, then Analyze Document.** The header stays minimal so it does not compete with that action.
- **Value statement copy:** "Understand your offer letter in seconds."
- **Sample label:** "Try the sample offer letter," placed next to or below the upload area, because the sample is the reliable demo path.
- **Analyze Document is inactive until a valid file or the sample is selected.** A supported document is required before the first pass can run. Selecting one does not start analysis.
- **The most recently selected valid option is the only active document.** A later choice of the sample replaces a supported file, and a later choice of a supported file replaces the sample. The active choice is visually obvious, and the other is de-emphasized or cleared. Analyze Document never has two equal candidates, and selecting one does not analyze the other.
- **A chosen file's name is shown.** The user can see what will be analyzed.
- **Guidance is secondary.** It names the six kinds of extracted information without becoming the focus.
- **No dashboard, sidebar, navigation, chat, authentication, history, or multiple workflows.** Those would hide the one action. Source: `scope.md > Explicitly Cut`.
- **After success, the upload area collapses into a compact header or toolbar.** The first pass is what the user sees, without scrolling past the original upload area.
- **Result emphasis is Summary + Next Step, then Dates / Money, then Actions / People & Organizations.** Summary is first. "What should I do next?" stays beside it because the value is an actionable next step. Dates, money, actions, and people follow in a responsive card grid.
- **No result categories beyond the six in scope.** The screen stays a first pass of one offer letter.
- **An empty section stays visible and says so plainly.** Dates: "No important dates found." Actions: "No action items found." People and organizations: "No people or organizations found." Money: "No compensation amounts found." Next step: "No specific next step identified." Summary: "No summary available." The layout stays the same across documents. Empty copy is distinct from a real result and from an error. Nothing is invented to fill a section.
- **"Analyze another document" returns to a clean selection state.** It clears the results and the active document, restores the upload area and the sample option, and leaves Analyze Document inactive until a new choice. It does not start an analysis. Previous results are never shown while another document is being chosen.
- **The click goes through a calm in-progress state before any results.** The message is "Analyzing your offer letter…", with the selected name visible. Result cards appear only after success. A second analysis cannot be started while one is running.
- **Failure replaces the loading state with a clear error and "Try again".** The message is that DocLens could not analyze the document. "Try again" returns to document selection, keeps the previous document available when possible, and does not start analysis. The user clicks Analyze Document again, on that document or on the sample. The same document failing again shows the same error. No guessed results are shown. The loading state stays brief and does not use a progress percentage or fake processing steps.
- **The look is a calm document-reading tool.** Readable sans-serif, light neutral background, one subtle accent, sparse semantic color, and quiet cards. Summary and "What should I do next?" carry the strongest emphasis. No chatbot styling, neon, glow, or a named product to copy. The impression to protect is: this is a simple tool that helps someone understand an important document.
- **The built-in sample exercises all six sections.** It is a fictional one-to-two-page offer with a role and employer, an offer date, an acceptance deadline, a start date, at least two explicit actions, the candidate, the employer, another person, annual pay, and one more amount. The next step comes from those facts. It adds no new product feature. The visible payoff is the first pass appearing at once: dates, compensation, actions, people, a short explanation, and a grounded "What should I do next?"
- **Uploads are PDF, DOCX, or TXT.** PDF is the format to show in the demo. The control says “Upload an offer letter — PDF, DOCX, or TXT”. An unsupported file is rejected at selection time with “Unsupported file type. Please upload a PDF, DOCX, or TXT file.” It never becomes the active document, never enables Analyze Document, and never enters the analyzing state. The sample stays available, and a supported file can be chosen next without a reload. A valid selection is not silently replaced. A supported file that fails later is a different state: the analysis error and “Try again”.

## What We're Building

The approved proof of concept: one browser screen, upload or the required built-in sample, one Analyze Document action, and one first-pass result with the six sections. The offer-letter journey is the only journey. The screen before analysis, document selection, upload validation, the in-progress state, the failure path, empty sections, the screen after a successful analysis, the look and feel, and the built-in sample are defined above.

## Deferred From the POC

Accepting other document types without a separate workflow for each one. Source: `scope.md > Later`.

## Possible Later Enhancements

A way to bring a non-offer document through the same single analysis screen, after this proof is solid. No separate invoice, notice, or agreement journey.

## Non-Goals

Source: `scope.md > Explicitly Cut`.

- Authentication, user accounts, and collaboration. One person, one letter, one sitting.
- A database and document history. The result lives on the screen.
- Separate workflows for invoices, notices, or agreements.
- Payments, chatbots, vector databases, retrieval-augmented generation, and complicated document management.
- Required deployment and production infrastructure. Deployment stays optional.
- Extra features added to make the project look larger.

## Open Questions

None. The agreed behavior for this proof of concept is recorded above.

---
doc: scope
status: approved
---

# DocLens

A browser tool that gives a job seeker a clear first pass of an offer letter.

## The Unique Kernel

DocLens turns one offer letter into an organized, actionable first pass: what the offer means, which dates matter, what actions to take, who the people and organizations are, what money or compensation amounts are mentioned, and what to do next. The job seeker should understand the important parts without searching through the whole document. A plain summary, a chatbot, or a document-management system would not be this product. For the demo, a built-in sample offer letter makes that first pass reliable to reach in about a minute.

## Who It's For

A job seeker who has just received an offer letter and wants to understand it before deciding what to do next. Today they read the letter and hunt through it by hand for the meaning, the dates, the required actions, the names, and the compensation.

## The Core Loop

They open DocLens in a browser and see a simple document-analysis screen. They upload an offer letter or choose the built-in sample offer letter, then click Analyze Document. DocLens processes that document and shows the first-pass analysis. The sample path is the fastest, most reliable way through the loop. One letter, one sitting, is enough to prove it. Coming back later is not part of this proof.

## Inspiration & Identity

A simple document-analysis screen. The priority is reliability and clarity over feature count. No specific product was named as a visual reference. The tone is practical and direct: a useful reading of the letter.

## Why This Matters to the Learner

Practical AI for an everyday problem: useful information buried in a document, with an output that is actionable rather than only a summary. This hackathon is also practice in a disciplined plan-first process, keeping the proof small enough to build and demonstrate properly.

## What "Working" Looks Like

A job seeker opens DocLens in a browser and sees a simple document-analysis screen.

1. They open DocLens.
2. They upload an offer-letter document or choose a built-in sample offer letter.
3. The built-in sample offer letter is available, because that is the fastest and most reliable demo.
4. They click Analyze Document.
5. DocLens processes the document and presents a clear first-pass analysis.
6. The results visibly contain a plain-language summary, important dates, action items, people and organizations, money or compensation amounts, and a "What should I do next?" section.
7. They can understand the important parts of the offer letter without manually searching through the entire document.
8. The demo can be done in about one minute, from opening the application to seeing the final results.

The proof is that a real offer letter can be provided to DocLens and the resulting screen gives a useful, organized first pass. The proof is not a production deployment or a sophisticated document-management system. The "oh, that's cool" beat is the "What should I do next?" section sitting next to the dates, actions, people, and amounts, so the next decision is visible without rereading the letter.

## The POC Boundary

In: one browser screen for analyzing an offer letter; upload or the built-in sample, with the sample required for the demo; one Analyze Document action; one results view with the six sections above. The offer-letter scenario is the only user journey. Reliability and clarity come before feature count.

## Later

Accepting other document types without designing a separate workflow for each one. Worth doing after this proof, not as part of it.

## Explicitly Cut

- **Authentication, user accounts, and collaboration.** One job seeker reads one letter in one sitting. Accounts and sharing do not prove the first pass.
- **A database and document history.** Nothing needs to be stored or revisited. The result lives on the screen for the demo.
- **Separate workflows for invoices, notices, or agreements.** Those are different jobs. Designing them now would blur the offer-letter proof.
- **Payments, chatbots, vector databases, retrieval-augmented generation, and complicated document management.** They do not help show the one-minute first pass.
- **Production infrastructure and required deployment.** Deployment is optional. The finish line is the on-screen analysis, shown in a short demo from a public GitHub repository.
- **Extra features added to make the project look larger.** Reliability and clarity are the priority.

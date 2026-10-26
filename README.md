# DocLens

DocLens is a one-screen browser tool that gives a job seeker a first pass of an offer letter: a summary, important dates, action items, people and organizations, money, and what to do next.

The reading is local and deterministic. The page extracts text from the document, then a reader fills the six sections only with facts it can support from that text. It does not call an AI model, and it does not need an API key.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`

## Setup

```bash
npm install
```

No environment variables are required.

## Run locally

```bash
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173`.

## Demo

1. Click **Try the sample offer letter**.
2. Click **Analyze Document**.
3. Read the summary and **What should I do next?**, then the dates, compensation, actions, and people.

You can also upload a digital PDF, DOCX, or TXT offer letter. PDF is the upload format to show. Other file types are rejected before analysis.

## Tests and build

```bash
npm test
npm run build
```

`npm run preview` serves the production build locally.

## What this proof leaves out

Accounts, a database, document history, a server, a model API, and separate workflows for other document types.

import type { Analysis } from "../lib/analysis"
import { SAMPLE_DOCUMENT_NAME, sampleOfferLetter } from "../sample/offerLetter"

export const UNSUPPORTED_MESSAGE =
  "Unsupported file type. Please upload a PDF, DOCX, or TXT file."

export const FAILURE_MESSAGE = "DocLens could not analyze the document."

export type ActiveDocument =
  | { kind: "sample"; name: typeof SAMPLE_DOCUMENT_NAME; text: string }
  | { kind: "file"; name: string; file: File }

export type Screen =
  | { status: "initial" }
  | { status: "ready"; active: ActiveDocument }
  | { status: "unsupported"; message: string; active: ActiveDocument | null }
  | { status: "analyzing"; active: ActiveDocument }
  | { status: "success"; active: ActiveDocument; analysis: Analysis }
  | { status: "failed"; active: ActiveDocument }

export type ScreenAction =
  | { type: "select-sample" }
  | { type: "select-file"; file: File }
  | { type: "reject-file" }
  | { type: "start" }
  | { type: "success"; analysis: Analysis }
  | { type: "fail" }
  | { type: "try-again" }
  | { type: "analyze-another" }

export const initialScreen: Screen = { status: "initial" }

function sampleDocument(): ActiveDocument {
  return { kind: "sample", name: SAMPLE_DOCUMENT_NAME, text: sampleOfferLetter }
}

function keptActive(state: Screen): ActiveDocument | null {
  if (state.status === "ready" || state.status === "unsupported") return state.active
  return null
}

function blocked(state: Screen): boolean {
  return state.status === "analyzing" || state.status === "success" || state.status === "failed"
}

export function screenReducer(state: Screen, action: ScreenAction): Screen {
  switch (action.type) {
    case "select-sample":
      if (blocked(state)) return state
      return { status: "ready", active: sampleDocument() }
    case "select-file":
      if (blocked(state)) return state
      return { status: "ready", active: { kind: "file", name: action.file.name, file: action.file } }
    case "reject-file":
      if (blocked(state)) return state
      return { status: "unsupported", message: UNSUPPORTED_MESSAGE, active: keptActive(state) }
    case "start":
      if (state.status === "ready") return { status: "analyzing", active: state.active }
      if (state.status === "unsupported" && state.active) {
        return { status: "analyzing", active: state.active }
      }
      return state
    case "success":
      if (state.status !== "analyzing") return state
      return { status: "success", active: state.active, analysis: action.analysis }
    case "fail":
      if (state.status !== "analyzing") return state
      return { status: "failed", active: state.active }
    case "try-again":
      if (state.status !== "failed") return state
      return { status: "ready", active: state.active }
    case "analyze-another":
      if (state.status !== "success") return state
      return initialScreen
    default:
      return state
  }
}

export function activeDocument(state: Screen): ActiveDocument | null {
  if (state.status === "initial") return null
  return state.active
}

export function canAnalyze(state: Screen): boolean {
  return state.status === "ready" || (state.status === "unsupported" && state.active !== null)
}

import { useReducer, useRef } from "react"
import { analyzeOffer } from "./lib/analyzeOffer"
import { extractFileText } from "./lib/extractText"
import { isSupportedOfferFile } from "./lib/fileKind"
import { ANALYSIS_PAUSE_MS } from "./sample/offerLetter"
import { AnalyzingPanel } from "./components/AnalyzingPanel"
import { FailurePanel } from "./components/FailurePanel"
import { Results } from "./components/Results"
import { SelectionPanel } from "./components/SelectionPanel"
import {
  FAILURE_MESSAGE,
  activeDocument,
  canAnalyze,
  initialScreen,
  screenReducer,
} from "./state/screen"

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function App() {
  const [screen, dispatch] = useReducer(screenReducer, initialScreen)
  const running = useRef(false)
  const active = activeDocument(screen)

  async function onAnalyze() {
    if (!canAnalyze(screen) || !active || running.current) return
    const chosen = active
    running.current = true
    dispatch({ type: "start" })
    try {
      await wait(ANALYSIS_PAUSE_MS)
      const text = chosen.kind === "sample" ? chosen.text : await extractFileText(chosen.file)
      if (!text.trim()) throw new Error("empty")
      dispatch({ type: "success", analysis: analyzeOffer(text) })
    } catch {
      dispatch({ type: "fail" })
    } finally {
      running.current = false
    }
  }

  function onFile(file: File) {
    if (screen.status === "analyzing") return
    if (!isSupportedOfferFile(file.name)) {
      dispatch({ type: "reject-file" })
      return
    }
    dispatch({ type: "select-file", file })
  }

  const showSelection = screen.status === "initial" || screen.status === "ready" || screen.status === "unsupported"

  return (
    <div className={screen.status === "success" ? "app has-results" : "app"}>
      <header className="masthead">
        <p className="eyebrow">Offer letter reading</p>
        <h1>DocLens</h1>
        <p className="value">Understand your offer letter in seconds.</p>
      </header>
      <main>
        {showSelection ? (
          <SelectionPanel
            active={active}
            error={screen.status === "unsupported" ? screen.message : null}
            canAnalyze={canAnalyze(screen)}
            onSample={() => dispatch({ type: "select-sample" })}
            onFile={onFile}
            onAnalyze={() => {
              void onAnalyze()
            }}
          />
        ) : null}
        {screen.status === "analyzing" ? <AnalyzingPanel documentName={screen.active.name} /> : null}
        {screen.status === "failed" ? (
          <FailurePanel
            message={FAILURE_MESSAGE}
            onRetry={() => dispatch({ type: "try-again" })}
          />
        ) : null}
        {screen.status === "success" ? (
          <Results
            documentName={screen.active.name}
            analysis={screen.analysis}
            onAnother={() => dispatch({ type: "analyze-another" })}
          />
        ) : null}
      </main>
    </div>
  )
}

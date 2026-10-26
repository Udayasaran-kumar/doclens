import type { ActiveDocument } from "../state/screen"

type SelectionPanelProps = {
  active: ActiveDocument | null
  error: string | null
  canAnalyze: boolean
  onSample: () => void
  onFile: (file: File) => void
  onAnalyze: () => void
}

export function SelectionPanel({
  active,
  error,
  canAnalyze,
  onSample,
  onFile,
  onAnalyze,
}: SelectionPanelProps) {
  return (
    <section className="selection" aria-labelledby="choose-label">
      <div className="choice">
        <label
          className={active?.kind === "file" ? "drop is-active" : "drop"}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault()
            const file = event.dataTransfer.files[0]
            if (file) onFile(file)
          }}
        >
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onFile(file)
              event.target.value = ""
            }}
          />
          <span id="choose-label" className="drop-title">
            Upload an offer letter — PDF, DOCX, or TXT
          </span>
          <span className="drop-hint">Drag and drop a file here, or choose one.</span>
          {active?.kind === "file" ? <strong className="file-name">{active.name}</strong> : null}
        </label>
        <button
          type="button"
          className={active?.kind === "sample" ? "sample is-active" : "sample"}
          aria-pressed={active?.kind === "sample"}
          onClick={onSample}
        >
          Try the sample offer letter
        </button>
      </div>
      {active?.kind === "sample" ? <p className="selected-name">Sample offer letter</p> : null}
      {error ? (
        <p className="inline-error" role="alert">
          {error}
        </p>
      ) : null}
      <button type="button" className="analyze" disabled={!canAnalyze} onClick={onAnalyze}>
        Analyze Document
      </button>
      <p className="guidance">
        DocLens extracts the important parts of an offer letter: summary, dates, actions, people
        and organizations, compensation, and next steps.
      </p>
    </section>
  )
}

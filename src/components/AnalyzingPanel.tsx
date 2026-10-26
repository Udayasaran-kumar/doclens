type AnalyzingPanelProps = {
  documentName: string
}

export function AnalyzingPanel({ documentName }: AnalyzingPanelProps) {
  return (
    <section className="analyzing" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <h2>Analyzing your offer letter…</h2>
      <p>DocLens is extracting the important details and preparing the first pass.</p>
      <p className="selected-name">{documentName}</p>
    </section>
  )
}

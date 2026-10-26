type FailurePanelProps = {
  message: string
  onRetry: () => void
}

export function FailurePanel({ message, onRetry }: FailurePanelProps) {
  return (
    <section className="failure" role="alert">
      <h2>{message}</h2>
      <button type="button" className="analyze" onClick={onRetry}>
        Try again
      </button>
    </section>
  )
}

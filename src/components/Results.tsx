import { EMPTY_COPY, type Analysis, type PersonOrg } from "../lib/analysis"

type ResultsProps = {
  documentName: string
  analysis: Analysis
  onAnother: () => void
}

function personLabel(role: PersonOrg["role"]): string {
  if (role === "candidate") return "Candidate"
  if (role === "employer") return "Employer"
  return "Named in the letter"
}

export function Results({ documentName, analysis, onAnother }: ResultsProps) {
  const moneyEmpty = analysis.compensation.amounts.length === 0 && !analysis.compensation.benefitsNote

  return (
    <section className="results" aria-label="Offer letter first pass">
      <div className="toolbar">
        <p>
          Reading <strong>{documentName}</strong>
        </p>
        <button type="button" className="text-button" onClick={onAnother}>
          Analyze another document
        </button>
      </div>
      <div className="grid">
        <article className={analysis.summary ? "card emphasis" : "card emphasis is-empty"}>
          <h2>Summary</h2>
          <p>{analysis.summary ?? EMPTY_COPY.summary}</p>
        </article>
        <article className={analysis.nextStep ? "card emphasis" : "card emphasis is-empty"}>
          <h2>What should I do next?</h2>
          <p>{analysis.nextStep ?? EMPTY_COPY.nextStep}</p>
        </article>
        <article className={analysis.importantDates.length > 0 ? "card" : "card is-empty"}>
          <h2>Important dates</h2>
          {analysis.importantDates.length > 0 ? (
            <ul>
              {analysis.importantDates.map((item) => (
                <li key={`${item.label}-${item.date}`}>
                  <span>{item.label}</span>
                  {item.date}
                </li>
              ))}
            </ul>
          ) : (
            <p>{EMPTY_COPY.dates}</p>
          )}
        </article>
        <article className={moneyEmpty ? "card is-empty" : "card"}>
          <h2>Money / compensation</h2>
          {moneyEmpty ? (
            <p>{EMPTY_COPY.money}</p>
          ) : (
            <>
              {analysis.compensation.amounts.length > 0 ? (
                <ul>
                  {analysis.compensation.amounts.map((item) => (
                    <li key={`${item.label}-${item.amount}`}>
                      <span>{item.label}</span>
                      {item.amount}
                    </li>
                  ))}
                </ul>
              ) : null}
              {analysis.compensation.benefitsNote ? (
                <p className="benefits">Benefits: {analysis.compensation.benefitsNote}</p>
              ) : null}
            </>
          )}
        </article>
        <article className={analysis.actionItems.length > 0 ? "card" : "card is-empty"}>
          <h2>Action items</h2>
          {analysis.actionItems.length > 0 ? (
            <ul>
              {analysis.actionItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{EMPTY_COPY.actions}</p>
          )}
        </article>
        <article className={analysis.peopleOrganizations.length > 0 ? "card" : "card is-empty"}>
          <h2>People & organizations</h2>
          {analysis.peopleOrganizations.length > 0 ? (
            <ul>
              {analysis.peopleOrganizations.map((item) => (
                <li key={`${item.role}-${item.name}`}>
                  <span>{personLabel(item.role)}</span>
                  {item.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>{EMPTY_COPY.people}</p>
          )}
        </article>
      </div>
    </section>
  )
}

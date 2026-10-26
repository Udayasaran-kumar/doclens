import { type Analysis, type DateItem, type MoneyItem, type PersonOrg, emptyAnalysis } from "./analysis"

const MONTHS =
  "January|February|March|April|May|June|July|August|September|October|November|December"

function datePattern(): RegExp {
  return new RegExp(`\\b(?:${MONTHS})\\s+\\d{1,2},\\s+\\d{4}\\b|\\b\\d{4}-\\d{2}-\\d{2}\\b`, "g")
}

function moneyPattern(): RegExp {
  return /\$\s?\d{1,3}(?:,\d{3})+(?:\.\d{2})?/g
}

function sentencesOf(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

function sentenceAt(text: string, index: number): string {
  const sentences = sentencesOf(text)
  let cursor = 0
  const normalized = text.replace(/\s+/g, " ")
  const flatIndex = text.slice(0, index).replace(/\s+/g, " ").length
  for (const sentence of sentences) {
    const start = normalized.indexOf(sentence, cursor)
    if (start === -1) continue
    const end = start + sentence.length
    if (flatIndex >= start && flatIndex <= end) return sentence
    cursor = end
  }
  return sentences[0] ?? ""
}

function isOpeningDate(text: string, index: number): boolean {
  const firstLine = text.split(/\n/).map((line) => line.trim()).find(Boolean) ?? ""
  const match = firstLine.match(datePattern())
  if (!match) return false
  return text.indexOf(match[0]) === index
}

function labelDate(text: string, index: number, date: string): string {
  if (isOpeningDate(text, index)) return "Offer date"
  const before = text.slice(Math.max(0, index - 90), index)
  const sentenceBreak = Math.max(before.lastIndexOf("."), before.lastIndexOf("!"), before.lastIndexOf("?"))
  const localBefore = sentenceBreak >= 0 ? before.slice(sentenceBreak + 1) : before
  const localAfter = text.slice(index + date.length, index + date.length + 36)
  const local = `${localBefore}${date}${localAfter}`
  if (/\b(submit|documents)\b/i.test(localBefore)) return "Other date"
  if (/\bstart date\b/i.test(local)) return "Start date"
  if (/\b(accept|acceptance|respond by)\b/i.test(local)) return "Acceptance deadline"
  if (/\boffer date\b/i.test(local)) return "Offer date"
  return "Other date"
}

function findDates(text: string): DateItem[] {
  const found: DateItem[] = []
  for (const match of text.matchAll(datePattern())) {
    if (match.index === undefined) continue
    const date = match[0]
    found.push({
      label: labelDate(text, match.index, date),
      date,
    })
  }
  return found
}

function labelMoney(sentence: string): string {
  if (/\bbonus\b/i.test(sentence) && /\bjoining\b/i.test(sentence)) return "Joining bonus"
  if (/\bbonus\b/i.test(sentence) && /\bperformance\b/i.test(sentence)) return "Performance bonus"
  if (/\bbonus\b/i.test(sentence)) return "Bonus"
  if (/\b(salary|annual|compensation)\b/i.test(sentence)) return "Annual salary"
  return "Amount"
}

function findMoney(text: string): MoneyItem[] {
  const amounts: MoneyItem[] = []
  for (const match of text.matchAll(moneyPattern())) {
    if (match.index === undefined) continue
    amounts.push({
      label: labelMoney(sentenceAt(text, match.index)),
      amount: match[0].replace(/\s+/g, ""),
    })
  }
  return amounts
}

function findActions(text: string): string[] {
  return sentencesOf(text).filter(
    (sentence) =>
      /\b(please|you must|you will need to|required to)\b/i.test(sentence) &&
      /\b(sign|accept|submit|return|complete|provide)\b/i.test(sentence),
  )
}

function findPeople(text: string): { people: PersonOrg[]; roleTitle: string | null; company: string | null; candidate: string | null } {
  const candidate = text.match(/Dear ([A-Z][a-z]+(?: [A-Z][a-z]+)+)/)?.[1] ?? null
  const company = text.match(/([A-Z][a-z]+(?: [A-Z][a-z]+)*) is pleased to offer/)?.[1] ?? null
  const roleTitle = text.match(/the role of ([A-Z][a-z]+(?: [A-Z][a-z]+)*)/)?.[1] ?? null
  const other =
    text.match(/hiring manager, ([A-Z][a-z]+(?: [A-Z][a-z]+)+)/i)?.[1] ??
    text.match(/recruiter, ([A-Z][a-z]+(?: [A-Z][a-z]+)+)/i)?.[1] ??
    null

  const people: PersonOrg[] = []
  if (candidate) people.push({ name: candidate, role: "candidate" })
  if (company) people.push({ name: company, role: "employer" })
  if (other) people.push({ name: other, role: "person" })
  return { people, roleTitle, company, candidate }
}

function benefitsNote(text: string): string | null {
  const sentence = sentencesOf(text).find(
    (item) => /medical|dental|paid vacation/i.test(item) && !/\$/.test(item),
  )
  return sentence ?? null
}

function summaryFrom(facts: {
  company: string | null
  candidate: string | null
  roleTitle: string | null
  annual: string | null
  start: string | null
}): string | null {
  if (!facts.company || !facts.roleTitle) return null
  const who = facts.candidate ?? "you"
  const parts = [`${facts.company} offers ${who} the ${facts.roleTitle} role.`]
  const extras: string[] = []
  if (facts.annual) extras.push(`an annual salary of ${facts.annual}`)
  if (facts.start) extras.push(`a start date of ${facts.start}`)
  if (extras.length > 0) parts.push(`It includes ${extras.join(" and ")}.`)
  return parts.join(" ")
}

function nextStepFrom(dates: DateItem[], actions: string[]): string | null {
  const acceptance = dates.find((item) => item.label === "Acceptance deadline")?.date
  const other = dates.find((item) => item.label === "Other date")?.date
  const lines: string[] = []
  if (acceptance && actions.some((action) => /\b(sign|accept|return)\b/i.test(action))) {
    lines.push(`Sign and return the letter by ${acceptance}.`)
  }
  if (other && actions.some((action) => /\bsubmit\b/i.test(action))) {
    lines.push(`Submit the identification documents by ${other}.`)
  }
  return lines.length > 0 ? lines.join(" ") : null
}

export function analyzeOffer(text: string): Analysis {
  const dates = findDates(text)
  const amounts = findMoney(text)
  const actions = findActions(text)
  const { people, roleTitle, company, candidate } = findPeople(text)
  const annual = amounts.find((item) => item.label === "Annual salary")?.amount ?? null
  const start = dates.find((item) => item.label === "Start date")?.date ?? null

  const analysis = emptyAnalysis()
  analysis.importantDates = dates
  analysis.compensation = { amounts, benefitsNote: benefitsNote(text) }
  analysis.actionItems = actions
  analysis.peopleOrganizations = people
  analysis.summary = summaryFrom({ company, candidate, roleTitle, annual, start })
  analysis.nextStep = nextStepFrom(dates, actions)
  return analysis
}

import { type Analysis, type DateItem, type MoneyItem, type PersonOrg, emptyAnalysis } from "./analysis"

const MONTHS =
  "January|February|March|April|May|June|July|August|September|October|November|December"

const ORG_WORD = "(?!Pvt\\b|Ltd\\b|Inc\\b|LLC\\b|LLP\\b|Limited\\b|Corp\\b|Corporation\\b)[A-Z][A-Za-z0-9&'-]*"
const ORG_SUFFIX = "Pvt\\.|Ltd\\.|Inc\\.|LLC|LLP|Limited|Corp\\.|Corporation"
const ORGANIZATION = `${ORG_WORD}(?: ${ORG_WORD})*(?: (?:${ORG_SUFFIX}))*`
const ROLE = "[A-Z][a-z]+(?: [A-Z][a-z]+)*"
const NAME_WORD = "[A-Z][a-z]+"
const FULL_NAME = `${NAME_WORD}(?: ${NAME_WORD})+`
const GIVEN_NAME = `${NAME_WORD}(?: ${NAME_WORD})*`

const NAME_STOP = new Set([
  "Subject",
  "Offer",
  "Dear",
  "Date",
  "Your",
  "Please",
  "Sincerely",
  "Engineering",
  "Manager",
  "Employment",
])

function datePattern(): RegExp {
  return new RegExp(`\\b(?:${MONTHS})\\s+\\d{1,2},\\s+\\d{4}\\b|\\b\\d{4}-\\d{2}-\\d{2}\\b`, "g")
}

function moneyPattern(): RegExp {
  return /(?:₹|(?<![A-Za-z])(?:INR|Rs\.?)|\$)\s?\d{1,3}(?:,\d{2,3})+(?:\.\d{2})?/g
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

function isOfferDateContext(localBefore: string): boolean {
  if (/\b(?:offer\s+date|date\s+of\s+offer|date)\s*:\s*$/i.test(localBefore)) return true
  if (/\bdated\s*$/i.test(localBefore)) return true
  if (/\boffer\s+letter\b/i.test(localBefore)) return true
  return false
}

function sameSentenceAfter(text: string, index: number, date: string): string {
  const raw = text.slice(index + date.length, index + date.length + 36)
  const breakAt = raw.search(/[.!?]|\n\s*\n/)
  return breakAt >= 0 ? raw.slice(0, breakAt) : raw
}

function labelDate(text: string, index: number, date: string): string {
  if (isOpeningDate(text, index)) return "Offer date"
  const before = text.slice(Math.max(0, index - 90), index)
  const sentenceBreak = Math.max(before.lastIndexOf("."), before.lastIndexOf("!"), before.lastIndexOf("?"))
  const localBefore = sentenceBreak >= 0 ? before.slice(sentenceBreak + 1) : before
  const localAfter = sameSentenceAfter(text, index, date)
  const local = `${localBefore}${date}${localAfter}`
  if (/\b(submit|documents)\b/i.test(localBefore)) return "Other date"
  if (/\bstart date\b/i.test(local)) return "Start date"
  if (/\b(accept|acceptance|respond by)\b/i.test(local)) return "Acceptance deadline"
  if (isOfferDateContext(localBefore)) return "Offer date"
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
      amount: match[0],
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

function trimName(raw: string, minWords: number): string | null {
  const kept: string[] = []
  for (const word of raw.split(/\s+/)) {
    if (!/^[A-Z][a-z]+$/.test(word) || NAME_STOP.has(word)) break
    kept.push(word)
    if (kept.length === 4) break
  }
  if (kept.length < minWords) return null
  return kept.join(" ")
}

function captureName(text: string, pattern: RegExp, minWords: number): string | null {
  const raw = text.match(pattern)?.[1]
  if (!raw) return null
  return trimName(raw, minWords)
}

function findCandidate(text: string): string | null {
  const addressed = captureName(text, new RegExp(`\\bTo:\\s*(${FULL_NAME}(?: ${NAME_WORD}){0,2})`, "i"), 2)
  const dear = captureName(text, new RegExp(`\\bDear\\s+(${GIVEN_NAME})`, "i"), 1)
  if (addressed && dear && (addressed === dear || addressed.startsWith(`${dear} `))) return addressed
  return addressed ?? dear
}

function findCompany(text: string): string | null {
  const pleased = text.match(new RegExp(`(${ORGANIZATION}) is pleased to offer`))?.[1] ?? null
  if (pleased) return pleased
  return text.match(new RegExp(`the (?:role|position) of ${ROLE} at (${ORGANIZATION})`))?.[1] ?? null
}

function findRole(text: string): string | null {
  const labeled = text.match(new RegExp(`the (?:role|position) of (${ROLE})`))?.[1] ?? null
  if (labeled) return labeled
  return text.match(new RegExp(`Offer of Employment\\s+[—–-]\\s+(${ROLE})`))?.[1] ?? null
}

function findOtherPerson(text: string): string | null {
  return captureName(
    text,
    new RegExp(
      `\\b(?:hiring manager|reporting manager|recruiter)(?:,| will be)\\s*(${FULL_NAME}(?: ${NAME_WORD}){0,2})`,
      "i",
    ),
    2,
  )
}

function findPeople(text: string): {
  people: PersonOrg[]
  roleTitle: string | null
  company: string | null
  candidate: string | null
} {
  const candidate = findCandidate(text)
  const company = findCompany(text)
  const roleTitle = findRole(text)
  const other = findOtherPerson(text)

  const people: PersonOrg[] = []
  if (candidate) people.push({ name: candidate, role: "candidate" })
  if (company) people.push({ name: company, role: "employer" })
  if (other) people.push({ name: other, role: "person" })
  return { people, roleTitle, company, candidate }
}

function benefitsNote(text: string): string | null {
  const sentence = sentencesOf(text).find((item) => {
    if (!/medical|dental|paid vacation/i.test(item)) return false
    return !moneyPattern().test(item)
  })
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

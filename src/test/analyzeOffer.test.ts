import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { EMPTY_COPY, type Analysis } from "../lib/analysis"
import { analyzeOffer } from "../lib/analyzeOffer"
import { extractFileText } from "../lib/extractText"
import { sampleOfferLetter } from "../sample/offerLetter"

type PdfTextItem = { str?: string }

type PdfDocument = {
  numPages: number
  getPage(pageNumber: number): Promise<{
    getTextContent(): Promise<{ items: PdfTextItem[] }>
  }>
}

declare module "pdfjs-dist/legacy/build/pdf.mjs" {
  export function getDocument(src: {
    data: Uint8Array
    disableWorker?: boolean
    isEvalSupported?: boolean
  }): { promise: Promise<PdfDocument> }
}

declare const process: { cwd(): string }

function fixture(name: string): string {
  return `${process.cwd()}/src/test/fixtures/${name}`
}

function fixtureFile(name: string): File {
  const bytes = readFileSync(fixture(name))
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return new File([copy], name)
}

async function extractPdfText(bytes: Uint8Array): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs")
  const document = await pdfjs.getDocument({ data: bytes, disableWorker: true, isEvalSupported: false }).promise
  const pages: string[] = []
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber)
    const content = await page.getTextContent()
    const text = content.items.map((item) => item.str ?? "").join(" ")
    pages.push(text)
  }
  return pages.join("\n")
}

function expectTraceable(result: Analysis, source: string) {
  const flat = source.replace(/\s+/g, " ")
  for (const person of result.peopleOrganizations) expect(source).toContain(person.name)
  for (const date of result.importantDates) expect(source).toContain(date.date)
  for (const amount of result.compensation.amounts) expect(source).toContain(amount.amount)
  for (const action of result.actionItems) expect(flat).toContain(action)
  if (result.compensation.benefitsNote) expect(flat).toContain(result.compensation.benefitsNote)
  if (result.summary) {
    for (const person of result.peopleOrganizations) {
      if (result.summary.includes(person.name)) expect(source).toContain(person.name)
    }
  }
}

function expectArjunLetter(result: Analysis, source: string) {
  expect(result.peopleOrganizations).toEqual([
    { name: "Arjun Mehta", role: "candidate" },
    { name: "BrightRiver Technologies Pvt. Ltd.", role: "employer" },
    { name: "Elena Rodriguez", role: "person" },
  ])
  expect(result.compensation.amounts).toEqual([
    { label: "Annual salary", amount: "INR 12,00,000" },
    { label: "Joining bonus", amount: "INR 75,000" },
  ])
  expect(result.importantDates).toEqual([
    { label: "Offer date", date: "October 20, 2026" },
    { label: "Start date", date: "November 16, 2026" },
    { label: "Acceptance deadline", date: "October 30, 2026" },
  ])
  expect(result.actionItems).toHaveLength(2)
  expect(result.actionItems[0]).toContain("signing and returning")
  expect(result.actionItems[1]).toContain("government-issued identification")
  expect(result.actionItems[1]).toContain("highest educational certificate")
  expect(result.summary).toContain("BrightRiver Technologies Pvt. Ltd.")
  expect(result.summary).toContain("Arjun Mehta")
  expect(result.summary).toContain("Software Engineer")
  expect(result.summary).toContain("INR 12,00,000")
  expect(result.nextStep).toBe("Sign and return the letter by October 30, 2026.")
  expect(result.summary).not.toContain("$")
  expect(result.summary).not.toContain("Priya Shah")
  expectTraceable(result, source)
}

describe("analyzeOffer", () => {
  it("reads the sample letter into all six sections without adding facts", () => {
    const result = analyzeOffer(sampleOfferLetter)

    expect(result.summary).toContain("Northwind Labs offers Priya Shah the Product Designer role")
    expect(result.summary).toContain("$145,000")
    expect(result.summary).toContain("March 2, 2026")
    expect(result.nextStep).toContain("Sign and return the letter by January 29, 2026")
    expect(result.nextStep).toContain("Submit the identification documents by February 12, 2026")
    expect(result.importantDates).toEqual([
      { label: "Offer date", date: "January 15, 2026" },
      { label: "Start date", date: "March 2, 2026" },
      { label: "Acceptance deadline", date: "January 29, 2026" },
      { label: "Other date", date: "February 12, 2026" },
    ])
    expect(result.compensation.amounts).toEqual([
      { label: "Annual salary", amount: "$145,000" },
      { label: "Joining bonus", amount: "$15,000" },
    ])
    expect(result.compensation.benefitsNote).toContain("medical coverage")
    expect(result.actionItems).toHaveLength(2)
    expect(result.peopleOrganizations).toEqual([
      { name: "Priya Shah", role: "candidate" },
      { name: "Northwind Labs", role: "employer" },
      { name: "Elena Vasquez", role: "person" },
    ])
    expectTraceable(result, sampleOfferLetter)
  })

  it("reads the Arjun Mehta letter from the text fixture", () => {
    const source = readFileSync(fixture("arjun-mehta-offer.txt"), "utf8")
    expectArjunLetter(analyzeOffer(source), source)
  })

  it("reads the same facts from DOCX text extraction", async () => {
    const source = await extractFileText(fixtureFile("arjun-mehta-offer.docx"))
    expect(source).toContain("Arjun Mehta")
    expect(source).toContain("INR 12,00,000")
    expectArjunLetter(analyzeOffer(source), source)
  })

  it("reads the same facts from PDF text extraction", async () => {
    const bytes = readFileSync(fixture("arjun-mehta-offer.pdf"))
    const copy = new Uint8Array(bytes.byteLength)
    copy.set(bytes)
    const source = await extractPdfText(copy)
    expect(source).toContain("Arjun Mehta")
    expect(source).toContain("INR 12,00,000")
    expectArjunLetter(analyzeOffer(source), source)
  })

  it("recognizes rupee amounts and still recognizes dollars", () => {
    const rupees = analyzeOffer(
      "Dear Mina Rao, Harbor Labs is pleased to offer you the role of Data Analyst. Your annual salary will be ₹12,00,000. You will also receive a joining bonus of ₹75,000.",
    )
    expect(rupees.compensation.amounts).toEqual([
      { label: "Annual salary", amount: "₹12,00,000" },
      { label: "Joining bonus", amount: "₹75,000" },
    ])
    expect(rupees.peopleOrganizations.map((item) => item.name)).toEqual(["Mina Rao", "Harbor Labs"])
    expectTraceable(rupees, "Dear Mina Rao, Harbor Labs is pleased to offer you the role of Data Analyst. Your annual salary will be ₹12,00,000. You will also receive a joining bonus of ₹75,000.")

    const inr = analyzeOffer(
      "Your annual salary will be INR 12,00,000. You will also receive a joining bonus of INR 75,000.",
    )
    expect(inr.compensation.amounts).toEqual([
      { label: "Annual salary", amount: "INR 12,00,000" },
      { label: "Joining bonus", amount: "INR 75,000" },
    ])

    expect(analyzeOffer("Your annual salary will be Rs. 9,50,000.").compensation.amounts).toEqual([
      { label: "Annual salary", amount: "Rs. 9,50,000" },
    ])

    const dollars = analyzeOffer(
      "Your annual salary will be $120,000. You will also receive a joining bonus of $10,000.",
    )
    expect(dollars.compensation.amounts).toEqual([
      { label: "Annual salary", amount: "$120,000" },
      { label: "Joining bonus", amount: "$10,000" },
    ])
    expect(analyzeOffer("Your annual salary will be $1,250.50.").compensation.amounts[0]?.amount).toBe("$1,250.50")
    expect(analyzeOffer("Reference 12,00,000 is not pay.").compensation.amounts).toEqual([])
  })

  it("classifies an offer date from the wording around it", () => {
    const dated = analyzeOffer("Notes\n\nThis letter is dated October 20, 2026.\n\nYour start date will be November 16, 2026.")
    expect(dated.importantDates).toEqual([
      { label: "Offer date", date: "October 20, 2026" },
      { label: "Start date", date: "November 16, 2026" },
    ])

    const labeled = analyzeOffer("Notes\n\nDate of Offer: October 20, 2026\n\nWe meet on March 2, 2026.")
    expect(labeled.importantDates).toEqual([
      { label: "Offer date", date: "October 20, 2026" },
      { label: "Other date", date: "March 2, 2026" },
    ])

    const heading = analyzeOffer("ACME\n\nEMPLOYMENT OFFER LETTER\n\nOctober 20, 2026\n\nYour start date will be November 16, 2026.")
    expect(heading.importantDates[0]).toEqual({ label: "Offer date", date: "October 20, 2026" })
    expect(analyzeOffer("Offer Date: October 20, 2026").importantDates[0]?.label).toBe("Offer date")
    expect(analyzeOffer("Hello.\n\nWe meet on October 20, 2026.").importantDates[0]?.label).toBe("Other date")
  })

  it("leaves compensation empty when the letter states none", () => {
    const source =
      "Dear Mina Rao, Harbor Labs is pleased to offer you the role of Data Analyst. Please sign and return this letter by October 30, 2026 to accept the offer."
    const result = analyzeOffer(source)
    expect(result.compensation.amounts).toEqual([])
    expect(result.compensation.benefitsNote).toBeNull()
    expect(result.summary).toContain("Harbor Labs offers Mina Rao the Data Analyst role")
    expect(result.summary).not.toMatch(/₹|INR|Rs\.|\$/)
    expect(EMPTY_COPY.money).toBe("No compensation amounts found.")
    expectTraceable(result, source)
  })

  it("leaves people empty when the letter names none", () => {
    const source = "Your annual salary will be $80,000. Please sign and return this letter by October 30, 2026 to accept the offer."
    const result = analyzeOffer(source)
    expect(result.peopleOrganizations).toEqual([])
    expect(result.summary).toBeNull()
    expect(result.compensation.amounts).toEqual([{ label: "Annual salary", amount: "$80,000" }])
    expect(EMPTY_COPY.people).toBe("No people or organizations found.")
    expectTraceable(result, source)
  })

  it("leaves every section empty when the text supports nothing", () => {
    const result = analyzeOffer("Hello there. This note has no offer details.")
    expect(result.summary).toBeNull()
    expect(result.nextStep).toBeNull()
    expect(result.importantDates).toEqual([])
    expect(result.actionItems).toEqual([])
    expect(result.peopleOrganizations).toEqual([])
    expect(result.compensation.amounts).toEqual([])
    expect(result.compensation.benefitsNote).toBeNull()
    expect(EMPTY_COPY.summary).toBe("No summary available.")
    expect(EMPTY_COPY.money).toBe("No compensation amounts found.")
    expect(EMPTY_COPY.people).toBe("No people or organizations found.")
  })
})

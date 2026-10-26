import { describe, expect, it } from "vitest"
import { analyzeOffer } from "../lib/analyzeOffer"
import { EMPTY_COPY } from "../lib/analysis"
import { sampleOfferLetter } from "../sample/offerLetter"

describe("analyzeOffer", () => {
  it("reads the sample letter into all six sections without adding facts", () => {
    const result = analyzeOffer(sampleOfferLetter)

    expect(result.summary).toContain("Northwind Labs offers Priya Shah the Product Designer role")
    expect(result.summary).toContain("$145,000")
    expect(result.summary).toContain("March 2, 2026")
    expect(result.nextStep).toContain("Sign and return the letter by January 29, 2026")
    expect(result.nextStep).toContain("Submit the identification documents by February 12, 2026")
    expect(result.importantDates.map((item) => item.date)).toEqual([
      "January 15, 2026",
      "March 2, 2026",
      "January 29, 2026",
      "February 12, 2026",
    ])
    expect(result.compensation.amounts.map((item) => item.amount)).toEqual(["$145,000", "$15,000"])
    expect(result.compensation.benefitsNote).toContain("medical coverage")
    expect(result.actionItems).toHaveLength(2)
    expect(result.peopleOrganizations.map((item) => item.name)).toEqual([
      "Priya Shah",
      "Northwind Labs",
      "Elena Vasquez",
    ])

    const rendered = JSON.stringify(result)
    for (const fact of ["Priya Shah", "Elena Vasquez", "Northwind Labs", "$145,000", "$15,000", "January 29, 2026"]) {
      expect(sampleOfferLetter).toContain(fact)
      expect(rendered).toContain(fact)
    }
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
  })
})

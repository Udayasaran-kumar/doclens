export type DateItem = { label: string; date: string }
export type MoneyItem = { label: string; amount: string }
export type PersonOrg = {
  name: string
  role: "candidate" | "employer" | "person"
}

export type Analysis = {
  summary: string | null
  nextStep: string | null
  importantDates: DateItem[]
  compensation: {
    amounts: MoneyItem[]
    benefitsNote: string | null
  }
  actionItems: string[]
  peopleOrganizations: PersonOrg[]
}

export const EMPTY_COPY = {
  summary: "No summary available.",
  dates: "No important dates found.",
  actions: "No action items found.",
  people: "No people or organizations found.",
  money: "No compensation amounts found.",
  nextStep: "No specific next step identified.",
} as const

export function emptyAnalysis(): Analysis {
  return {
    summary: null,
    nextStep: null,
    importantDates: [],
    compensation: { amounts: [], benefitsNote: null },
    actionItems: [],
    peopleOrganizations: [],
  }
}

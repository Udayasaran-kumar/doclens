import { describe, expect, it } from "vitest"
import { emptyAnalysis } from "../lib/analysis"
import { initialScreen, screenReducer, UNSUPPORTED_MESSAGE } from "../state/screen"

const sampleFile = new File(["letter"], "offer.txt", { type: "text/plain" })
const otherFile = new File(["letter"], "second.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })

describe("screenReducer", () => {
  it("keeps the most recently selected valid document and does not start analysis", () => {
    const withSample = screenReducer(initialScreen, { type: "select-sample" })
    const withFile = screenReducer(withSample, { type: "select-file", file: sampleFile })
    expect(withFile.status).toBe("ready")
    if (withFile.status !== "ready") return
    expect(withFile.active.kind).toBe("file")

    const backToSample = screenReducer(withFile, { type: "select-sample" })
    expect(backToSample.status).toBe("ready")
    if (backToSample.status !== "ready") return
    expect(backToSample.active.kind).toBe("sample")
  })

  it("rejects an unsupported file without replacing a valid selection", () => {
    const ready = screenReducer(initialScreen, { type: "select-file", file: sampleFile })
    const rejected = screenReducer(ready, { type: "reject-file" })
    expect(rejected.status).toBe("unsupported")
    if (rejected.status !== "unsupported") return
    expect(rejected.message).toBe(UNSUPPORTED_MESSAGE)
    expect(rejected.active?.name).toBe("offer.txt")

    const fromEmpty = screenReducer(initialScreen, { type: "reject-file" })
    expect(fromEmpty.status).toBe("unsupported")
    if (fromEmpty.status !== "unsupported") return
    expect(fromEmpty.active).toBeNull()
  })

  it("ignores a second analysis while one is running", () => {
    const ready = screenReducer(initialScreen, { type: "select-sample" })
    const analyzing = screenReducer(ready, { type: "start" })
    const again = screenReducer(analyzing, { type: "start" })
    const swapped = screenReducer(analyzing, { type: "select-file", file: otherFile })
    expect(again).toEqual(analyzing)
    expect(swapped).toEqual(analyzing)
  })

  it("returns to the same document on retry and clears everything for another document", () => {
    const ready = screenReducer(initialScreen, { type: "select-file", file: sampleFile })
    const analyzing = screenReducer(ready, { type: "start" })
    const failed = screenReducer(analyzing, { type: "fail" })
    const retried = screenReducer(failed, { type: "try-again" })
    expect(retried.status).toBe("ready")
    if (retried.status !== "ready") return
    expect(retried.active.name).toBe("offer.txt")

    const succeeded = screenReducer(analyzing, { type: "success", analysis: emptyAnalysis() })
    expect(screenReducer(succeeded, { type: "analyze-another" })).toEqual(initialScreen)
  })
})

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { App } from "../App"
import { ANALYSIS_PAUSE_MS } from "../sample/offerLetter"

describe("App", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it("shows the sample first pass after Analyze Document", async () => {
    render(<App />)
    const analyze = screen.getByRole("button", { name: "Analyze Document" }) as HTMLButtonElement
    expect(analyze.disabled).toBe(true)

    fireEvent.click(screen.getByRole("button", { name: "Try the sample offer letter" }))
    expect((screen.getByRole("button", { name: "Analyze Document" }) as HTMLButtonElement).disabled).toBe(false)

    fireEvent.click(screen.getByRole("button", { name: "Analyze Document" }))
    expect(screen.getByRole("status").textContent).toContain("Analyzing your offer letter…")
    expect(screen.getByRole("status").textContent).toContain("Sample offer letter")
    expect(screen.queryByRole("heading", { name: "Summary" })).toBeNull()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(ANALYSIS_PAUSE_MS)
    })

    expect(screen.getByRole("heading", { name: "Summary" })).toBeTruthy()
    expect(screen.getByText(/Northwind Labs offers Priya Shah/)).toBeTruthy()
    expect(screen.getByRole("heading", { name: "What should I do next?" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Important dates" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Money / compensation" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Action items" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "People & organizations" })).toBeTruthy()
    expect(screen.getByText("$15,000")).toBeTruthy()
  })

  it("rejects an unsupported file before analysis and keeps a valid selection", () => {
    render(<App />)
    const input = document.querySelector("input[type=file]") as HTMLInputElement
    fireEvent.change(input, { target: { files: [new File(["x"], "photo.png", { type: "image/png" })] } })

    expect(screen.getByRole("alert").textContent).toBe(
      "Unsupported file type. Please upload a PDF, DOCX, or TXT file.",
    )
    expect((screen.getByRole("button", { name: "Analyze Document" }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.queryByText("Analyzing your offer letter…")).toBeNull()

    fireEvent.change(input, { target: { files: [new File(["Hello"], "offer.txt", { type: "text/plain" })] } })
    expect(screen.queryByRole("alert")).toBeNull()
    expect(screen.getByText("offer.txt")).toBeTruthy()

    fireEvent.change(input, { target: { files: [new File(["x"], "notes.doc", { type: "application/msword" })] } })
    expect(screen.getByRole("alert").textContent).toContain("Unsupported file type")
    expect(screen.getByText("offer.txt")).toBeTruthy()
    expect((screen.getByRole("button", { name: "Analyze Document" }) as HTMLButtonElement).disabled).toBe(false)
  })

  it("shows empty messages for a supported file with nothing to extract", async () => {
    render(<App />)
    const input = document.querySelector("input[type=file]") as HTMLInputElement
    fireEvent.change(input, {
      target: { files: [new File(["Hello there. Nothing useful."], "notes.txt", { type: "text/plain" })] },
    })
    fireEvent.click(screen.getByRole("button", { name: "Analyze Document" }))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(ANALYSIS_PAUSE_MS)
    })

    expect(screen.getByText("No summary available.")).toBeTruthy()
    expect(screen.getByText("No important dates found.")).toBeTruthy()
    expect(screen.getByText("No action items found.")).toBeTruthy()
    expect(screen.getByText("No people or organizations found.")).toBeTruthy()
    expect(screen.getByText("No compensation amounts found.")).toBeTruthy()
    expect(screen.getByText("No specific next step identified.")).toBeTruthy()
  })

  it("treats an empty text file as a failed analysis and does not rerun on Try again", async () => {
    render(<App />)
    const input = document.querySelector("input[type=file]") as HTMLInputElement
    fireEvent.change(input, { target: { files: [new File(["   "], "blank.txt", { type: "text/plain" })] } })
    fireEvent.click(screen.getByRole("button", { name: "Analyze Document" }))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(ANALYSIS_PAUSE_MS)
    })

    expect(screen.getByRole("alert").textContent).toContain("DocLens could not analyze the document.")
    expect(screen.queryByText("Unsupported file type. Please upload a PDF, DOCX, or TXT file.")).toBeNull()

    fireEvent.click(screen.getByRole("button", { name: "Try again" }))
    expect(screen.getByText("blank.txt")).toBeTruthy()
    expect(screen.queryByText("Analyzing your offer letter…")).toBeNull()
    expect(screen.queryByRole("heading", { name: "Summary" })).toBeNull()
  })

  it("clears the result and the selection when analyzing another document", async () => {
    render(<App />)
    fireEvent.click(screen.getByRole("button", { name: "Try the sample offer letter" }))
    fireEvent.click(screen.getByRole("button", { name: "Analyze Document" }))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(ANALYSIS_PAUSE_MS)
    })
    fireEvent.click(screen.getByRole("button", { name: "Analyze another document" }))

    expect(screen.queryByRole("heading", { name: "Summary" })).toBeNull()
    expect((screen.getByRole("button", { name: "Analyze Document" }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.queryByText("Sample offer letter")).toBeNull()
  })
})

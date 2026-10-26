import mammoth from "mammoth"
import { fileExtension } from "./fileKind"

export async function extractFileText(file: File): Promise<string> {
  const extension = fileExtension(file.name)
  if (extension === "txt") return file.text()
  if (extension === "docx") return extractDocx(await file.arrayBuffer())
  if (extension === "pdf") return extractPdf(await file.arrayBuffer())
  throw new Error("unsupported")
}

async function extractDocx(data: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({
    arrayBuffer: data,
    buffer: new Uint8Array(data),
  } as Parameters<typeof mammoth.extractRawText>[0])
  return result.value
}

async function extractPdf(data: ArrayBuffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist")
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url")
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default
  const document = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise
  const pages: string[] = []
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber)
    const content = await page.getTextContent()
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
    pages.push(text)
  }
  return pages.join("\n")
}

const SUPPORTED = new Set(["pdf", "docx", "txt"])

export function fileExtension(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? name
  const parts = base.toLowerCase().split(".")
  if (parts.length < 2) return ""
  return parts[parts.length - 1] ?? ""
}

export function isSupportedOfferFile(name: string): boolean {
  return SUPPORTED.has(fileExtension(name))
}

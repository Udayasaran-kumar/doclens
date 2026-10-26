/// <reference types="vite/client" />

declare module "pdfjs-dist/build/pdf.worker.min.mjs?url" {
  const src: string
  export default src
}

declare module "node:fs" {
  export function readFileSync(path: URL | string, encoding: "utf8"): string
  export function readFileSync(path: URL | string): Uint8Array
}

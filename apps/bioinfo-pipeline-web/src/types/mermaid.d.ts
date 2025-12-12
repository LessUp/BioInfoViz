declare module 'mermaid' {
  export interface MermaidConfig {
    [key: string]: unknown
  }

  export interface MermaidRenderResult {
    svg: string
    bindFunctions?: (element: Element) => void
  }

  const mermaid: {
    initialize: (config: MermaidConfig) => void
    render: (id: string, text: string) => Promise<MermaidRenderResult>
  }

  export default mermaid
}

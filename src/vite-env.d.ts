/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * URL that accepts a JSON POST of the contact form payload. Blank falls back
   * to the visitor's mail client — see .env.example.
   */
  readonly VITE_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

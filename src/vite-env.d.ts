/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YANDEX_METRIKA_ID?: string
  readonly VITE_FORM_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

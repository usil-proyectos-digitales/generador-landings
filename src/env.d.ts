/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly WP_API_URL: string;
  readonly WP_BU_DEFAULT: string;
  readonly GEMINI_API_KEY: string;
  readonly GEMINI_MODEL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
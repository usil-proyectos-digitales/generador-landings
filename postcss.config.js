/**
 * PostCSS config del subproyecto Astro (web/).
 * ----------------------------------------------------------------
 * Vacío explícito para evitar que Vite "herede" el
 * `postcss.config.js` de la raíz (que usa el plugin de Tailwind v3
 * incompatible con `@import "tailwindcss"` + `@theme` + `@layer` de v4).
 *
 * El proyecto Astro usa `@tailwindcss/vite` (v4, sin PostCSS) configurado
 * en `astro.config.mjs`. Este archivo existe solo para bloquear el walk-up.
 */
export default {
  plugins: {},
};
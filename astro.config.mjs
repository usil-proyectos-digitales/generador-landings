// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://landings.usil.edu.pe',
  output: 'static',

  // Tailwind v4 se integra vía el plugin de Vite (no como integración de Astro)
  vite: {
    plugins: [tailwindcss()],
    server: {
      // Permitir acceso desde otros dispositivos en la red local
      host: true,
      // Proxy para evitar CORS con el WP de SiteGround durante dev
      proxy: {
        '/wp-json': {
          target: 'https://landings-staging.usil.edu.pe',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },

  // Variables de entorno disponibles en import.meta.env
  env: {
    schema: {
      WP_API_URL: {
        type: 'string',
        context: 'server',
        access: 'public',
        default: 'https://landings-staging.usil.edu.pe/wp-json/wp/v2',
      },
      WP_BU_DEFAULT: {
        type: 'string',
        context: 'server',
        access: 'public',
        default: 'pregrado',
      },
    },
  },
});
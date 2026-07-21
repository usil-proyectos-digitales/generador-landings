/**
 * Cliente para consumir el WordPress headless via REST API.
 * Lee WP_API_URL desde import.meta.env (configurada en astro.config.mjs).
 */

const WP_API_URL = import.meta.env.WP_API_URL || 'https://landings-staging.usil.edu.pe/wp-json/wp/v2';

export interface Landing {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: {
    bu?: string;
    surface?: 'light' | 'dark';
    widgets?: Widget[];
  };
}

export interface Widget {
  acf_fc_layout: string; // ej. "hero", "cards", "form"
  title?: string;
  subtitle?: string;
  cta_text?: string;
  cta_url?: string;
  // ... extensible según el ACF Flexible Content
}

export async function getLandingBySlug(slug: string): Promise<Landing | null> {
  try {
    const res = await fetch(
      `${WP_API_URL}/landings?slug=${slug}&_embed`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!res.ok) return null;
    const landings = await res.json();
    return landings[0] ?? null;
  } catch (err) {
    console.error('[wp-api] Error fetching landing:', err);
    return null;
  }
}

export async function getAllLandings(): Promise<Landing[]> {
  try {
    const res = await fetch(
      `${WP_API_URL}/landings?per_page=100&_embed`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('[wp-api] Error fetching landings:', err);
    return [];
  }
}

export async function getLandingById(id: number): Promise<Landing | null> {
  try {
    const res = await fetch(`${WP_API_URL}/landings/${id}&_embed`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('[wp-api] Error fetching landing:', err);
    return null;
  }
}
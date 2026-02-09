import { fontCatalog } from '~/data/font-catalog'
import type { FontFamily } from '~/types'

// Slug → CSS font-family name mapping
const slugToFamily: Record<string, string> = {}
for (const font of fontCatalog) {
  slugToFamily[font.slug] = font.name
}

export function useFonts() {
  function getFontFamily(slug: string): string {
    return slugToFamily[slug] || slug
  }

  function getFontBySlug(slug: string): FontFamily | undefined {
    return fontCatalog.find(f => f.slug === slug)
  }

  function getAllFonts(): FontFamily[] {
    return fontCatalog
  }

  function getFontsByCategory(category: FontFamily['category']): FontFamily[] {
    return fontCatalog.filter(f => f.category === category)
  }

  return {
    getFontFamily,
    getFontBySlug,
    getAllFonts,
    getFontsByCategory,
    fontCatalog,
  }
}

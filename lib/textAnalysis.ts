export interface TextAnalysis {
  charCount: number
  wordCount: number
  sentenceCount: number
  imageCount: number
  linkCount: number
}

export function analyzeText(text: string): TextAnalysis {
  // Character count (excluding whitespace)
  const charCount = text.replace(/\s/g, '').length

  // Word count (split by whitespace, filter empty strings)
  const words = text.trim().split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length

  // Sentence count - only count actual sentences with sentence endings
  // A sentence must end with . ! ? and contain at least one word
  const sentenceMatches = text.match(/[^.!?]*[.!?]+/g) || []
  const sentenceCount = sentenceMatches
    .map(s => s.trim())
    .filter(s => s.length > 0 && /\w/.test(s)) // Must contain at least one word character
    .length

  // Image count (count image tags, image URLs, or image file extensions)
  const imageRegex = /<img[^>]*>|!\[[^\]]*\]\([^)]*\)|https?:\/\/[^\s]*\.(jpg|jpeg|png|gif|webp|svg)/gi
  const imageMatches = text.match(imageRegex) || []
  const imageCount = imageMatches.length

  // Link count (count URLs and markdown links)
  const linkRegex = /https?:\/\/[^\s]+|\[[^\]]*\]\([^)]+\)/gi
  const linkMatches = text.match(linkRegex) || []
  const linkCount = linkMatches.length

  return {
    charCount,
    wordCount,
    sentenceCount,
    imageCount,
    linkCount
  }
}

export function formatDeletionSummary(analysis: TextAnalysis): string {
  const parts: string[] = []

  if (analysis.charCount > 0) {
    parts.push(`${analysis.charCount} character${analysis.charCount !== 1 ? 's' : ''}`)
  }

  if (analysis.wordCount > 0) {
    parts.push(`${analysis.wordCount} word${analysis.wordCount !== 1 ? 's' : ''}`)
  }

  if (analysis.sentenceCount > 0) {
    parts.push(`${analysis.sentenceCount} sentence${analysis.sentenceCount !== 1 ? 's' : ''}`)
  }

  if (analysis.imageCount > 0) {
    parts.push(`${analysis.imageCount} image${analysis.imageCount !== 1 ? 's' : ''}`)
  }

  if (analysis.linkCount > 0) {
    parts.push(`${analysis.linkCount} link${analysis.linkCount !== 1 ? 's' : ''}`)
  }

  if (parts.length === 0) {
    return 'Nothing was deleted'
  }

  let result = 'Deleted '
  
  if (parts.length === 1) {
    result += parts[0]
  } else if (parts.length === 2) {
    result += parts.join(' and ')
  } else {
    result += parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1]
  }

  return result
}
// Utility function to count characters and words from markdown content
export const countStats = (content: string): { charCount: number; wordCount: number } => {
  // Remove only markdown formatting that affects text styling
  const cleanContent = content
    // Remove markdown headers (only when at start of line)
    .replace(/^#{1,6}\s/gm, '')
    // Remove bold/italic markers
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Remove strikethrough
    .replace(/~~(.*?)~~/g, '$1')
    // Remove blockquotes (only when at start of line)
    .replace(/^>\s/gm, '')
    // Handle code blocks - remove the backticks but keep the content
    .replace(/```[\s\S]*?```/g, (match) => {
      // Remove the opening and closing ``` and any language identifier
      return match.replace(/^```\w*\n/, '').replace(/```$/, '')
    })
    // Handle inline code - remove the backticks but keep the content
    .replace(/`([^`]+)`/g, '$1')
    // Remove link formatting but keep the text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Normalize whitespace
    .replace(/\n/g, ' ')
    .trim()

  const charCount = cleanContent.length
  const wordCount = cleanContent.split(/\s+/).filter((word) => word.length > 0).length

  return { charCount, wordCount }
}

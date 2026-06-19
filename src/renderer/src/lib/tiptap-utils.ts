export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const handleImageUpload = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width
        let height = img.height
        const maxDimension = 800 // Maximum dimension

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)

        // Convert to base64 with quality setting
        const base64 = canvas.toDataURL('image/jpeg', 0.6) // 60% quality

        // Remove the data URL prefix
        const base64String = base64.replace(/^data:image\/[^;]+;base64,/, '')
        resolve(base64String)
      }
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

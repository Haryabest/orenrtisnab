import { useContent } from '../../context/ContentContext'
import { buildStructuredData } from '../../data/seo'

export function StructuredData() {
  const { content } = useContent()

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildStructuredData(content)) }}
    />
  )
}

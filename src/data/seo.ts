import type { SiteContent } from '../../shared/site-content'

export function buildStructuredData(content: SiteContent) {
  const { site, contacts, catalog, faq } = content

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: site.language,
        publisher: { '@id': `${site.url}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${site.url}/#organization`,
        name: site.name,
        legalName: site.legalName,
        url: site.url,
        logo: `${site.url}/favicon.png`,
        email: contacts.email.display,
        telephone: contacts.phones.map((p) => p.href.replace('tel:', '')),
        areaServed: site.areaServed,
        sameAs: [contacts.telegram.href, contacts.max.href],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${site.url}/#localbusiness`,
        name: site.name,
        description: site.description,
        url: site.url,
        telephone: contacts.phones[0]?.href.replace('tel:', '') ?? '',
        email: contacts.email.display,
        address: {
          '@type': 'PostalAddress',
          addressLocality: site.city,
          addressRegion: site.addressRegion,
          addressCountry: site.region,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: site.openingHours.opens,
          closes: site.openingHours.closes,
        },
        priceRange: site.priceRange,
      },
      {
        '@type': 'WebPage',
        '@id': `${site.url}/#webpage`,
        url: site.url,
        name: site.title,
        description: site.description,
        isPartOf: { '@id': `${site.url}/#website` },
        about: { '@id': `${site.url}/#organization` },
        inLanguage: site.language,
      },
      {
        '@type': 'ItemList',
        '@id': `${site.url}/#catalog`,
        name: `Каталог уплотнений ${site.name}`,
        itemListElement: catalog.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: item.title,
            description: item.description,
            brand: { '@type': 'Brand', name: site.name },
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/InStock',
              seller: { '@id': `${site.url}/#organization` },
            },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${site.url}/#faq`,
        mainEntity: faq.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${site.url}/#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Главная',
            item: site.url,
          },
        ],
      },
    ],
  }
}

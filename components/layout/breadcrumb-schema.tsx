interface Breadcrumb {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  breadcrumbs: Breadcrumb[];
}

export function BreadcrumbSchema({ breadcrumbs }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

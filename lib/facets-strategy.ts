const INDEXABLE_FACETS = {
  // Facetas con alto volumen de búsqueda
  strategic: [
    "lisos", // pijamas lisos
    "estampados", // pijamas estampados
    "cortos", // pijamas cortos
    "largos", // pijamas largos
  ],
  // Facetas con potencial a futuro
  emerging: [
    "rosa", // pijamas rosa
    "negro", // pijamas negro
    "saten", // pijamas satén
  ],
  // Facetas que nunca se indexan
  noIndex: ["sort-by", "items-per-page", "view-mode", "complex-filters"],
};

export function shouldIndexFacetCombination(params: URLSearchParams) {
  const activeFilters = Array.from(params.keys());

  // No indexar si hay más de 2 filtros activos
  if (activeFilters.length > 2) return false;

  // No indexar filtros de UI
  if (activeFilters.some((filter) => INDEXABLE_FACETS.noIndex.includes(filter)))
    return false;

  // Indexar solo combinaciones estratégicas
  const filterCombination = activeFilters.sort().join("-");
  return (
    INDEXABLE_FACETS.strategic.includes(filterCombination) ||
    INDEXABLE_FACETS.emerging.includes(filterCombination)
  );
}

export function generateFacetedTitle(collection: any, searchParams: any) {
  const baseTitle = collection.title;
  const filters = Object.keys(searchParams);

  if (filters.length === 0) return baseTitle;

  const filterLabels = filters.map((filter) => {
    switch (filter) {
      case "color":
        return searchParams[filter];
      case "size":
        return `Talla ${searchParams[filter]}`;
      default:
        return searchParams[filter];
    }
  });

  return `${baseTitle} - ${filterLabels.join(", ")}`;
}

export function generateFacetedDescription(collection: any, searchParams: any) {
  const baseDescription = collection.description;
  const filters = Object.keys(searchParams);

  if (filters.length === 0) return baseDescription;

  const filterLabels = filters.map((filter) => {
    switch (filter) {
      case "color":
        return searchParams[filter];
      case "size":
        return `talla ${searchParams[filter]}`;
      default:
        return searchParams[filter];
    }
  });

  return `Descubre ${collection.title.toLowerCase()} ${filterLabels.join(", ")}. ${baseDescription}`;
}

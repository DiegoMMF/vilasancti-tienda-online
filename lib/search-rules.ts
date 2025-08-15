// Reglas de mapeo para búsqueda inteligente de productos

export const colorMapping: { [key: string]: string[] } = {
  // Rosas
  'rosa': ['rosa', 'rosado', 'pink', 'rosita', 'rosado'],
  'rosado': ['rosa', 'rosado', 'pink', 'rosita'],
  'pink': ['rosa', 'rosado', 'pink', 'rosita'],
  'rosita': ['rosa', 'rosado', 'pink', 'rosita'],
  
  // Azules
  'azul': ['azul', 'blue', 'celeste', 'turquesa'],
  'blue': ['azul', 'blue', 'celeste', 'turquesa'],
  'celeste': ['azul', 'blue', 'celeste', 'turquesa'],
  'turquesa': ['azul', 'blue', 'celeste', 'turquesa'],
  
  // Negros
  'negro': ['negro', 'negra', 'black', 'oscuro', 'oscura'],
  'negra': ['negro', 'negra', 'black', 'oscuro', 'oscura'],
  'black': ['negro', 'negra', 'black', 'oscuro', 'oscura'],
  'oscuro': ['negro', 'negra', 'black', 'oscuro', 'oscura'],
  'oscura': ['negro', 'negra', 'black', 'oscuro', 'oscura'],
  
  // Blancos
  'blanco': ['blanco', 'blanca', 'white', 'claro', 'clara'],
  'blanca': ['blanco', 'blanca', 'white', 'claro', 'clara'],
  'white': ['blanco', 'blanca', 'white', 'claro', 'clara'],
  'claro': ['blanco', 'blanca', 'white', 'claro', 'clara'],
  'clara': ['blanco', 'blanca', 'white', 'claro', 'clara'],
  
  // Rojos
  'rojo': ['rojo', 'roja', 'red', 'carmesí', 'carmesi'],
  'roja': ['rojo', 'roja', 'red', 'carmesí', 'carmesi'],
  'red': ['rojo', 'roja', 'red', 'carmesí', 'carmesi'],
  'carmesí': ['rojo', 'roja', 'red', 'carmesí', 'carmesi'],
  'carmesi': ['rojo', 'roja', 'red', 'carmesí', 'carmesi'],
  
  // Verdes
  'verde': ['verde', 'green', 'esmeralda'],
  'green': ['verde', 'green', 'esmeralda'],
  'esmeralda': ['verde', 'green', 'esmeralda'],
  
  // Amarillos
  'amarillo': ['amarillo', 'amarilla', 'yellow', 'dorado', 'dorada'],
  'amarilla': ['amarillo', 'amarilla', 'yellow', 'dorado', 'dorada'],
  'yellow': ['amarillo', 'amarilla', 'yellow', 'dorado', 'dorada'],
  'dorado': ['amarillo', 'amarilla', 'yellow', 'dorado', 'dorada'],
  'dorada': ['amarillo', 'amarilla', 'yellow', 'dorado', 'dorada'],
  
  // Morados
  'morado': ['morado', 'morada', 'purple', 'violeta', 'lila'],
  'morada': ['morado', 'morada', 'purple', 'violeta', 'lila'],
  'purple': ['morado', 'morada', 'purple', 'violeta', 'lila'],
  'violeta': ['morado', 'morada', 'purple', 'violeta', 'lila'],
  'lila': ['morado', 'morada', 'purple', 'violeta', 'lila'],
  
  // Grises
  'gris': ['gris', 'gray', 'grey', 'plata', 'plateado'],
  'gray': ['gris', 'gray', 'grey', 'plata', 'plateado'],
  'grey': ['gris', 'gray', 'grey', 'plata', 'plateado'],
  'plata': ['gris', 'gray', 'grey', 'plata', 'plateado'],
  'plateado': ['gris', 'gray', 'grey', 'plata', 'plateado'],
};

export const sizeMapping: { [key: string]: string[] } = {
  // Tallas pequeñas
  'chico': ['S', 'XS'],
  'pequeño': ['S', 'XS'],
  'pequeña': ['S', 'XS'],
  'small': ['S', 'XS'],
  'xs': ['XS'],
  'extra small': ['XS'],
  'extra pequeña': ['XS'],
  'talle s': ['S'],
  'talla s': ['S'],
  
  // Tallas medianas
  'mediano': ['M'],
  'mediana': ['M'],
  'medium': ['M'],
  'talle m': ['M'],
  'talla m': ['M'],
  
  // Tallas grandes
  'grande': ['L', 'XL'],
  'large': ['L', 'XL'],
  'talle l': ['L'],
  'talla l': ['L'],
  
  // Tallas extra grandes
  'xl': ['XL'],
  'extra grande': ['XL'],
  'extra large': ['XL'],
  'talle xl': ['XL'],
  'talla xl': ['XL'],
};

// Función para expandir términos de búsqueda
export const expandSearchTerms = (searchTerm: string): string[] => {
  const lowerTerm = searchTerm.toLowerCase().trim();
  const expandedTerms = [searchTerm]; // Incluir el término original
  
  // Expandir colores
  if (colorMapping[lowerTerm]) {
    expandedTerms.push(...colorMapping[lowerTerm]);
  }
  
  // Expandir tallas
  if (sizeMapping[lowerTerm]) {
    expandedTerms.push(...sizeMapping[lowerTerm]);
  }
  
  return [...new Set(expandedTerms)]; // Eliminar duplicados
};

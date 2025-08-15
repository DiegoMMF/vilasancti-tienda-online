/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
    // Optimizaciones de rendimiento
    cssnano: {
      preset: [
        "default",
        {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          colormin: true,
          minifyFontValues: true,
          minifySelectors: true,
        },
      ],
    },
  },
};

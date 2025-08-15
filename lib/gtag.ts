export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export const gtag = (...args: any[]) => {
  if (typeof window !== "undefined") {
    (window as any).gtag(...args);
  }
};

export const trackEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Eventos específicos de e-commerce para Vilasancti
export const trackProductView = (product: any) => {
  gtag("event", "view_item", {
    currency: "ARS",
    value: parseFloat(product.priceRange.minVariantPrice.amount),
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        category: "Pijamas",
        quantity: 1,
        price: parseFloat(product.priceRange.minVariantPrice.amount),
      },
    ],
  });
};

export const trackAddToCart = (product: any, quantity: number = 1) => {
  gtag("event", "add_to_cart", {
    currency: "ARS",
    value: parseFloat(product.priceRange.minVariantPrice.amount) * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        category: "Pijamas",
        quantity: quantity,
        price: parseFloat(product.priceRange.minVariantPrice.amount),
      },
    ],
  });
};

export const trackPurchase = (transactionData: any) => {
  gtag("event", "purchase", {
    transaction_id: transactionData.id,
    value: transactionData.total,
    currency: "ARS",
    items: transactionData.items,
  });
};

export const trackBeginCheckout = (cartItems: any[]) => {
  const totalValue = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );

  gtag("event", "begin_checkout", {
    currency: "ARS",
    value: totalValue,
    items: cartItems.map((item) => ({
      item_id: item.id,
      item_name: item.title,
      category: "Pijamas",
      quantity: item.quantity,
      price: parseFloat(item.price),
    })),
  });
};

export const trackSearch = (searchTerm: string) => {
  gtag("event", "search", {
    search_term: searchTerm,
  });
};

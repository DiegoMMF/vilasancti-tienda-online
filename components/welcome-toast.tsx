'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function WelcomeToast() {
  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes('welcome-toast=2')) {
      toast('🛍️ Welcome to Vilasancti Tienda!', {
        id: 'welcome-toast',
        duration: Infinity,
        onDismiss: () => {
          document.cookie = 'welcome-toast=2; max-age=31536000; path=/';
        },
        description: (
          <>
                    This is a high-performance, custom ecommerce storefront implemented by Diego Maldini Freyre.{' '}
        <a
          href="https://github.com/diegomaldini"
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              Deploy your own
            </a>
            .
          </>
        )
      });
    }
  }, []);

  return null;
}

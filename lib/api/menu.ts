import type { Menu } from '../types';

export async function getMenu(handle: string): Promise<Menu[]> {
  // Por ahora, retornamos un menú básico
  // En el futuro, esto podría venir de la base de datos
  const menu: Menu[] = [
    {
      id: 'main-menu',
      title: 'Main Menu',
      path: '/',
      items: [
        {
          id: 'home',
          title: 'Home',
          path: '/',
          items: []
        },
        {
          id: 'products',
          title: 'Products',
          path: '/search',
          items: []
        }
      ]
    }
  ];

  return menu;
} 
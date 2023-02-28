import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../views/LoginPage.vue'),
  },
  {
    path: '/admin',
    component: () => import('../views/DashboardPage.vue'),
    children: [
      {
        path: 'products',
        component: () => import('../views/ProductsPage.vue'),
      },
      {
        path: 'orders',
        component: () => import('../views/OrderPage.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes,
});

export default router;

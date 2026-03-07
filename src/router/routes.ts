import DashboardPage from '@/pages/DashboardPage.vue';

const routes = [
  {
    path: '/',
    name: 'main',
    component: DashboardPage,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/pages/UsersPage.vue'),
  },
  {
    path: '/tariffs',
    name: 'tariffs',
    component: () => import('@/pages/TariffsPage.vue'),
  },
  {
    path: '/balance/:userId',
    name: 'balance',
    component: () => import('@/pages/TransactionPage.vue'),
  },
  {
    path: '/servers',
    name: 'servers',
    component: () => import('@/pages/ServersPage.vue'),
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/pages/NotificationPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
  },
];

export default routes;

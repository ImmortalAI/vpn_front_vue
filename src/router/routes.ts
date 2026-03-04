import DashboardPage from '@/pages/DashboardPage.vue';

const routes = [
  {
    path: '/',
    name: 'main',
    component: DashboardPage,
    meta: {
      canRedirectHome: false,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: {
      canRedirectHome: false,
    },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/pages/UsersPage.vue'),
    meta: {
      canRedirectHome: true,
    },
  },
  {
    path: '/tariffs',
    name: 'tariffs',
    component: () => import('@/pages/TariffsPage.vue'),
    meta: {
      canRedirectHome: true,
    },
  },
  {
    path: '/balance/:userId',
    name: 'balance',
    component: () => import('@/pages/TransactionPage.vue'),
    meta: {
      canRedirectHome: true,
    },
  },
  {
    path: '/servers',
    name: 'servers',
    component: () => import('@/pages/ServersPage.vue'),
    meta: {
      canRedirectHome: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: {
      canRedirectHome: true,
    },
  },
];

export default routes;

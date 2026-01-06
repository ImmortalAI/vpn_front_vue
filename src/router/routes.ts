import DashboardView from '@/pages/DashboardView.vue';

const routes = [
  {
    path: '/',
    name: 'main',
    component: DashboardView,
    meta: {
      canRedirectHome: false,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginView.vue'),
    meta: {
      canRedirectHome: false,
    },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/pages/UsersView.vue'),
    meta: {
      canRedirectHome: true,
    },
  },
  {
    path: '/tariffs',
    name: 'tariffs',
    component: () => import('@/pages/TariffsView.vue'),
    meta: {
      canRedirectHome: true,
    },
  },
  {
    path: '/servers',
    name: 'servers',
    component: () => import('@/pages/ServersView.vue'),
    meta: {
      canRedirectHome: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundView.vue'),
    meta: {
      canRedirectHome: true,
    },
  },
];

export default routes;

import DashboardView from '@/views/DashboardView.vue';

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
    component: () => import('@/views/LoginView.vue'),
    meta: {
      canRedirectHome: false,
    },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UsersView.vue'),
    meta: {
      canRedirectHome: true,
    },
  },
  {
    path: '/tariffs',
    name: 'tariffs',
    component: () => import('@/views/TariffsView.vue'),
    meta: {
      canRedirectHome: true,
    },
  },
  {
    path: '/servers',
    name: 'servers',
    component: () => import('@/views/ServersView.vue'),
    meta: {
      canRedirectHome: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      canRedirectHome: true,
    },
  },
];

export default routes;

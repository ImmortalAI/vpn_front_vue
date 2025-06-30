import { useUserStore } from '@/stores/user';
import LoginView from '@/views/LoginView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/UsersView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const user = useUserStore();

  // Try to refresh the user data if not already logged in
  if (!user.loggedIn) {
    await user.refreshUser();
  }

  if (to.name !== 'login' && !user.loggedIn) {
    next({ name: 'login' });
  } else if (to.name === 'login' && user.loggedIn) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router;

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
      meta: {
        canRedirectHome: false,
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
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
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: {
        canRedirectHome: true,
      },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const user = useUserStore();

  // Try to refresh the user data if not already logged in
  if (!user.loggedIn) {
    try {
      await user.refreshUser();
    } catch (error) {
      console.log(error);
    }
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

import { createRouter, createWebHistory } from 'vue-router';
import routes from '@/router/routes';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (!auth.isInitialized) await auth.initialize();

  if (auth.isAuthenticated) {
    if (to.name === 'login') {
      return '/';
    }
    return true;
  } else {
    if (to.name !== 'login') {
      return '/login';
    }
    return true;
  }
});

export default router;

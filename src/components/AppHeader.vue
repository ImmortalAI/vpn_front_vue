<!-- src/components/AppHeader.vue -->
<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50',
      'transition-all duration-300 ease-in-out',
      'bg-linear-to-r from-neutral-800 to-neutral-900 py-6',
      showHeader ? 'translate-y-0' : '-translate-y-full',
    ]"
  >
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between">
        <RouterLink
          to="/"
          :class="['text-emerald-300 font-bold transition-all duration-300', 'text-4xl']"
        >
          <div class="flex items-center gap-2">
            <svg
              :class="['transition-all duration-300', 'w-12 h-12']"
              viewBox="0 0 192 192"
              preserveAspectRatio="xMidYMid meet"
              fill="currentColor"
            >
              <g transform="translate(0,192)scale(.075,.075)">
                <path
                  id="path1"
                  d="M 2170 -2403 c -77 25 -159 143 -231 331 -23 60 -25 62 -60 62 -34 0 -36 2 -53 58 -10 31 -27 80 -38 109 -18 50 -21 52 -60 55 l -40 3 -50 137 -50 137 -42 3 -41 3 -55 150 -55 150 -36 3 -36 3 -45 122 -45 122 -36 3 c -35 3 -37 5 -68 89 l -33 86 -22 -66 c -12 -36 -25 -74 -29 -86 -5 -17 -1 -20 28 -23 l 34 -3 -37 -120 -37 -120 34 -3 c 18 -2 33 -5 33 -7 0 -3 -18 -69 -40 -147 -22 -79 -40 -146 -40 -150 0 -4 17 -8 39 -10 l 38 -3 -38 -135 c -21 -74 -38 -136 -39 -138 0 -1 18 -2 40 -2 22 0 40 -1 40 -3 0 -1 -13 -49 -30 -107 -16 -58 -30 -106 -30 -107 0 -2 15 -3 33 -3 l 34 0 -34 -152 c -19 -84 -41 -164 -49 -176 -35 -54 -125 -64 -183 -22 -62 43 -63 135 -5 332 4 15 -1 18 -31 18 -30 0 -35 3 -31 18 2 9 14 53 26 97 12 43 24 85 27 91 3 9 -8 14 -35 16 l -39 3 33 115 c 51 178 51 160 3 160 -30 0 -40 4 -36 13 7 18 77 283 77 291 0 3 -15 6 -34 6 l -34 0 34 112 c 18 62 34 119 34 126 0 7 -13 12 -30 12 -16 0 -30 3 -30 7 0 32 161 498 195 562 37 72 136 94 196 44 43 -36 126 -210 209 -436 l 65 -177 36 0 36 0 45 -122 44 -123 37 -3 c 39 -3 37 2 122 -234 l 28 -78 41 0 41 0 49 -140 50 -140 41 0 c 41 0 42 -1 54 -42 7 -24 25 -73 39 -110 26 -67 27 -68 63 -68 31 0 38 -4 48 -29 7 -15 34 -66 62 -112 72 -123 64 -195 -26 -239 -43 -21 -50 -22 -75 -13 z "
                />
              </g>
            </svg>
            <span>VPN Manager</span>
          </div>
        </RouterLink>

        <Button
          v-if="auth.isAuthenticated"
          icon="pi pi-sign-out"
          @click="logout"
          size="large"
          rounded
          label="Logout"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useWindowScroll } from '@vueuse/core';
import { ref, watch } from 'vue';

const auth = useAuthStore();
const router = useRouter();

const logout = async () => {
  await auth.logout();
  router.push({ name: 'login' });
};

const { y, directions } = useWindowScroll();

const showHeader = ref(true);

watch(y, (newY) => {
  if (newY < 50 || directions.top) {
    showHeader.value = true;
  } else {
    showHeader.value = false;
  }
});
</script>

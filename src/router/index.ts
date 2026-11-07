import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

import HomeView from '@/views/HomeView.vue'
import AuctionsView from '@/views/AuctionsView.vue'
import AuctionDetailView from '@/views/AuctionDetailView.vue'
import CreateAuctionView from '@/views/CreateAuctionView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import MyProfileView from '@/views/MyProfileView.vue'
import MyOrdersView from '@/views/MyOrdersView.vue'
import MySalesView from '@/views/MySalesView.vue'
import OrderDetailView from '@/views/OrderDetailView.vue'
import PaymentResultView from '@/views/PaymentResultView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/subastas',
      name: 'auctions',
      component: AuctionsView,
    },
    {
      path: '/subastas/:id',
      name: 'auction-detail',
      component: AuctionDetailView,
    },
    {
      path: '/publicar',
      name: 'create-auction',
      component: CreateAuctionView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/registro',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: '/mi-perfil',
      name: 'profile',
      component: MyProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/mis-compras',
      name: 'my-orders',
      component: MyOrdersView,
      meta: { requiresAuth: true },
    },
    {
      path: '/mis-ventas',
      name: 'my-sales',
      component: MySalesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/ordenes/:id',
      name: 'order-detail',
      component: OrderDetailView,
      meta: { requiresAuth: true },
    },
    {
      path: '/pago/resultado',
      name: 'payment-result',
      component: PaymentResultView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],

  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router

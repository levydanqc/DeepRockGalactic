import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import StatistiqueView from "../views/StatistiqueView.vue";
import SignUpView from "../views/SignUpView.vue";
import LoginView from "../views/LoginView.vue";
import SearchView from "../views/SearchView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "search",
    component: SearchView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/statistiques",
    name: "statistiques",
    component: StatistiqueView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

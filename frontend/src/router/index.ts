import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import SignupView from "../views/SignupView.vue";
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

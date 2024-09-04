import { createRouter, createWebHistory } from "vue-router";
import { projectAuth } from "../firebase/config";

const requireAuth = (to, from, next) => {
  let user = projectAuth.currentUser;
  if (!user) {
    next({ name: "Login" });
  } else {
    next();
  }
};
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    beforeEnter: requireAuth,
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/Login.vue"),
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import("@/views/auth/Signup.vue"),
  },
  {
    path: "/playlists/create",
    name: "CreatePlaylist",
    component: () => import("@/views/playlists/CreatePlaylist.vue"),
    beforeEnter: requireAuth,
  },
  {
    path: "/playlists/:id",
    name: "PlaylistDetails",
    component: () => import("@/views/playlists/PlaylistDetails.vue"),
    beforeEnter: requireAuth,
    props: true,
  },
  {
    path: "/playlists/user",
    name: "UserPlaylists",
    component: () => import("@/views/playlists/UserPlaylists.vue"),
    beforeEnter: requireAuth,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

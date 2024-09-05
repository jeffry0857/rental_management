<template>
  <div class="navbar">
    <nav>
      <h1>
        <router-link :to="{ name: 'Home' }">
          <img src="../assets/logo.png"/>
          Muso Ninjass
        </router-link>
      </h1>
      <div class="links">
        <div v-if="user">
          <router-link :to="{ name: 'CreatePlaylist' }">Create Playlist</router-link>
          <router-link :to="{ name: 'UserPlaylists' }">My Playlists</router-link>
          <span>Hi there, {{ user.displayName }}</span>
          <button @click="handleClick">
            {{ $t('message.logout') }}
          </button>
        </div>
        <div v-else>
          <router-link class="btn" :to="{ name: 'Signup' }">
            {{ $t('message.signup') }}
          </router-link>
          <router-link class="btn" :to="{ name: 'Login' }">
            {{ $t('message.login') }}
          </router-link>
        </div>
      </div>
      <div class="text-center">
        <v-btn>
          <v-menu activator="parent">
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <button @click="setLocale('tw')">
                    繁體中文
                  </button>
                </v-list-item-title>
                <v-list-item-title>
                  <button @click="setLocale('en')">
                    English
                  </button>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </div>
    </nav>
  </div>
</template>

<script>
import getUser from '../composables/getUser'
import useLogout from '../composables/useLogout'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

export default {
  setup() {
    const { user } = getUser()
    const { logout } = useLogout()
    const router = useRouter()

    const handleClick = async () => {
      await logout()
      router.push({ name: 'Login' })
    }

    const { t, locale } = useI18n();
    const setLocale = (newLocale) => {
      locale.value = newLocale
    }

    return { handleClick, user, t, setLocale }
  }
}
</script>

<style scoped>
  .navbar {
    padding: 16px 10px;
    margin-bottom: 60px;
    background: white;
  }
  nav {
    display: flex;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  nav img {
    max-height: 60px;
  }
  nav h1 {
    margin-left: 20px;
  }
  nav .links {
    margin-left: auto;
  }
  nav .links a, button {
    margin-left: 16px;
    font-size: 14px;
  }
  span {
    font-size: 14px;
    display: inline-block;
    margin-left: 16px;
    padding-left: 16px;
    border-left: 1px solid #eee;
  }
</style>
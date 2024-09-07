<template>
  <div class="navbar">
    <nav>
      <h2>
        <router-link :to="{ name: 'Home' }">
          <v-icon icon="mdi-home" />
        </router-link>
      </h2>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" icon="mdi-translate" />
        </template>
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

      <div class="links">
        <div v-if="user">
          <router-link :to="{ name: 'CreatePlaylist' }">
            <v-icon icon="mdi-plus" />
          </router-link>
          <span>Hi, {{ user.displayName }}</span>
          <button @click="handleClick">
            <v-icon icon="mdi-logout" />
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
    </nav>
  </div>
</template>

<script>
import getUser from '../composables/getUser'
import useLogout from '../composables/useLogout'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n';

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
  h2 {
    margin-right: 16px;
  }
  .navbar {
    padding: 16px 10px;
    margin-bottom: 1rem;
    background: white;
  }
  nav {
    display: flex;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
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
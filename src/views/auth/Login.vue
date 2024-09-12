<template>
  <form @submit.prevent="handleSubmit">
    <h3>{{ $t('message.login') }}</h3>
    <input type="email" placeholder="Email" v-model="email">
    <input type="password" placeholder="Password" v-model="password">
    <p class="pa-2 text-disabled font-weight-thin">提示：可使用訪客帳號 user@gmail.com</p>
    <p class="pa-2 text-disabled font-weight-thin">提示：可使用訪客密碼 123456</p>
    <div v-if="error" class="error">{{ error }}</div>
    <!-- <v-card>
      <template v-slot:actions>
        <button v-if="!isPending"
          :text="$t('message.login')"
          block
        ></button>
      </template>
    </v-card> -->
    <button v-if="!isPending">{{ $t('message.login') }}</button>
    <button v-if="isPending" disabled>{{ $t('message.loading') }}</button>
  </form>
</template>

<script>
import useLogin from '@/composables/useLogin'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const { error, login, isPending } = useLogin()
    const router = useRouter()

    const email = ref('')
    const password = ref('')

    const handleSubmit = async () => {
      const res = await login(email.value, password.value)
      if (!error.value) {
        router.push({ name: 'Home' })
      }
    }

    return { email, password, handleSubmit, error, isPending }
  }
}
</script>
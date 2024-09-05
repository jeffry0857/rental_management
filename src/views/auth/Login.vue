<template>
  <form @submit.prevent="handleSubmit">
    <h3>{{ $t('message.login') }}</h3>
    <input type="email" placeholder="Email" v-model="email">
    <input type="password" placeholder="Password" v-model="password">
    <div v-if="error" class="error">{{ error }}</div>
    <button v-if="!isPending">{{ $t('message.login') }}</button>
    <button v-if="isPending" disabled>Loading</button>
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
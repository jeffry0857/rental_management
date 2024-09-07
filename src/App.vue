<template>
  <Navbar />
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  components: { Navbar },
  name: 'App',
}
</script>



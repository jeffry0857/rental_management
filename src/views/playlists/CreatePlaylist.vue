<template>
  <form @submit.prevent="handleSubmit">
    <h4>Create New Playlist</h4>
    
    <input type="text" required placeholder="Playlist title" v-model="title">
    
    <input type="text" required :placeholder="$t('message.rent')" v-model="rent">
    <input type="text" required :placeholder="$t('message.lastTimeElectricMeter')" v-model="lastTimeElectricMeter">

    <label>{{ $t('message.upload_room_photo') }}</label>
    <textarea required placeholder="Playlist description..." v-model="description"></textarea>
    <input type="file" @change="handleChange">
    <div class="error">{{ fileError }}</div>


    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props">
          {{ formattedDate }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-date-picker v-model="selectedMoveInDate"></v-date-picker>
        </v-list-item>
      </v-list>
    </v-menu>

    <div class="error"></div>
    <button v-if="!isPending">Create</button>
    <button v-else disabled>Saving...</button>
  </form>
</template>

<script>
import { ref, computed } from 'vue'
import useStorage from '@/composables/useStorage'
import useCollection from '@/composables/useCollection'
import getUser from '@/composables/getUser'
import { timestamp } from '@/firebase/config'
import { useRouter } from 'vue-router'

export default {
  // data() {
  //   return {
  //     selectedMoveInDate: new Date(),
  //   };
  // },
  setup() {
    const selectedMoveInDate = ref(new Date());

    const formattedDate = computed(() => {
      return dateToFormat(selectedMoveInDate.value);
    });

    const { filePath, url, uploadImage } = useStorage()
    const { error, addDoc } = useCollection('playlists')
    const { user } = getUser()
    const router = useRouter()

    const title = ref('')
    const remark = ref('')
    const rent = ref('')
    const lastTimeElectricMeter = ref('')
    const file = ref(null)
    const fileError = ref(null)
    const isPending = ref(false)

    const handleSubmit = async () => {
      if (file.value) {
        isPending.value = true
        await uploadImage(file.value)
        const res = await addDoc({
          title: title.value,
          remark: remark.value,
          rent: rent.value,
          lastTimeElectricMeter: lastTimeElectricMeter.value,
          userId: user.value.uid,
          userName: user.value.displayName,
          coverUrl: url.value,
          filePath: filePath.value,
          songs: [],
          createdAt: timestamp()
        })
        isPending.value = false
        if (!error.value) {
          router.push({ name: 'PlaylistDetails', params: { id: res.id }})
        }
      }
    }

    const types = ['image/png', 'image/jpeg']

    const handleChange = (e) => {
      const selected = e.target.files[0]

      if (selected && types.includes(selected.type)) {
        file.value = selected
        fileError.value = null
      } else {
        file.value = null
        fileError.value = 'Please select an image file (png or jpg)'
      }
    }

    const dateToFormat = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}, ${month}, ${day}`;
    }

    return { title, description: remark, rent, lastTimeElectricMeter, handleSubmit, handleChange, fileError, isPending, selectedMoveInDate, formattedDate }
  }
}
</script>

<style>
  input[type="file"] {
    border: 0;
    padding: 0;
  }
  label {
    font-size: 12px;
    display: block;
    margin-top: 30px;
  }
  button {
    margin-top: 20px;
  }
</style>
<template>
  <div class="error" v-if="error">{{ error }}</div>
  <form v-if="playlist" class="playlist-details">
    <h4>{{ $t('message.edit') }}</h4>
    <!-- playlist information -->
    <div class="playlist-info mt-1">
      <v-row>
        <v-col>
          <v-text-field
            v-model="playlist.title"
            :label="$t('message.room')">
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="playlist.lastTimeElectricMeter"
            :label="$t('message.lastTimeElectricMeter')">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="playlist.rent"
            :label="$t('message.rent')">
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="playlist.deposit"
            :label="$t('message.deposit')">
          </v-text-field>
        </v-col>
      </v-row>
      <textarea :label="$t('message.remark')"
        v-model="playlist.remark"></textarea>

      <div v-if="playlist.coverUrl !== null" class="cover">
        <img :src="playlist.coverUrl">
      </div>
      <button @click="update(playlist)">
        {{ $t('message.update') }}
      </button>
    </div>
    <!-- <button v-if="ownership" @click="handleDelete">
      Delete Playlist
    </button> -->

    <!-- song list -->
    <!-- <div class="song-list">
      <div v-if="!playlist.songs.length">
        No songs have been added to this playlist yet.
      </div>
      <div v-for="song in playlist.songs"
        :key="song.id" class="single-song">
        <div class="details">
          <h3>{{ song.title }}</h3>
          <p>{{ song.artist }}</p>
        </div>
        <button v-if="ownership"
          @click="handleClick(song.id)">
          delete
        </button>
      </div>
      <AddSong :playlist="playlist" />
    </div> -->
    
    <!-- 更新後成功提示 -->
    <v-snackbar v-model="showSnackbar" :timeout="3000">
      {{ $t('message.updateSuccessful') }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="showSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </form>
</template>

<script>
import AddSong from '@/components/AddSong.vue'
import useStorage from '@/composables/useStorage'
import useDocument from '@/composables/useDocument'
import getDocument from '@/composables/getDocument'
import useCollection from '@/composables/useCollection'
import getUser from '@/composables/getUser'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  props: ['id'],
  components: { AddSong },
  setup(props) {
    const { error, document: playlist } = getDocument('playlists', props.id)
    const { user } = getUser()
    const { deleteDoc } = useDocument('playlists', props.id)
    const { updateDoc } = useCollection('playlists', props)
    const { deleteImage } = useStorage()
    const router = useRouter()
    const showSnackbar = ref(false)

    const ownership = computed(() => {
      return playlist.value 
        && user.value 
        && user.value.uid == playlist.value.userId
    })

    const handleDelete = async () => {
      await deleteDoc()
      await deleteImage(playlist.value.filePath)
      router.push({ name: 'Home' })
    }

    const handleClick = async (id) => {
      const songs = playlist.value.songs.filter((song) => song.id != id)
      await updateDoc({ songs })
    }

    const update = async (room) => {
      try {
        await updateDoc({
          id: room.id,
          title: room.title,
          rent: Number(room.rent),
          deposit: Number(room.deposit),
          moveInDate: room.moveInDate,
          moveOutDate: room.moveOutDate,
          lastTimeElectricMeter: Number(room.lastTimeElectricMeter),
          remark: room.remark,
          userId: room.userId,
          userName: room.userName,
          coverUrl: room.coverUrl,
          filePath: room.filePath,
          songs: [],
          createdAt: room.createdAt
        })
        showSnackbar.value = true
      } catch (err) {
        console.error("Update failed", err)
      }
    }

    return { error, playlist, ownership, handleDelete, handleClick, update, showSnackbar }
  }
}
</script>

<style>
  /* .playlist-details {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 80px;
  } */
  .cover {
    overflow: hidden;
    border-radius: 20px;
    position: relative;
    padding: 160px;
  }
  .cover img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
    max-width: 200%;
    max-height: 200%;
  }
  .playlist-info {
    text-align: center;
  }
  .playlist-info h2 {
    text-transform: capitalize;
    font-size: 28px;
    margin-top: 20px;
  }
  .playlist-info p {
    margin-bottom: 20px;
  }
  .username {
    color: #999;
  }
  .remark {
    text-align: left;
  }
  .single-song {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed var(--secondary);
    margin-bottom: 20px;
  }
</style>
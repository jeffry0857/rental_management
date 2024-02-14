<template>
  <div v-if="error" class="error">{{ error }}</div>
  <div v-if="playlist" class="playlist-details">{{ error }}</div>

  <div class="playlist-info">
    <div class="cover">
      <img :src="playlist.coverUrl">
    </div>
    <h2>{{ playlist.title }}</h2>
    <p class="username">Created by {{ playlist.userName }}</p>
    <p class="description">{{ playlist.description }}</p>
    <button if="ownership">Delete Playlist</button>
  </div>

  <div class="song-list">
    <p>song list here</p>
  </div>
</template>

<script>
import getDocument from '@/composables/getDocument';
import getUser from '@/composables/getUser'
import { computed } from 'vue';

export default {
  props: ['id'],
  setup(props) {
    const { error, document: playlist } = getDocument('playlists', props.id)
    const { user } = getUser()

    const ownership = computed(() => {
      return playlist.value && user.value && user.value.uid == playlist.value.userId
    })

    return { error, playlist, ownership }
  }
}
</script>

<style>
  .playlist-details {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 80px
  }
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
    margin-top: 20%;
  }
  .playlist-info p {
    margin-bottom: 20px;
  }
  .username {
    color: #999
  }
  .description {
    text-align: left;
  }
</style>
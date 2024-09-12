<template>
  <div class="error" v-if="error">{{ error }}</div>
  <v-card v-if="room" max-height="900px" variant="variant" class="ma-4 pa-3">
    <v-card-text>{{ $t('message.edit') }}</v-card-text>
    <div class="playlist-info mt-1">
      <v-row>
        <v-col>
          <v-text-field
            v-model="room.title"
            :label="$t('message.room')">
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="room.lastTimeElectricMeter"
            :label="$t('message.lastTimeElectricMeter')">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="room.rent"
            :label="$t('message.rent')">
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="room.deposit"
            :label="$t('message.deposit')">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" sm="5">
          <label>{{ $t('message.moveInDate') }}</label>
        </v-col>
        <v-col>
          <v-menu
            v-model="isMoveInDatePopedUp"
            :close-on-content-click="false"
            location="top"
          >
            <template v-slot:activator="{ props }">
              <v-textfield v-bind="props">
                {{ formattedMoveInDate }}
              </v-textfield>
            </template>
            <v-card>
              <v-list>
                <v-list-item>
                  <v-date-picker v-model="selectedMoveInDate"></v-date-picker>
                </v-list-item>
              </v-list>
              <template v-slot:actions>
                <v-btn @click="isMoveInDatePopedUp = false"
                  :text="$t('message.confirm')"
                  block
                ></v-btn>
              </template>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" sm="5">
          <label>
            {{ $t('message.moveOutDate') }}
          </label>
        </v-col>
        <v-col>
          <v-menu
            v-model="isMoveOutDatePopedUp"
            :close-on-content-click="false"
            location="bottom"
          >
            <template v-slot:activator="{ props }">
              <v-textfield v-bind="props">
                {{ formattedMoveOutDate }}
              </v-textfield>
            </template>
            <v-card>
              <v-list>
                <v-list-item>
                  <v-date-picker v-model="selectedMoveOutDate"></v-date-picker>
                </v-list-item>
              </v-list>
              <template v-slot:actions>
                <v-btn @click="isMoveOutDatePopedUp = false"
                  :text="$t('message.confirm')"
                  block
                ></v-btn>
              </template>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" sm="5">
          <label>
            {{ $t('message.lastTimePaid') }}
          </label>
        </v-col>
        <v-col>
          <v-menu
            v-model="isLastTimePaid"
            :close-on-content-click="false"
            location="bottom"
          >
            <template v-slot:activator="{ props }">
              <v-textfield v-bind="props">
                {{ formattedLastTimePaid }}
              </v-textfield>
            </template>
            <v-card>
              <v-list>
                <v-list-item>
                  <v-date-picker v-model="selectedLastTimePaid"></v-date-picker>
                </v-list-item>
              </v-list>
              <template v-slot:actions>
                <v-btn @click="isLastTimePaid = false"
                  :text="$t('message.confirm')"
                  block
                ></v-btn>
              </template>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
      <textarea variant="filled" :label="$t('message.remark') "
      v-model="room.remark"></textarea>
      <div v-if="room.coverUrl !== null" class="cover">
        <img :src="room.coverUrl">
      </div>
      <button @click="update(room)" class="mr-2">
        <v-icon icon="mdi-update" />
        {{ $t('message.update') }}
      </button>
      <button @click="handleDelete">
        <v-icon icon="mdi-delete" />
        {{ $t('message.delete') }}
      </button>
    </div>

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
    
    <!-- {{ room }} -->

  </v-card>
  <!-- 更新後成功提示 -->
  <v-snackbar variant="tonal" class="mt-4"
    v-model="showSnackbar" :timeout="3000"
  >
    {{ $t('message.updateSuccessful') }}
  </v-snackbar>
</template>

<script>
import { ref, computed } from 'vue'
import AddSong from '@/components/AddSong.vue'
import useDocument from '@/composables/useDocument'
import getDocument from '@/composables/getDocument'
import { useRouter } from 'vue-router'
import useCollection from '@/composables/useCollection'

export default {
  props: ['id'],
  components: { AddSong },
  setup(props) {
    const isMoveInDatePopedUp = ref(false)
    const isMoveOutDatePopedUp = ref(false)
    const isLastTimePaid = ref(false)
    const selectedMoveInDate = ref(new Date())
    const formattedMoveInDate = computed(() => {
      return dateToFormat(selectedMoveInDate.value)
    });
    const selectedMoveOutDate = ref(new Date())
    const formattedMoveOutDate = computed(() => {
      return dateToFormat(selectedMoveOutDate.value)
    })
    const selectedLastTimePaid = ref(new Date())
    const formattedLastTimePaid = computed(() => {
      return dateToFormat(selectedLastTimePaid.value)
    });
    const { error, document: room } = getDocument('playlists', props.id)
    const { updateDoc } = useCollection('playlists', props.id)
    const { deleteDoc } = useDocument('playlists', props.id)
    // const { deleteImage } = useStorage()
    const router = useRouter()
    const showSnackbar = ref(false)

    const handleDelete = async () => {
      await deleteDoc()
      // await deleteImage(room.value.filePath)
      router.push({ name: 'Home' })
    }

    const handleClick = async (id) => {
      const songs = playlist.value.songs.filter((song) => song.id != id)
      console.log("songs : ", songs)
      await updateDoc({ songs })
    }

    const update = async (room) => {
      if (!room) {
        console.error("Room data not available");
        return;
      }

      try {
        await updateDoc({
          id: room.id,
          title: room.title,
          rent: Number(room.rent),
          deposit: Number(room.deposit),
          moveInDate: selectedMoveInDate.value.getTime(),
          moveOutDate: room.moveOutDate,
          lastTimeElectricMeter: Number(room.lastTimeElectricMeter),
          lastTimePaid: selectedLastTimePaid.value.getTime(),
          remark: room.remark,
          userId: room.userId,
          userName: room.userName,
          coverUrl: room.coverUrl,
          filePath: room.filePath,
          songs: [],
          createdAt: room.createdAt
        })
        showSnackbar.value = true
        setTimeout(() => {
          showSnackbar.value = false
        }, 3000)
      } catch (err) {
        console.error("Update failed", err)
      }
    }

    // Date Object to YYYYMMDD
    const dateToFormat = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}, ${month}, ${day}`;
    }

    return { error, room, handleDelete, handleClick, update, showSnackbar, selectedMoveInDate, selectedMoveOutDate, formattedMoveInDate, formattedMoveOutDate, isMoveOutDatePopedUp, isMoveInDatePopedUp, selectedLastTimePaid, formattedLastTimePaid, isLastTimePaid }
  }
}
</script>

<style>
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
<template>
  <form @submit.prevent="handleSubmit">
    <h4>{{ $t('message.create') }}</h4>
    <v-row class="mt-1">
      <v-col>
        <v-text-field v-model="title" :label="$t('message.room')"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field v-model="lastTimeElectricMeter" :label="$t('message.lastTimeElectricMeter')"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="rent" :label="$t('message.rent')"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field v-model="deposit" :label="$t('message.deposit')"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
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
      <v-col>
        <label>{{ $t('message.moveOutDate') }}</label>
      </v-col>
      <v-col>
        <v-menu
          v-model="isMoveOutDatePopedUp"
          :close-on-content-click="false"
          location="top"
        >
          <template v-slot:activator="{ props }">
            <v-textfield clearable v-bind="props">
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
      <v-col>
        <label>{{ $t('message.lastTimePaid') }}</label>
      </v-col>
      <v-col>
        <v-menu
          v-model="isLastTimePaidPopedUp"
          :close-on-content-click="false"
          location="top"
        >
          <template v-slot:activator="{ props }">
            <v-textfield clearable v-bind="props">
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
              <v-btn @click="isLastTimePaidPopedUp = false"
                :text="$t('message.confirm')"
                block
              ></v-btn>
            </template>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
    <textarea :placeholder="$t('message.remark')" v-model="remark"></textarea>
    <input type="file" @change="handleChange">
    <div class="error">{{ fileError }}</div>
    <div class="error"></div>
    <button v-if="!isPending">{{ $t('message.create') }}</button>
    <button v-else disabled>{{ $t('message.saving') }}...</button>
  </form>
</template>

<script>
import { ref, computed } from 'vue'
import useStorage from '@/composables/useStorage'
import useCollection from '@/composables/useCollection'
import getUser from '@/composables/getUser'
import { timestamp } from '@/firebase/config'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n';

export default {
  setup() {
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
    })

    const { filePath, url, uploadImage } = useStorage()
    const { error, addDoc } = useCollection('playlists')
    const { user } = getUser()
    const router = useRouter()

    const { t, locale } = useI18n();
    const setLocale = (newLocale) => {
      locale.value = newLocale
    }

    const isMoveInDatePopedUp = ref(false)
    const isMoveOutDatePopedUp = ref(false)
    const isLastTimePaidPopedUp = ref(false)
    const title = ref('')
    const deposit = ref(0)
    const remark = ref('')
    const rent = ref(0)
    const lastTimeElectricMeter = ref(0)
    const file = ref(null)
    const fileError = ref(null)
    const isPending = ref(false)

    const handleSubmit = async () => {
      isPending.value = true
      // await uploadImage(file.value)
      const res = await addDoc({
        title: title.value,
        remark: remark.value,
        rent: Number(rent.value),
        deposit: Number(deposit.value),
        moveInDate: selectedMoveInDate.value.getTime(),
        moveOutDate: selectedMoveOutDate.value.getTime(),
        lastTimePaid: selectedLastTimePaid.value.getTime(),
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
        router.push({ name: 'Home' })
      }
    }

    const types = ['image/png', 'image/jpeg']

    // 處理圖檔
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

    // Date Object to YYYYMMDD
    const dateToFormat = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}, ${month}, ${day}`;
    }

    return { t, setLocale, isLastTimePaidPopedUp, isMoveInDatePopedUp, isMoveOutDatePopedUp, title, remark, rent, deposit, lastTimeElectricMeter, handleSubmit, handleChange, fileError, isPending, selectedMoveInDate, formattedMoveInDate, selectedMoveOutDate, formattedMoveOutDate, selectedLastTimePaid, formattedLastTimePaid }
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
    /* display: block; */
    /* margin-top: 30px; */
  }

</style>
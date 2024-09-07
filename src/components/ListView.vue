<template>
  <div v-for="room in formattedRoomList" :key="room.id">
    <div class="rooms">
      <v-row>
        <v-col cols="10">
          <div class="d-flex justify-space-between">
            <span>{{ room.title }}</span>&nbsp;&nbsp;
            <span>{{ $t('message.rent') }}&nbsp;&nbsp;{{ room.rent }}</span>
          </div>
          <v-spacer></v-spacer>
          <div class="d-flex justify-space-between">
            <span>{{ $t('message.moveInDate') }}</span>
            <div>{{ room.formattedMoveInDate }}</div>
          </div>
          <div class="d-flex justify-space-between">
            <span>{{ $t('message.moveOutDate') }}</span>
            <span>{{ room.formattedMoveOutDate }}</span>
          </div>
          <div class="d-flex justify-space-between">
            <span>{{ $t('message.lastTimePaid') }}</span>
            <span>{{ room.formattedLastTimePaid }}</span>
          </div>
          <div class="d-flex justify-space-between">
            <span>{{ $t('message.lastTimeElectricMeter') }}</span>
            <span>{{ room.lastTimeElectricMeter }}</span>
          </div>
          <v-text-field
            v-model="room.currentElectricMeter"
            :label="$t('message.currentElectricMeter')">
          </v-text-field>
          <div class="d-flex align-center">
            <!-- <label>{{ $t('message.currentElectricMeter') }}</label> -->
            <!-- <input type="number" required :placeholder="$t('message.currentElectricMeter')" v-model="room.currentElectricMeter"> -->
            
            <button @click="caculateElectricityBill(room)">
              {{ $t('message.caculate') }}
            </button>
            <v-dialog
              v-model="isRentPaymentReminderOn"
              width="auto"
            >
              <v-card
                max-width="400"
              >
                <v-card-text>
                  {{ calculatedText }}
                </v-card-text>
                <template v-slot:actions>
                  <v-icon @click="copyText" icon="mdi-content-copy"></v-icon>
                </template>
              </v-card>
            </v-dialog>
            <button class="ml-1" @click="paid(room)">{{ $t('message.paid') }}</button>
          </div>
        </v-col>
        <v-col cols="2">

          <router-link :to="{ name: 'PlaylistDetails', params: { id: room.id}}">
            <div class="action">
              <v-icon icon="mdi-pencil" />
            </div>
          </router-link>
        </v-col>
      </v-row>
    </div>
    <v-divider></v-divider>
    <!-- {{ room }} -->
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import useCollection from '@/composables/useCollection'

export default {
  props: ['roomList'],
  setup(props) {
      const isRentPaymentReminderOn = ref(false)
      const { updateDoc } = useCollection('playlists', props)
      const calculatedText = ref('')
      const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`
      };

    const formattedRoomList = computed(() => {
      return props.roomList.map(room => {
        return {
          ...room,
          currentElectricMeter: room.currentElectricMeter || '',
          formattedMoveInDate: formatDate(room.moveInDate),
          formattedMoveOutDate: formatDate(room.moveOutDate),
          formattedLastTimePaid: formatDate(room.lastTimePaid)
        };
      });
    });

    // 電費計算
    const caculateElectricityBill = (room) => {
      if (room.currentElectricMeter !== '' && room.lastTimeElectricMeter <= room.currentElectricMeter) {
        isRentPaymentReminderOn.value = true
        let electricityBill = 0
        electricityBill = (room.currentElectricMeter - room.lastTimeElectricMeter) * 5

        calculatedText.value = `${room.title} 電費：(${room.currentElectricMeter} - ${room.lastTimeElectricMeter})* 5 = ${electricityBill} 元整。應匯房租 ${room.rent} + 電費 ${electricityBill} = ${electricityBill + room.rent} 元整。匯款後截圖匯款明細傳給我, 感謝 ~`
      }
    }

    // 複製應繳內容
    const copyText = () => {
      navigator.clipboard.writeText(calculatedText.value)
        .then(() => {
          isRentPaymentReminderOn.value = false
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }

    // 將最新電錶更新於db
    const paid = async (room) => {
      await updateDoc({
        id: room.id,
        title: room.title,
        rent: Number(room.rent),
        deposit: Number(room.deposit),
        moveInDate: room.moveInDate,
        moveOutDate: room.moveOutDate,
        lastTimePaid: room.lastTimePaid,
        lastTimeElectricMeter: Number(room.currentElectricMeter),
        remark: room.remark,
        userId: room.userId,
        userName: room.userName,
        coverUrl: room.coverUrl,
        filePath: room.filePath,
        songs: [],
        createdAt: room.createdAt
      })
    }

    return {
      formattedRoomList, caculateElectricityBill, calculatedText, isRentPaymentReminderOn, copyText, paid
    };
  }
}
</script>

<style scoped>
  .rooms {
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 10px;
    background: white;
    transition: all ease 0.2s;
  }
  .rooms:hover {
    box-shadow: 1px 2px 3px rgba(50,50,50,0.05);
    transform: scale(1.02);
    transition: all ease 0.2s;
  }
  .action {
    max-width: 100px;
    max-height: 100px;
    overflow: hidden;
    border-radius: 10px;
  }
  img {
    max-width: 150%;
    max-height: 150%;
    display: block;
  }
  .song-number {
    margin-left: auto;
  }
</style>
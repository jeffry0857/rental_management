<template>
  <div v-for="room in formattedRoomList" :key="room.id">
    <div v-if="ownership(room)" class="rooms d-flex justify-center pa-4">
      <v-row class="d-flex justify-center">
        <v-col cols="12" sm="10">
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
          <div class="d-flex align-center justify-space-between">
            <!-- <label>{{ $t('message.currentElectricMeter') }}</label> -->
            <!-- <input type="number" required :placeholder="$t('message.currentElectricMeter')" v-model="room.currentElectricMeter"> -->
            <div>
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
              <button class="ml-1" @click="paid(room)">
                {{ $t('message.paid') }}
              </button>
            </div>
            <!-- <router-link :to="{ name: 'PlaylistDetails', params: { id: room.id }}"> -->
            <router-link :to="{ name: 'PlaylistDetails', params: { id: room.id }}">
              <div class="pa-4 text-center">
                <v-icon icon="mdi-pencil">
                  <!-- {{ $t('message.edit') }} -->
                </v-icon>
                <!-- <v-btn
                  class="text-none font-weight-regular"
                  prepend-icon="mdi-pencil"
                  :text="$t('message.edit')"
                  variant="tonal"
                  v-bind="activatorProps"
                ></v-btn> -->
                <v-dialog
                  v-model="isEditingModalOpen"
                  transition="dialog-bottom-transition"
                  max-width="600"
                >
                  <v-card
                    prepend-icon="mdi-account"
                    :title="$t('message.edit')"
                  >
                    <v-card-text>
                      <v-row>
                        <v-col cols="6" sm="5">
                        <v-text-field
                          v-model="selectedRoom.title"
                          :label="$t('message.room')">
                        </v-text-field>
                        </v-col>
                        <v-col cols="6" sm="5">
                          <v-text-field
                            v-model="selectedRoom.lastTimeElectricMeter"
                            :label="$t('message.lastTimeElectricMeter')">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6" sm="5">
                          <v-text-field
                            v-model="selectedRoom.rent"
                            :label="$t('message.rent')">
                          </v-text-field>
                        </v-col>

                        <v-col cols="6" sm="5">
                          <v-text-field
                            v-model="selectedRoom.deposit"
                            :label="$t('message.deposit')">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6" sm="5">
                          <label>
                            {{ $t('message.moveInDate') }}
                          </label>
                        </v-col>
                        <v-col>
                          <v-menu
                            v-model="isMoveInDatePopedUp"
                            :close-on-content-click="false"
                            location="bottom"
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
                                <v-btn @click="!isMoveOutDatePopedUp"
                                  :text="$t('message.confirm')"
                                  block
                                ></v-btn>
                              </template>
                            </v-card>
                          </v-menu>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        :text="$t('message.cancel')"          
                        variant="tonal"
                        @click="!isEditingModalOpen"
                      ></v-btn>
                      <v-btn
                        :text="$t('message.confirm')"
                        variant="plain"
                        @click="saveRoom"
                      ></v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </router-link>
          </div>
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
import getUser from '@/composables/getUser'

export default {
  props: ['roomList'],
  setup(props) {
    const isEditingModalOpen = ref(false)
    const isRentPaymentReminderOn = ref(false)
    const isMoveInDatePopedUp = ref(false)
    const isMoveOutDatePopedUp = ref(false)
    const selectedMoveInDate = ref(new Date())
    const selectedMoveOutDate = ref(new Date())
    const formattedMoveInDate = computed(() => {
      return dateToFormat(selectedMoveInDate.value)
    })
    const formattedMoveOutDate = computed(() => {
      return dateToFormat(selectedMoveOutDate.value)
    })
    const selectedRoom = ref(null)
    const { updateDoc } = useCollection('playlists', props)
    const calculatedText = ref('')
    const { user } = getUser()
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`
    };

    const dateToFormat = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}, ${month}, ${day}`;
    }

    // 權限管制 (建立者僅可看到自己建立的資料)
    const ownership = (room) => {
      return user.value && room.userId === user.value.uid;
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
      console.log('room : ', room)
      if (room.currentElectricMeter !== '' && room.lastTimeElectricMeter <= room.currentElectricMeter) {
        await updateDoc({
          ...room,
          // id: room.id,
          // title: room.title,
          // rent: Number(room.rent),
          // deposit: Number(room.deposit),
          // moveInDate: room.moveInDate,
          // moveOutDate: room.moveOutDate,
          lastTimePaid: room.lastTimePaid,
          lastTimeElectricMeter: Number(room.currentElectricMeter),
          // remark: room.remark,
          // userId: room.userId,
          // userName: room.userName,
          // coverUrl: room.coverUrl,
          // filePath: room.filePath,
          // songs: [],
          // createdAt: room.createdAt
        })
      }
    }

    const saveRoom = async () => {
      if (selectedRoom.value) {
        await updateDoc(selectedRoom.value)
        isEditingModalOpen.value = false
      }
    }
    
    return {
      formattedRoomList, caculateElectricityBill, calculatedText, isRentPaymentReminderOn, copyText, paid, selectedRoom, isEditingModalOpen, isMoveInDatePopedUp, isMoveOutDatePopedUp, formattedMoveInDate, selectedMoveInDate, selectedMoveOutDate, formattedMoveOutDate, saveRoom, ownership
    };
  }
}
</script>

<style scoped>
  /* .rooms {
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 10px;
    background: white;
    transition: all ease 0.2s;
  } */
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
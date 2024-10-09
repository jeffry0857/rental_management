<template>
  <div class="error" v-if="error">{{ error }}</div>
  <form @submit.prevent="update(room)">
    <div class="d-flex justify-space-between">
      <h4>{{ $t('message.edit') }}</h4>
      <v-tabs
        v-model="tab"
        stacked=false
      >
        <v-tab value="basic_info">
          {{ $t('message.basic_info') }}
        </v-tab>
        <v-tab value="payment_info">
          {{ $t('message.paymentRecord') }}
        </v-tab>
      </v-tabs>
    </div>
    <v-card-text>
      <v-tabs-window v-model="tab">
        <!-- 基本資訊 -->
        <v-tabs-window-item value="basic_info">
          <div v-if="room" class="mt-1">
            <!-- 房號/電錶 -->
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
            <!-- 租金/押金 -->
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
            <!-- 起租日 -->
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
            <!-- 退租日 -->
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
            <!-- 上次繳租日期 -->
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
            <!-- 指定付租日 -->
            <v-row>
              <v-col cols="4">
                <label>指定每月</label>
              </v-col>
              <v-col cols="2">
                <input v-model="room.estimatedPayOn" type="text" class="underlined-input">
              </v-col>
              <v-col cols="3">
                <label>號付租</label>
              </v-col>
            </v-row>
            <!-- 備註 -->
            <v-row>
              <textarea :placeholder="$t('message.remark')"
              v-model="room.remark"></textarea>
            </v-row>
            <div v-if="room.coverUrl !== null" class="cover">
              <img :src="room.coverUrl">
            </div>
            <v-card-actions class="d-flex justify-space-around">
              <button class="mr-2">
                <v-icon icon="mdi-update" />
                {{ $t('message.update') }}
              </button>
              <button @click="handleDelete">
                <v-icon icon="mdi-delete" />
                {{ $t('message.delete') }}
              </button>
            </v-card-actions>
          </div>
        </v-tabs-window-item>
        <!-- 繳租紀錄 -->
        <v-tabs-window-item value="payment_info">
          <v-card v-if="room">
            <v-card-item :key="index"
              v-for="(payment, index) in room.payments.paymentHistory"
              class="pt-0"
            >
              <v-card-subtitle class="d-flex justify-space-between">
                <strong>
                  {{ payment.period }}
                </strong>
                <strong>
                  {{ mapPaymentStatus(payment.paymentStatus) }}
                </strong>
              </v-card-subtitle>
              <v-card-text class="pt-0">
                <div class="d-flex justify-space-between align-center mb-1">
                  <span>{{ $t('message.dueDate') }}</span>
                  <span>{{ timestampToFormat(payment.dueDate) }}</span>
                </div>
                <div class="d-flex justify-space-between align-center mb-1">
                  <span>{{ $t('message.paidAt') }}</span>
                  <span>{{ timestampToFormat(payment.paidAt) }}</span>
                </div>
                <div class="d-flex justify-space-between align-center mb-1">
                  <span>{{ $t('message.paid') }}</span>
                  <span>{{ payment.amountPaid }} 元</span>
                </div>
                <!-- 彈窗 -->
                <v-dialog
                  transition="dialog-bottom-transition"
                  width="auto"
                  v-model="isToPayDialogOn"
                >
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                      v-bind="activatorProps"
                      class="align-center-btn"
                      append-icon="mdi-arrow-right-bold-outline"
                      :text="$t('message.toPay')"
                      block
                      @click="proceedToPay(index)"
                    >
                    </v-btn>
                  </template>
                  <!-- <template v-slot:default="{ isActive }"> -->
                    <v-card>
                      <v-toolbar></v-toolbar>
                      <v-card-text>
                        <v-row class="d-flex">
                          <v-col cols="6">
                            <span>
                              {{ $t('message.currentElectricMeter') }}
                            </span>
                          </v-col>
                          <v-col cols="6">
                            <input type="text" class="underlined-input" v-model="currentElectricMeter">
                          </v-col>
                        </v-row>
                        <v-row class="d-flex">
                          <v-col cols="6">
                            <span>
                              {{ $t('message.amount') }}
                            </span>
                          </v-col>
                          <v-col cols="6">
                            <input type="text" class="underlined-input" v-model="paidAmount">
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-btn
                          :text="$t('message.cancel')"
                          @click="isToPayDialogOn = false"
                        ></v-btn>
                        <v-btn
                          :text="$t('message.confirm')"
                          @click="paid(room)"
                        ></v-btn>
                      </v-card-actions>
                    </v-card>
                  <!-- </template> -->
                </v-dialog>
              </v-card-text>
              <v-divider inset></v-divider>
            </v-card-item>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </form>
  <!-- 更新後成功提示 -->
  <v-snackbar variant="tonal" class="mt-4"
    v-model="showSnackbar" :timeout="3000"
  >
    {{ $t('message.updateSuccessful') }}
  </v-snackbar>
  <!-- {{ room }} -->
</template>

<script>
import { ref, watchEffect, computed } from 'vue'
import AddSong from '@/components/AddSong.vue'
import useDocument from '@/composables/useDocument'
import getDocument from '@/composables/getDocument'
import dateToFormat from '@/composables/dateTimeConverter'
import { useRouter } from 'vue-router'
import useCollection from '@/composables/useCollection'
import { PaymentStatus } from '@/enum/PaymentStatus'

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
    const paidAmount = ref(0)
    const currentElectricMeter = ref(0)
    const tab = ref(null)
    const isToPayDialogOn = ref(false)
    const index = ref(-1)

    const handleDelete = async () => {
      await deleteDoc()
      // await deleteImage(room.value.filePath)
      router.push({ name: 'Home' })
    }

    const update = async (room) => {
      if (!room) {
        console.error("Room data not available");
        return;
      }
      // 先清空上次的 paymentHistory
      room.payments.paymentHistory = [];
      // 將繳租日期明確定義出來
      const paymentDates = calculatePaymentDates(
        selectedMoveInDate.value.getTime(),
        selectedMoveOutDate.value.getTime(),
        Number(room.estimatedPayOn)
      );
      let paymentDateObjsInArr = paymentDates.map((obj, index) => ({
        dueDate: obj.paymentDate,
        period: obj.period,
        paidAt: null,
        amountPaid: 0,
        paymentStatus: index === 0 ? PaymentStatus.UPCOMING : PaymentStatus.INCOMPLETED
      }));
      try {
        await updateDoc({
          ...room,
          id: room.id,
          title: room.title,
          rent: Number(room.rent),
          deposit: Number(room.deposit),
          moveInDate: selectedMoveInDate.value.getTime(),
          moveOutDate: selectedMoveOutDate.value.getTime(),
          lastTimeElectricMeter: Number(room.lastTimeElectricMeter),
          estimatedPayOn: Number(room.estimatedPayOn),
          payments: {
            paymentHistory: paymentDateObjsInArr,
            lastTimePaid: null,
            paymentStatus: PaymentStatus.UPCOMING,
          },
          remark: room.remark,
          coverUrl: room.coverUrl,
          filePath: room.filePath,
        })
        showSnackbar.value = true
        setTimeout(() => {
          showSnackbar.value = false
        }, 3000)
      } catch (err) {
        console.error("Update failed", err)
      }
    }

    const proceedToPay = (selectedIndex) => {
      index.value = selectedIndex
      isToPayDialogOn.value = true
    }

    // 將最新電錶 和 已支付金額 更新於db
    const paid = async (room) => {
      if (
        room &&
        index.value !== -1 &&
        currentElectricMeter.value !== '' &&
        room.lastTimeElectricMeter <= currentElectricMeter.value
      ) {
        // 若未完全付清房租
        if (Number(paidAmount.value) !== room.rent) {
          room.payments.paymentStatus = PaymentStatus.OVERDUE
          room.payments.paymentHistory[index.value].paymentStatus = PaymentStatus.OVERDUE
        } else {
          room.payments.paymentStatus = PaymentStatus.DONE
          room.payments.paymentHistory[index.value].paymentStatus = PaymentStatus.DONE
        }
        room.payments.paymentHistory[index.value].amountPaid = Number(paidAmount.value)
        room.lastTimeElectricMeter = currentElectricMeter.value
        room.payments.lastTimePaid = Date.now()
        room.payments.paymentHistory[index.value].paidAt = Date.now()

        try {
          await updateDoc({
            ...room,
            id: room.id
          })
          setTimeout(() => {
            showSnackbar.value = false
          }, 3000)
        } catch (err) {
          console.error("Update failed", err)
        } finally {
          isToPayDialogOn.value = false
          showSnackbar.value = true
          currentElectricMeter.value = 0
          paidAmount.value = 0
        }
      }
    }

    // 處理繳租日期 和 租期區間
    const calculatePaymentDates = (moveInDate, moveOutDate, estimatedPayOn) => {
      // 處理繳租日期
      let paymentDates = [];
      let moveIn = new Date(moveInDate);
      let moveOut = new Date(moveOutDate);
      let payOnDay = Math.min(Math.max(estimatedPayOn, 1), 31);
      let totalMonths = (moveOut.getFullYear() - moveIn.getFullYear()) * 12 + (moveOut.getMonth() - moveIn.getMonth()) + 1;

      let moveInDay = moveIn.getDate()

      for (let i = 0; i < totalMonths; i++) {
        let paymentMonth = payOnDay < moveInDay ? moveIn.getMonth() + i + 1 : moveIn.getMonth() + i;
        let paymentDate = new Date(moveIn.getFullYear(), paymentMonth, payOnDay);
        if (paymentDate.getTime() > moveOut.getTime()) break;
        
        paymentDates.push({
          paymentDate: paymentDate.getTime(),
        });
      }
      
      // 處理每一個租期區間
      let periods = [];
      while (moveIn < moveOut) {
        let periodEndDate = new Date(moveIn);
        periodEndDate.setMonth(periodEndDate.getMonth() + 1);
        periodEndDate.setDate(periodEndDate.getDate() - 1);

        if (periodEndDate > moveOut) {
          periodEndDate = new Date(endDate);
        }

        periods.push({
          period: `${dateToFormat(moveIn)} - ${dateToFormat(periodEndDate)}`
        });

        moveIn = new Date(periodEndDate);
        moveIn.setDate(moveIn.getDate() + 1);
      }
      return paymentDates.map((payment, index) => {
        return {
          paymentDate: payment.paymentDate,
          period: periods[index].period,
        }
      })
    };

    // 繳租狀態
    const mapPaymentStatus = (status) => {
      switch(status) {
        case PaymentStatus.UPCOMING:
          return "即將"
        case PaymentStatus.OVERDUE:
          return "逾期多天"
        case PaymentStatus.DUE:
          return "待付租"
        case PaymentStatus.DONE:
          return "已繳款"
        case PaymentStatus.INCOMPLETED:
          return "尚未"
        default:
          return "未知狀態"
      }
    };

    // Timestamp to YYYY/MM/DD
    const timestampToFormat = (timestamp) => {
      if (timestamp === null) {
        return 'N/A'
      }
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}/${month}/${day}`;
    }

    watchEffect(() => {
      if (room.value) {
        selectedMoveInDate.value = room.value.moveInDate ? new Date(room.value.moveInDate) : new Date();
        selectedMoveOutDate.value = room.value.moveOutDate ? new Date(room.value.moveOutDate) : new Date();
        selectedLastTimePaid.value = room.value.payments?.lastTimePaid ? new Date(room.value.payments.lastTimePaid) : new Date();
      }
    });

    return { error, room, handleDelete, update, showSnackbar, selectedMoveInDate, selectedMoveOutDate, formattedMoveInDate, formattedMoveOutDate, isMoveOutDatePopedUp, paidAmount, currentElectricMeter, isMoveInDatePopedUp, selectedLastTimePaid, formattedLastTimePaid, isLastTimePaid, timestampToFormat, dateToFormat, mapPaymentStatus, paid, proceedToPay, tab, index, isToPayDialogOn }
  }
}
</script>

<style scoped>
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
  /* .playlist-info {
    text-align: center;
  }
  .playlist-info h2 {
    text-transform: capitalize;
    font-size: 28px;
    margin-top: 20px;
  }
  .playlist-info p {
    margin-bottom: 20px;
  } */
  .username {
    color: #999;
  }
  .remark {
    text-align: left;
  }

  .underlined-input {
    border: none;
    border-bottom: 1px solid #000;
    outline: none;
    padding: 0;
  }
  .v-tab:hover {
    background-color: transparent;
    color: inherit;
  }

</style>
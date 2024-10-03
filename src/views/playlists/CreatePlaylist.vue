<template>
  <form @submit.prevent="handleSubmit">
    <h4>{{ $t('message.create') }}</h4>
    <!-- 房號/電錶 -->
    <v-row class="mt-1">
      <v-col>
        <v-text-field v-model="title" :label="$t('message.room')"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field v-model="lastTimeElectricMeter" :label="$t('message.lastTimeElectricMeter')"></v-text-field>
      </v-col>
    </v-row>
    <!-- 租金/押金 -->
    <v-row>
      <v-col>
        <v-text-field v-model="rent" :label="$t('message.rent')"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field v-model="deposit" :label="$t('message.deposit')"></v-text-field>
      </v-col>
    </v-row>
    <!-- 起租日 -->
    <v-row>
      <v-col>
        <span>{{ $t('message.moveInDate') }}</span>
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
      <v-col>
        <span>{{ $t('message.moveOutDate') }}</span>
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
    <!-- 指定付租日 -->
    <v-row class="d-flex">
      <v-col cols="4">
        <span>指定每月</span>
      </v-col>
      <v-col cols="2">
        <input v-model="estimatedPayOn" type="text" class="underlined-input">
      </v-col>
      <v-col cols="4">
        <span>號付租</span>
      </v-col>
    </v-row>
    <!-- 上次繳租日期 -->
    <!-- <v-row>
      <v-col>
        <span>{{ $t('message.lastTimePaid') }}</span>
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
    </v-row> -->
    <!-- 備註 -->
    <v-row>
      <textarea :placeholder="$t('message.remark')" v-model="remark"></textarea>
    </v-row>
    <input type="file" @change="handleChange">
    <div class="error">{{ fileError }}</div>
    <div class="error"></div>
    <button v-if="!isPending" variant="tonal">
      {{ $t('message.create') }}
    </button>
    <button v-else disabled variant="tonal">{{ $t('message.saving') }}...</button>
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
import { PaymentStatus } from '@/enum/PaymentStatus'

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
    const address = ref('')
    const deposit = ref(0)
    const remark = ref('')
    const rent = ref(0)
    const tenantName = ref('')
    const lastTimeElectricMeter = ref(0)
    const file = ref(null)
    const fileError = ref(null)
    const isPending = ref(false)
    const estimatedPayOn = ref(null)

    const handleSubmit = async () => {
      isPending.value = true
      // await uploadImage(file.value)

      // 將繳租日期明確定義出來
      const paymentDates = calculatePaymentDates(
        selectedMoveInDate.value.getTime(),
        selectedMoveOutDate.value.getTime(),
        Number(estimatedPayOn.value)
      );

      let paymentDateObjsInArr = paymentDates.map((obj, index) => ({
        dueDate: obj.paymentDate,
        period: obj.period,
        paidAt: null,
        amountPaid: 0,
        paymentStatus: index === 0 ? PaymentStatus.UPCOMING : PaymentStatus.INCOMPLETED
      }));

      await addDoc({
        title: title.value,
        address: address.value,
        remark: remark.value,
        rent: Number(rent.value),
        deposit: Number(deposit.value),
        moveInDate: selectedMoveInDate.value.getTime(),
        moveOutDate: selectedMoveOutDate.value.getTime(),
        lastTimeElectricMeter: lastTimeElectricMeter.value,
        estimatedPayOn: Number(estimatedPayOn.value),
        payments: {
          paymentHistory: paymentDateObjsInArr,
          lastTimePaid: null,
          paymentStatus: PaymentStatus.UPCOMING,
        },
        tenant: [{
          tenantName: tenantName.value,
          phoneNumber: tenantName.value,
          tenantRemark: tenantName.value,
        }],
        userId: user.value.uid,
        userName: user.value.displayName,
        coverUrl: url.value,
        filePath: filePath.value,
        createdAt: timestamp()
      })
      isPending.value = false
      if (!error.value) {
        router.push({ name: 'Home' })
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

    // const types = ['image/png', 'image/jpeg']

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
      return `${year}/${month}/${day}`;
    }

    return { t, setLocale, isLastTimePaidPopedUp, isMoveInDatePopedUp, isMoveOutDatePopedUp, title, remark, rent, deposit, lastTimeElectricMeter, handleSubmit, handleChange, fileError, isPending, estimatedPayOn, selectedMoveInDate, formattedMoveInDate, selectedMoveOutDate, formattedMoveOutDate, selectedLastTimePaid, formattedLastTimePaid }
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
  }
  .underlined-input {
    border: none;
    border-bottom: 1px solid #000;
    outline: none;
    padding: 0;
  }
</style>
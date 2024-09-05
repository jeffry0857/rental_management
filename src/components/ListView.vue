<template>
  <div v-for="room in formattedRoomList" :key="room.id">
    <!-- <router-link :to="{ name: 'PlaylistDetails', params: { id: room.id}}"> -->
      <div class="single">
        <div class="thumbnail">
          <img :src="room.coverUrl">
        </div>
        <div class="info">
          <span>{{ room.title }}</span>&nbsp;&nbsp;
          <span>{{ $t('message.rent') }}&nbsp;&nbsp;{{ room.rent }}</span>
          <v-spacer></v-spacer>
          <div>{{ $t('message.moveInDate') }}&nbsp;&nbsp;{{ room.formattedMoveInDate }}</div>
          <div>{{ $t('message.moveOutDate') }}&nbsp;&nbsp;{{ room.formattedMoveOutDate }}</div>
          <div>{{ $t('message.lastTimeElectricMeter') }}&nbsp;&nbsp;{{ room.lastTimeElectricMeter }}</div>
          <div class="d-flex">
            <!-- <label>{{ $t('message.currentElectricMeter') }}</label> -->
            <input type="text" required :placeholder="$t('message.currentElectricMeter')" v-model="currentElectricMeter">
            <button @click="caculateElectricityBill(room.lastTimeElectricMeter)">{{ $t('message.caculate') }}</button>
          </div>
          <div class="d-flex justify-space-between">
            <span>{{ $t('電費') }}&nbsp;&nbsp;{{ electricityBill }}</span>
            <v-btn>{{ $t('已結清') }}</v-btn>
          </div>
        </div>
      </div>
    <!-- </router-link> -->
    {{ room }}
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  props: ['roomList'],
  setup(props) {
      const currentElectricMeter = ref('')
      const electricityBill = ref('')
      const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
      };

    const formattedRoomList = computed(() => {
      return props.roomList.map(room => {
        return {
          ...room,
          formattedMoveInDate: formatDate(room.moveInDate),
          formattedMoveOutDate: formatDate(room.moveOutDate)
        };
      });
    });

    const caculateElectricityBill = async (lastTimeElectricMeter) => {
      electricityBill.value = (currentElectricMeter.value - lastTimeElectricMeter) * 5
    }

    return {
      formattedRoomList, currentElectricMeter, caculateElectricityBill, electricityBill
    };
  }
}
</script>

<style scoped>
  .single {
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 10px;
    background: white;
    transition: all ease 0.2s;
  }
  .single:hover {
    box-shadow: 1px 2px 3px rgba(50,50,50,0.05);
    transform: scale(1.02);
    transition: all ease 0.2s;
  }
  .thumbnail {
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
  .info {
    margin: 0 20px;
  }
  .song-number {
    margin-left: auto;
  }
</style>
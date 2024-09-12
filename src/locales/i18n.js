import { createI18n } from "vue-i18n";

// Translation definition
const messages = {
  en: {
    message: {
      create: "Create",
      edit: "Edit",
      update: "Update",
      delete: "Delete",
      confirm: "Confirm",
      loading: "Loading",
      saving: "Saving",
      cancel: "Cancel",
      login: "Login",
      logout: "Log out",
      signup: "Sign up",
      upload_room_photo: "Upload Room Photo",
      rent: "Rent",
      deposit: "Deposit",
      room: "Room",
      remark: "Remark",
      lastTimeElectricMeter: "Latest Electric Meter",
      currentElectricMeter: "Current Meter",
      moveInDate: "Lease Start Date",
      moveOutDate: "Lease End Date",
      lastTimePaid: "Last time paid",
      caculate: "Caculate",
      paid: "Paid",
      updateSuccessful: "Successfully updated",
      roomNotExist: "The room does not exist",
    },
  },
  tw: {
    message: {
      create: "新增",
      edit: "編輯",
      update: "更新",
      delete: "刪除",
      confirm: "確認",
      loading: "讀取中",
      saving: "儲存中",
      cancel: "取消",
      login: "登入",
      logout: "登出",
      signup: "註冊",
      upload_room_photo: "上傳房間照片",
      rent: "租金",
      deposit: "押金",
      room: "房號",
      remark: "備註",
      lastTimeElectricMeter: "上次電表",
      currentElectricMeter: "當前電表",
      moveInDate: "起租日",
      moveOutDate: "退租日",
      lastTimePaid: "上次繳租",
      caculate: "計算",
      paid: "已繳",
      updateSuccessful: "更新成功",
      roomNotExist: "不存在的房源",
    },
  },
};

// Create i18n instance
const i18n = createI18n({
  locale: "tw", // 設定本地語系
  fallbackLocale: "tw", // 設定首選語言缺少翻譯時要使用的語言
  messages, // 語系包
  legacy: false,
  globalInjection: true, // 該屬性可讓所有元件中注入前綴為`$`的全域屬性 & 方法
});

export default i18n;

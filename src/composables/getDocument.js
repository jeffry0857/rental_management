import { watchEffect, ref } from "vue";
import { projectFirestore } from "../firebase/config";
import { useI18n } from "vue-i18n";

const getDocument = (collection, id) => {
  let document = ref(null);
  let error = ref(null);
  const { t, locale } = useI18n();
  const setLocale = (newLocale) => {
    locale.value = newLocale;
  };
  // register the firestore collection reference
  let documentRef = projectFirestore.collection(collection).doc(id);

  const unsub = documentRef.onSnapshot(
    (doc) => {
      // need to make sure the doc exists & has data
      if (doc.data()) {
        document.value = { ...doc.data(), id: doc.id };
        error.value = null;
      } else {
        error.value = t("message.roomNotExist");
      }
    },
    (err) => {
      console.log(err.message);
      error.value = "problem fetching the document";
    }
  );

  watchEffect((onInvalidate) => {
    console.log("onInvalidate : ");
    onInvalidate(() => unsub());
  });

  return { t, setLocale, error, document };
};

export default getDocument;

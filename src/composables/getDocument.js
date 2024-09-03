import { ref, watchEffect } from "vue";
import { projectFirestore } from "../firebase/config";

const getDocument = (collection, id) => {
  const document = ref(null);
  const error = ref(null);

  let collectionRef = projectFirestore
    .collection(collection)
    .orderBy("createdAt");

  let documentRef = projectFirestore.collection(collection).doc(id);

  const unsub = documentRef.onSnapshot(
    (doc) => {
      if (doc.data()) {
        document.data = { ...doc.data(), id: doc.id };
        error.value = null;
      } else {
        error.value = "that document does not exist";
      }
    },
    (err) => {
      console.log(err.message);
      error.value = "could not fetch the document";
    }
    // (snap) => {
    //   let results = [];
    //   snap.docs.forEach((doc) => {
    //     doc.data().createdAt && results.push({ ...doc.data(), id: doc.id });
    //   });

    //   documents.value = results;
    //   error.value = null;
    // },
    // (error) => {
    //   console.log(err.message);
    //   documents.value = null;
    //   error.value = "could not fetch the data";
    // }
  );

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsub());
  });

  return { error, document };
};

export default getDocument;

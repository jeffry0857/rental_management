import { ref } from "vue";
import { projectFirestore } from "../firebase/config";

const useDocument = (collection, id) => {
  let error = ref(null);
  let isPending = ref(false);
  let docRef = projectFirestore.collection(collection).doc(id);
  // console.log("docRef : ", docRef);
  const updateDoc = (updates) => {
    console.log("updates : ", updates);
    isPending.value = true;
    error.value = null;

    return docRef
      .update(updates)
      .then((res) => {
        isPending.value = false;
        console.log("res : ", res);
        return res;
      })
      .catch((err) => {
        console.log(err.message);
        isPending.value = false;
        error.value = "could not update the document";
      });
    // try {
    //   debugger;
    //   const res = await docRef.update(updates);
    //   isPending.value = false;
    //   console.log("res : ", res);
    //   debugger;
    //   return res;
    // } catch (err) {
    //   console.log(err.message);
    //   isPending.value = false;
    //   error.value = "could not update the document";
    // }
  };

  const deleteDoc = async () => {
    isPending.value = true;
    error.value = null;

    try {
      const res = await docRef.delete();
      isPending.value = false;
      return res;
    } catch (err) {
      console.log(err.message);
      isPending.value = false;
      error.value = "could not delete the document";
    }
  };

  return { error, isPending, deleteDoc, updateDoc };
};

export default useDocument;

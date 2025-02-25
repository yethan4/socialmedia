import { db } from "../firebase/config";
import { deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";

export const fetchDocument = async(id, collectionName) => {
  try{
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()){
      return docSnap.data();
    } else {
      console.log("no such document")
    }
  }catch(err){
    console.log(err)
  }  
};

export const deleteDocument = async (collectionName, id) => {
  try {
    const document = doc(db, collectionName, id);
    await deleteDoc(document);
  } catch (err) {
    console.log(err);
  }
};

export const updateDocument = async(col, id, newData={}) => {
  const docRef = doc(db, col, id);

  await updateDoc(docRef, newData);
}

export const getDocuments = async(q) => {
  const querySnapshot = await getDocs(q);
  
  const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

  return {docs, lastDoc}
}
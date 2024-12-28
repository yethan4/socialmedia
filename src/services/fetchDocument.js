import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export const fetchDocument = async(id, colName) => {
  try{
    const docRef = doc(db, colName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()){
      return docSnap.data();
    } else {
      console.log("no such document")
    }
  }catch(err){
    console.log(err)
  }  
}
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase/config";

export const uploadImage = async (file) => {
  const timestamp = Date.now(); // Instead of the date, get the current milliseconds
  const storageRef = ref(storage, `images/${timestamp}_${file.name}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
          reject("Something went wrong!" + error.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export const deleteImage = async (fileURL) => {
  try {
    const path = fileURL.split(`${storage.app.options.storageBucket}/o/`)[1].split("?")[0];
    const decodedPath = decodeURIComponent(path);

    const fileRef = ref(storage, decodedPath);

    await deleteObject(fileRef);
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Could not delete file: " + error.message);
  }
};
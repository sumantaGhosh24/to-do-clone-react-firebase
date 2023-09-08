import {ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";

import {storage} from "./firebase";

export const uploadImage = async (file, path) => {
  try {
    const storageRef = ref(storage, `${path}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const deleteImageFromStorage = async (imageURL) => {
  try {
    const imageRef = ref(storage, imageURL);
    await deleteObject(imageRef);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

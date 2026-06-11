const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error("Image upload failed: " + error);
  }

  const data = await response.json();
  return data.secure_url;
};

export const deleteImage = async (fileURL) => {
  if (!fileURL || !fileURL.includes("res.cloudinary.com")) return;

  const response = await fetch("/.netlify/functions/delete-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: fileURL }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error("Could not delete file: " + error);
  }
};

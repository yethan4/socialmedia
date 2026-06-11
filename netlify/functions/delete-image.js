const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getPublicId = (url) => {
  const after = url.split("/upload/")[1];
  if (!after) return null;

  const parts = after.split("/");
  if (/^v\d+$/.test(parts[0])) parts.shift();

  return parts.join("/").replace(/\.[^/.]+$/, "");
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { url } = JSON.parse(event.body);
    const publicId = getPublicId(url);

    if (!publicId) {
      return { statusCode: 400, body: "Invalid Cloudinary URL" };
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok" && result.result !== "not found") {
      return { statusCode: 500, body: JSON.stringify(result) };
    }

    return { statusCode: 200, body: JSON.stringify({ result: result.result }) };
  } catch (error) {
    return { statusCode: 500, body: "Delete failed: " + error.message };
  }
};

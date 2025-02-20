import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export const useInputHandler = () => {
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [img, setImg] = useState({ file: null, url: "" });

  const textareaRef = useRef();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleChange = useCallback((event) => {
    setText(event.target.value);
  }, []);

  const onEmojiClick = useCallback((event) => {
    setText((prev) => prev + event.emoji);
    setShowPicker(false);
  }, []);

  const handleImage = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file format. Please upload a JPG, PNG, or GIF");
      event.target.value = "";
      return;
    }
  
    setImg({
      file,
      url: URL.createObjectURL(file),
    });
  
    event.target.value = "";
  }, []);  

  const handleRemoveImage = useCallback(() => {
    setImg({ file: null, url: "" });
  }, []);
  
  return {
    text,
    setText,
    showPicker,
    setShowPicker,
    img,
    setImg,
    textareaRef,
    handleChange,
    onEmojiClick,
    handleImage,
    handleRemoveImage,
  };
};

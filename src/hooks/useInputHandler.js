import { useCallback, useEffect, useRef, useState } from "react";

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
    if (event.target.files[0]) {
      setImg({
        file: event.target.files[0],
        url: URL.createObjectURL(event.target.files[0]),
      });
    }
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

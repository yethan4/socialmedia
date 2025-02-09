import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { formatDisplayDate } from "../../../utils/timeUtils";
import { ImageViewer } from "../../../components";

export const MessageCard = ({ message, chatPartner }) => {
  const formattedTime = formatDisplayDate(message.createdAt.seconds);

  const [showTime, setShowTime] = useState(false);
  let hoverTimeout;

  const handleMouseEnter = useCallback(() => {
    hoverTimeout = setTimeout(() => {
      setShowTime(true);
    }, 500);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimeout);
    setShowTime(false);
  }, [hoverTimeout]);

  return (
    <>
      {!chatPartner ? (
        <div 
          className="max-w-[1000px] ml-auto relative group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {message.img && (
            <ImageViewer src={message.img} className="mb-2 rounded-xl max-h-[400px]" />
          )}
          {message.text && (
            <div className="bg-blue-600 text-slate-50 w-fit max-w-[1000px] ml-auto px-2 py-2 rounded-xl">
              {message.text}
            </div>
          )}
          {showTime && (
            <div className="z-30 absolute text-[10px] w-32 pt-1 text-right right-0 opacity-100 transition-opacity duration-100">
              <span className="w-fit bg-gray-100 px-2 py-1 rounded-lg dark:bg-gray-800">
                {formattedTime}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div 
          className="flex relative group w-fit"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="h-fit mt-auto pb-1">
            <img
              src={chatPartner.avatar}
              alt=""
              className="w-8 h-8 object-cover rounded-full mr-2"
            />
          </div>
          <div className="max-w-[1000px]">
            {message.img && (
              <ImageViewer src={message.img} className="mb-2 rounded-xl max-h-[400px]" />
            )}
            {message.text && (
              <div className="bg-gray-200 w-fit max-w-[1000px] mr-10 px-2 py-2 rounded-xl dark:bg-gray-700 dark:text-slate-50">
                {message.text}
              </div>
            )}
          </div>
          {showTime && (
            <div className="z-30 absolute text-[10px] w-32 pt-1 text-right left-2 bottom-[-22px] opacity-100 transition-opacity duration-100">
              <span className="w-fit bg-gray-100 px-2 py-1 rounded-lg dark:bg-gray-800">
                {formattedTime}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

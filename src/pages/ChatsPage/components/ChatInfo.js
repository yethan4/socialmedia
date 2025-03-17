import React, { useState } from 'react'
import { formatDisplayDate } from '../../../utils/timeUtils';
import { Link } from 'react-router-dom';
import { AvatarImage, ConfirmBox, ImageViewer } from '../../../components';
import { useSelector } from 'react-redux';
import { blockUser, blockUserInChat } from '../../../services/usersService';

export const ChatInfo = ({chat, chatPartner, hasCuBlockedChat, lastClearedAt}) => {
  const [option, setOption] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [step, setStep] = useState(1);
  const [ifWholeApp, setIfWholeApp] = useState(false) 

  const lastClearedTime = lastClearedAt>0 ? formatDisplayDate(lastClearedAt) : null
  const createdTime = formatDisplayDate(chat?.createdAt?.seconds)
  const currentUserId = useSelector(state => state.authState.userInfo.id)
  
  const messagesWithImages = chat?.messages?.filter(msg => msg?.img)
  console.log(chat)
  const handleConfirm = () => {
    if(step===1){
      setIfWholeApp(true);
      setStep(2);
    }if(step===2){
      if(ifWholeApp){
        blockUser(currentUserId, chatPartner.id);
      }else{
        blockUserInChat(currentUserId, chatPartner.id);
      }
      setShowConfirmation(false);
      setStep(1);
      setIfWholeApp(false)
    }
  };

  const handleCancel = () => {
    if(step===1){
      setIfWholeApp(false)
      setStep(2)
    }else if(step===2){
      setShowConfirmation(false)
      setStep(1)
      setIfWholeApp(false)
    }
  }

  return (
    <div className="max-lg:w-64 lg:w-96 border-l-2 dark:border-gray-700">
      
      <Link to={`/profile/${chatPartner?.id}`}>
      <div className="flex flex-col items-center justify-center mt-4">
        <AvatarImage src={chatPartner?.avatar} size={24}/>
        <span className="mt-2 text-xl font-semibold">{chatPartner?.username}</span>
      </div>
      </Link>
      
      <div className="flex flex-col mt-10 px-1">

        <div className="flex flex-col items-center">
          <div className="cursor-pointer select-none px-4 py-2 rounded-lg w-full text-center hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => {option === "info" ? setOption("") : setOption("info")}}>
            <i className="bi bi-info-circle mr-1"></i>
            <span className="text-lg">Info</span>
            <i className={option === "info" ? "bi bi-chevron-up ml-2" : "bi bi-chevron-down ml-2"}></i>
          </div>

          {option === "info" && 
          <div className="flex flex-col gap-1 mt-2">
            <span>Chat created - {lastClearedTime || createdTime}</span>
          </div>
          }
        </div>

        <div className="flex flex-col items-center">
          <div className="cursor-pointer select-none px-4 py-2 rounded-lg w-full text-center hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => {option === "photos" ? setOption("") : setOption("photos")}}>
            <i className="bi bi-images mr-1"></i>
            <span className="text-lg">Photos</span>
            <i className={option === "photos" ? "bi bi-chevron-up ml-2" : "bi bi-chevron-down ml-2"}></i>
          </div>

          {option === "photos" && messagesWithImages?.length > 0 &&
            <div className="flex flex-wrap mt-2 gap-2">
              {messagesWithImages.map((msg, index) => (
                <div key={index} className="w-28 h-28 overflow-hidden rounded-lg">
                  <ImageViewer 
                    src={msg.img} 
                    alt={`photo-${index}`} 
                    className="object-cover w-full h-full"  
                  />
                </div>
              ))}
            </div>
          }
          {option === "photos" && messagesWithImages?.length === 0 && (
            <span>No photos in this chat</span>
          )}
        </div>
        
      { !hasCuBlockedChat && (  <div className="px-16 mt-4">
          <div 
          className="cursor-pointer select-none py-2 rounded-lg w-full text-center bg-red-500 text-slate-50 hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-700"
          onClick={() => setShowConfirmation(true)}
          >
            <i className="bi bi-ban mr-1"></i>
            <span className="text-lg">Block {chatPartner.username}</span>
          </div>
        </div>)}
      </div>

      {showConfirmation && (
        <ConfirmBox
          question={
            step === 1 ? (
              "Do you also want to block the user in the whole app?"
            ) : (
              ifWholeApp ? (
                "Are you sure you want to block the user in the whole app?"
              ) : (
                "Are you sure you want to block the user in the chat"
              )
            )
          }
          answers={step === 1 ? ["Yes", "No"] : (ifWholeApp ? ["Block in the whole app", "Cancel"] : ["Block in the chat", "Cancel"])}
          handleYes={handleConfirm}
          handleNo={handleCancel}
        />
      )}
    </div>
  )
}

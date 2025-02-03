import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export const MessageCard = ({message, chatPartner}) => {
  const currentUser = useSelector(state => state.authState.userInfo)

  return (
    <>
      {!chatPartner ? (
      <div className="max-w-[1000px] ml-auto">
        {message.img && (<img src={message.img} className="mb-2 rounded-xl max-h-[400px]" />)}
        {message.text && (<div className="bg-blue-600 text-slate-50 w-fit max-w-[1000px] ml-auto px-2 py-2 rounded-xl">
          {message.text}
        </div>)}
      </div>
      ) : (
      <div className="flex">
        <div className="h-fit mt-auto pb-1">
          <img src={chatPartner.avatar} alt="" className="w-8 h-8 object-cover rounded-full mr-2 "/>
        </div>
        <div className="max-w-[1000px]">
          {message.img && (<img src={message.img} className="mb-2 rounded-xl max-h-[400px]" />)}
          {message.text && 
          (<div className="bg-gray-200 w-fit max-w-[1000px] mr-10 px-2 py-2 rounded-xl dark:bg-gray-700 dark:text-slate-50">
          {message.text}
          </div>)}
        </div>
      </div>
      )}
    </>
    
  )
}

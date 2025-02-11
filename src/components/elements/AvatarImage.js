import { useImageLoader } from '../../hooks/useImageLoader';

export const AvatarImage = ({src, w, h, rounded="-full", border=""}) => {
  const { imageLoaded, handleLoadImage } = useImageLoader();

  return (
    <>
      {!imageLoaded && <div className={`w-${w} h-${h} rounded${rounded} ${border} bg-gray-300 dark:bg-gray-600 animate-pulse`}></div>}
      <img 
        src={src} 
        alt="avatar" 
        className={`object-cover w-${w} h-${h} rounded${rounded} ${border} cursor-pointer ring-gray-50 dark:ring-gray-700 ${!imageLoaded ? "hidden" : ""}`}
        onLoad={handleLoadImage}
      />
    </>
  )
}

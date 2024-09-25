import React from 'react'
import { MdVideocam } from "react-icons/md";
import { MdVideocamOff } from 'react-icons/md';

const CamBox = ({ is_Selected ,idcam ,is_online}) => {
  return (
    <div  className={`border w-full h-16 flex transition-all duration-100 ease-in ${is_Selected ? 'bg-dPrimary  text-primaryC dark:text-dPrimary dark:bg-primaryC' : ''}`} onClick={()=>{
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('idcam', idcam);
      window.location.href = newUrl.href;
    }}>
        <div className="flex pl-3 ">
        {isNaN(idcam) || is_online ?<MdVideocam size={40} className="my-auto" /> :<MdVideocamOff size={40} className="my-auto" /> }
          
          <div className="my-auto mx-1 text-lg ">{!isNaN(idcam)?`cam${idcam}`: "ALL"}

          </div>
        </div>
    </div>
  )
}

export default CamBox
import React from "react";
import { Link } from "react-router-dom";
import useWebSocket from "react-use-websocket";

function Hero() {
  useWebSocket("ws://localhost:8765", {
    onMessage: (res) => {
      
      
      if(data.type == "feed"){
          const pic = `data:image/jpeg;base64,${data.pic}`;
          Notification.requestPermission().then((perm) => {
            if (perm === "granted") {
              new Notification("Unknown Person", {
                body: `new unkown person was detected by ${data.idcam}`,
                tag: data.idunknown,
                icon: pic,
              });
            }
          });
        
      }
    },
  });
  
  return (
    <div className="pt-52  flex items-center justify-center flex-col">
      <div className="relative w-full max-w-lg">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-100 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply  dark:mix-blend-lighten filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="m-8 relative space-y-4">
          <div className="text-center">
            <div className="pb-10">
              <h1 className="font-extrabold text-7xl">security systemapp</h1>
              <p className="pt-5">
                1337 Coding  School <br /> 
              </p>
            </div>
            <Link
              to="/LiveCams"
              className="pointer link link-underline link-underline-black py-2 px-5 bg-black text-white rounded-3xl pointer z-50 dark:bg-white dark:text-black"
            >
              Live Cameras
            </Link>
          </div>
        </div>
        <div></div>
      </div>
      <div className="mx-96 pt-48 pb-16 text-center xl:mx-0 xl:px-5 smm:px-10 smm:mx-0">
        <p>This app will be using Cameras and Deep Learning to detect uknown People that has the access in 1337 school</p>
      </div>
    </div>
  );
}

export default Hero;

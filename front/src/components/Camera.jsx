import React, { useRef, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

function Camera() {
  const canvasRef = useRef(null);

    const {sendMessage} =useWebSocket("ws://localhost:8765",{

      
      onOpen: () => {
        console.log('Connection start');
        sendMessage(JSON.stringify({ type: 'Watchstream' }));
      },
      
      onMessage : (msg) => {
        const data = JSON.parse(msg.data);
        
        if (data.type === 'watchStream') {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            const image = new Image();
            
            image.onload = () => {
            // Adjust the canvas size based on the image dimensions
            canvas.width = image.width;
            canvas.height = image.height;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          };
          
          image.src = `data:image/jpeg;base64,${data.pic}`;
        }
      } else if(data.type == "feed"){
        const pic = `data:image/jpeg;base64,${data.pic}`;
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification("Notification Title", {
              body: "Unknown Person",
              tag: data.idunknown,
              icon: pic,
            });
          }
        });
      
    }
    },
    
    onClose : () => {
      console.log('Connection closed');
      sendMessage(JSON.stringify({ type: 'Stopstream' }));
    },
    
    onError : (error) => {
      console.error('WebSocket Error:', error);
    }
  })
    


  return (
    <div className="flex md:flex-col w-full h-screen pt-15 overflow-hidden">
      <div className="relative flex-grow md:flex-grow-0 md:h-1/2 bg-gray-800">
        <canvas ref={canvasRef} className=" w-full h-full" />
      </div>
      <div className="flex w-2/5 md:w-full md:h-1/2 bg-gradient-to-br from-purple-300 via-red-300 to-pink-300">
        <div className="m-auto">
          <p className="font-extrabold text-7xl text-center">Real Time Camera Detection</p>
        </div>
      </div>
    </div>
  );
}

export default Camera;
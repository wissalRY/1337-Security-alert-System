import React, { useState, useEffect } from "react";
import Feed from "./feed";
import useWebSocket from "react-use-websocket";
import CamBox from "./CamBox";

const Unknownfaces = () => {
  const [msgs, setmsgs] = useState([]);
  const [idlastpic, setlastidpic] = useState(null);

  const [cams, setcams] = useState(() => {
    const savedCams = localStorage.getItem("cams");
    return savedCams ? JSON.parse(savedCams) : { online: [], offline: [] };
  });

  useEffect(() => {
    localStorage.setItem("cams", JSON.stringify(cams));
  }, [cams]);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (
        scrollTop + windowHeight >= documentHeight - 5 &&
        msgs.length % 5 === 0 &&
        msgs.length !== 0
      ) {
        const data = JSON.stringify({
          idcam: paramValue,
          type: "fetchData",
          idpic: idlastpic,
          date: msgs[msgs.length - 1].date,
        });
        sendMessage(data);
      } else {
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [msgs]);

  const urlParams = new URLSearchParams(window.location.search);
  const paramValue = parseInt(urlParams.get("idcam"));
  const { sendMessage } = useWebSocket("ws://localhost:8765", {
    onOpen: () => {
      console.log("WebSocket connection established.");
      const data = JSON.stringify({
        idcam: paramValue,
        type: "fetchData",
        idpic: idlastpic,
        date: null,
      });
      sendMessage(data);
    },
    onClose: () => {
      console.log("clossed");
    },
    onMessage: (res) => {
      const data = JSON.parse(res.data);
      if (data.type === "feed") {
        if (data.new) {
          setmsgs((prevMsgs) => [data, ...prevMsgs]);
          if (!isNaN(paramValue) && data.camid !== paramValue) {
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
        } else {
          setmsgs((prevMsgs) => [...prevMsgs, data]);
          setlastidpic(data.idpic);
        }
      } else if (data.type === "cams") {
        setcams(data);
      } else if (data.type === "updateFeed") {
        const result = msgs.find((msg) => msg.idpic == data.idpic);
        result.idgard = data.idgard;
        result.username = data.username;
        result.userpic = data.userpic;
      } else if (data.type === "reportSuccess") {
        setmsgs((prevMsgs) =>
          prevMsgs.filter((msg) => msg.idunknown !== data.idunknown)
        );
      } else if (data.type === "CheckedDone") {
        setmsgs(msgs.filter((msg) => msg.idunknown !== data.idunknown));
      }
    },
  });

  return (
    <div className=" w-full flex ">
      <div className="w-1/3 border-r-4 border-t-4 top-[90px] min-h-screen  border-gray-200 dark:border-gray-600">
        <CamBox is_Selected={isNaN(paramValue)} idcam={NaN} />

        {cams.online.map((idcam) => {
          return (
            <CamBox
            key={idcam}
            is_Selected={paramValue == idcam}
            idcam={idcam}
            is_online={1}
            />
          );
        })}



        {cams.offline.map((idcam) => {
          return (
            <CamBox
              key={idcam}
              is_Selected={paramValue == idcam}
              idcam={idcam}
              is_online={0}
            />
          );
        })}
      </div>
      <div className="w-full flex  h-full flex-col">
        {msgs.map((msg, index) => {
          if (msg.camid === paramValue || isNaN(paramValue)) {
            return <Feed key={index} sendMessage={sendMessage} msg={msg} />;
          }
        })}
      </div>
    </div>
  );
};

export default Unknownfaces;

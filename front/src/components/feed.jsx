import React,{useState} from "react";
import { MdVideoCameraFront } from "react-icons/md";

const Feed = ({ msg, sendMessage }) => {
  const [showModal, setShowModal] = useState(false);
  const [cin, setCin] = useState("");
  const [comment, setComment] = useState("");
  const idgard = localStorage.getItem("idgard");

  const date = msg.date.split("T");
  const pic = `data:image/jpeg;base64,${msg.pic}`;


  return (
    <div
      data-date={msg.date}
      data-idpic={msg.idpic}
      className="border w-[min(100%,400px)] mx-auto my-3 aspect-[1/1.01] shadow-lg rounded-md  "
    >
      <div className="flex justify-between pt-1 px-4  ">
        <div className="flex">
          <MdVideoCameraFront size={40} className=" my-auto" />
          <div className="my-auto mx-1 text-lg">cam{msg.camid}</div>
        </div>
        <div className="my-auto text-lg float-right">{msg.idunknown}</div>
      </div>

      <img src={pic} className=" w-full " alt=" Image" />
      <div className="flex justify-between   py-1 px-4">
        <div>{date[0]}</div>
        <div>{date[1].split(".")[0]}</div>
      </div>
      <div className="flex justify-around py-2">
        {msg.idgard != idgard ? (
          <div className="relative">
            {msg.idgard != null ? (
              <div
                title={msg.username}
                className=" rounded-full absolute border-2 border-current overflow-hidden aspect-square w-12 transform -translate-y-1  bg-slate-600 -left-14 "
              >
                <img
                  src={`data:image/jpeg;base64,${msg.userpic}`}
                  alt={msg.username}
                ></img>
              </div>
            ) : (
              ""
            )}
            <button
              className="bg-green-500 text-white px-3 py-1 rounded-md disabled:bg-transparent disabled:text-current disabled:border-current disabled:border-4 box-border "
              onClick={() => {
                const data = JSON.stringify({
                  type: "volunteerToCheck",
                  idpic: msg.idpic,
                  idgard: idgard,
                  idunknown: msg.idunknown,
                });
                sendMessage(data);
              }}
              disabled={msg.idgard != null}
            >
              Volunteer
            </button>
          </div>
        ) : (
          <div className="animate-getbig">
            <button
              className="bg-blue-500 text-white px-3 mr-1 mb-1 py-1 rounded-md"
              onClick={() => {

                setShowModal(true)
              }}
            >
              Report
            </button>
            <button
              className="bg-green-500 text-white m-1 px-3 py-1 rounded-md"
              onClick={() => {
                const data = JSON.stringify({
                  type: "Checked",
                  idunknown: msg.idunknown,
                  idgard: idgard,
                });
                sendMessage(data);
              }}
            >
              Checked
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded-md"
              onClick={() => {
                const data = JSON.stringify({
                  type: "cancelVolunteer",
                  idpic: msg.idpic,
                });
                sendMessage(data);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white dark:bg-black dark:border p-6 rounded-md w-1/3">
            <h2 className="text-lg font-semibold mb-4">Report Details</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = JSON.stringify({
                  type: "report",
                  idunknown: msg.idunknown,
                  cin: cin,
                  comment: comment,
                });
                sendMessage(data);
                setShowModal(false);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">CIN</label>
                <input
                  type="text"
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  className="border border-gray-300 bg-transparent rounded-md p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="border border-gray-300 bg-transparent rounded-md p-2 w-full"
                  rows="4"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                onClick={()=>{setShowModal(false)}}
                  type="button"
                  className="text-blue-500 dark:text-indigo-500 font-bold border border-blue-500 dark:border-indigo-500 text-  px-3 py-1 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 dark:bg-indigo-500 font-bold text-white px-3 py-1 rounded-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;

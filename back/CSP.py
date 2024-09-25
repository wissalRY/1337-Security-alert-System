import base64
import cv2
import numpy as np
import asyncio
import websockets
import json
from db import DB
from model import Model


CONNECTIONS = set()
idcams = [0]
watchstream  = set()
db = DB()
model = Model()
async def onConnect(websocket:websockets.WebSocketClientProtocol):
    if websocket not in CONNECTIONS:
        CONNECTIONS.add(websocket)
    oldcams =db.getCams()
    mask = ~np.isin(oldcams,idcams)
    oldcams = oldcams[mask]
    data = {"type":"cams","offline":oldcams.tolist(),"online":idcams}
    await websocket.send(json.dumps(data))

    try:    
        async for message in websocket:
            data = json.loads(message)
            if(data.get("type")=="fetchData"):
                for msg in db.getallunkown(data):
                    await websocket.send(msg)
            elif(data.get("type")=="volunteerToCheck"):
                is_ok,msgs = db.Volunteer(data)
                if is_ok:
                    for msg in msgs:
                        websockets.broadcast(CONNECTIONS,msg)
                else:
                    await websocket.send(msg)
            elif(data.get("type")=="cancelVolunteer"):
                msg =db.cancelVolenteer(data)
                websockets.broadcast(CONNECTIONS,msg)
            elif data.get("type") == "auth":
                response = db.authenticate_user(data)
                await websocket.send(response)
            elif data.get("type") == "report":
                result = db.addReport(data)
                websockets.broadcast(CONNECTIONS, result)
            elif data.get("type") == "Checked":
                response_message = db.deleteUnkown(data)             
                websockets.broadcast(CONNECTIONS, response_message)
            elif data.get("type") == "Watchstream":
                watchstream.add(websocket)
            elif data.get("type") == "Stopstream":
                if websocket in watchstream:
                    watchstream.remove(websocket)
            elif data.get("type") == "addUser":
                name = data.get("name")
                cin = data.get("cin")
                picture = data.get("picture")
                email = data.get("email")
                isGuard = data.get("isGuard")

                password = data.get("password")
                isAdmin = data.get("isAdmin")

               
                
                img_data = base64.b64decode(picture)
                np_array = np.frombuffer(img_data, np.uint8)
                frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
                _, face, emb = model.getEmbeddings(frame)
                emb = emb.squeeze()
                if len(emb) == 0:
                    await websocket.send(json.dumps({"type":"addUserResponse","message":"Couldn't detect any face","success":False}))
                else:
                    response_message = {"type": "addUserResponse","success":True,"message":"Added Successfully"}
                    if isGuard:
                        user_id,guard_id = db.addgard(cin, email, password, name, face, emb, isAdmin)
                        response_message["idgard"] = guard_id
                    else:
                        user_id = db.adduser(name, cin, face, emb)

                    response_message["iduser"] = user_id

                    
                    await websocket.send(json.dumps(response_message))
                
    except websockets.ConnectionClosedError :
        print(f"user {websocket.id} connection Closed")
        if websocket in CONNECTIONS:
            CONNECTIONS.remove(websocket)
    except websockets.ConnectionClosed:
        print(f"user {websocket.id} disconnected")
        if websocket in CONNECTIONS:
            CONNECTIONS.remove(websocket)
    finally:
        if websocket in watchstream:
            watchstream.remove(websocket)
            print("wbsocket removed from finally")


async def  camScript(idcam):
    cam = cv2.VideoCapture(idcam) 
    print(f"Setup cam{idcam}")
    EmbeddingUsers = model.makeTensor(db.getUsersEmbeddings())
    try:
        while True:
            await asyncio.sleep(0.01)
            _,img = cam.read()
            Pic,faces,Embeddings = model.getEmbeddings(img)
            
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
            _, liveFrame = cv2.imencode('.jpg', np.squeeze(Pic), encode_param)
            live_base64 = base64.b64encode(liveFrame).decode('utf-8')
            data = {"type":"watchStream","idCam":idcam,"pic":live_base64}
            websockets.broadcast(watchstream,json.dumps(data))

            mindistances,_ = model.minListEmbedding(model.compareEmbeddingsMainListToList(Embeddings,EmbeddingUsers))
            unsimularity_filter = mindistances > 100
            faces= faces[unsimularity_filter]
            Embeddings = Embeddings[unsimularity_filter]
            if len(Embeddings) == 0:
                continue
            ids,UnkownEmbs,is_olds = db.getUnkownUnique()
            if(len(UnkownEmbs) == 0 ):
                for face,emb in zip(faces,Embeddings):
                    faceNumpy=(face.permute(1, 2, 0).cpu().numpy()*255).astype(np.uint8)
                    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]

                    faceNumpy =cv2.resize(faceNumpy,(112,112))
                    _, frame_encoded = cv2.imencode('.jpg', faceNumpy, encode_param)

                    idpic,id,date = db.addUnkown(frame_encoded,idcam,None,emb)
                    frame_base64 = base64.b64encode(frame_encoded).decode('utf-8')
                    data = {"idunknown":id,"type":"feed","pic":frame_base64,"idpic":idpic,"camid":idcam,"date":date.isoformat(),"new":1}
                    websockets.broadcast(CONNECTIONS,json.dumps(data))
                    print("added new one : ",id)
                
                continue
            
            
            UnkownEmbs = model.makeTensor(UnkownEmbs)
            mindistances,indexs = model.minListEmbedding(model.compareEmbeddingsMainListToList(Embeddings,UnkownEmbs))
            ids = ids[indexs]
            is_olds = is_olds[indexs]
            simularity_filter = mindistances < 100
            ids =np.where(simularity_filter,ids,None)
            is_olds = np.where(simularity_filter,is_olds,True)
            faces,Embeddings,ids= faces[is_olds],Embeddings[is_olds],ids[is_olds]
            for face,emb,id in zip(faces,Embeddings,ids):
                faceNumpy =(face.permute(1, 2, 0).cpu().numpy()*255).astype(np.uint8)
                faceNumpy =cv2.resize(faceNumpy,(112,112))
                encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 70]
                _, frame_encoded = cv2.imencode('.jpg', faceNumpy, encode_param)
                frame_base64 = base64.b64encode(frame_encoded).decode('utf-8')
                idpic,id,date = db.addUnkown(frame_encoded,idcam,id,emb)
                data = {"idunknown":id,"pic":frame_base64,"type":"feed","idpic":idpic,"camid":idcam,"date":date.isoformat(),"new":1}
                websockets.broadcast(CONNECTIONS,json.dumps(data))
                print("added new one : ",id)

                




    except Exception as e:
        print(f"error with camera{idcam} :{e}")
        cam.release()
        idcams.remove(idcam)
        oldcams =db.getCams()
        mask = ~np.isin(oldcams,idcams)
        oldcams = oldcams[mask]
        data = {"type":"cams","offline":oldcams.tolist(),"online":idcams}
        websockets.broadcast(CONNECTIONS,json.dumps(data))






async def main():
    for id in idcams:
        asyncio.create_task(camScript(id))
    async with websockets.serve(onConnect, "localhost", 8765):
        print("Started")

        await asyncio.Future()  
    
asyncio.run(main())
        



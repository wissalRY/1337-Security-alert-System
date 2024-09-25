import base64
from datetime import datetime
import cv2
import mysql.connector
import numpy as np
import json
def readcvimg(img):
    img = np.array(img,np.bytes_)
    img =np.frombuffer(img, np.uint8)
    return img


class DB :
    def db():
        host = 'localhost'
        database = 'camdb'
        user = 'root'
        password = ''
        conn = mysql.connector.connect(
            host=host,
            database=database,
            user=user,
            password=password
        )
        return conn
    
    conn = db()
    cur = conn.cursor()

    def addUnkown(self,frame,idcam,iduser,emb):
        if iduser == None:
            self.cur.execute("insert into imposters values()",)
            iduser = self.cur.lastrowid
        iduser = int(iduser)
        embtext  = json.dumps(emb.squeeze().tolist())
        self.cur.execute("insert into imposterpics(idImposter,Pic,idcam,Embedding) VALUES(%s,%s,%s,%s)",(iduser,frame.tobytes(),idcam,embtext))
        idpic =self.cur.lastrowid

        self.commit()
        return idpic,iduser,datetime.now()
    def addReport(self, data):
        cin = data["cin"]
        idunknown = data["idunknown"]
        comment = data["comment"]
        try:
            self.cur.execute("""
                INSERT INTO reports (CIN, commentaire, idImposter) 
                VALUES (%s, %s, %s)
            """, (cin, comment, idunknown))
            self.commit()
            return json.dumps({"type": "reportSuccess", "idunknown": idunknown})
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            return {"type": "CheckedDone", "idunknown": idunknown}
    def getCams(self):
        self.cur.execute("SELECT DISTINCT idcam FROM imposterpics;")
        rows = self.cur.fetchall()
        if len(rows) == 0:
            return np.empty(0)
        rows = np.array(rows,np.int_)[:,0]
        return rows
    def getUsersEmbeddings(self):
        self.cur.execute("SELECT Embedding FROM users ; ")
        return [json.loads(embedding[0]) for embedding in self.cur.fetchall()]
    def adduser(self,name,cin,frame,emb):
        
        embtext=json.dumps(emb.tolist())
        frame =(frame.squeeze().permute(1, 2, 0).cpu().numpy()*255).astype(np.uint8)
        frame =cv2.resize(frame,(112,112))
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
        _, frame_encoded = cv2.imencode('.jpg', frame, encode_param)

        self.cur.execute("insert into users(name,cin,picture,Embedding) VALUES(%s,%s,%s,%s)",(name,cin,frame_encoded.tobytes(),embtext))
        self.commit()
        
        return self.cur.lastrowid
    def addgard(self,cin,email,password,name,frame,emb,isAdmin):
        iduser = self.adduser(name,cin,frame,emb)

        
        self.cur.execute("insert into gards(Email,Password,iduser,isAdmin) VALUES(%s,%s,%s,%s)",(email,password,iduser,isAdmin))
        self.commit()

        return iduser,self.cur.lastrowid

    def getallunkown(self,data):
        idcam,idpic,date =data["idcam"],data["idpic"],data["date"]
        sqlcode = """ SELECT idImposter, Pic, date, idcam, idgard, idimage
                 FROM imposterpics
                 WHERE idImposter NOT IN (SELECT idImposter FROM reports) """
        inputs = []
        if idcam != None:
            sqlcode += " AND idcam = %s "
            inputs.append(idcam)
        if date != None:
            sqlcode += " AND date <= %s AND idimage != %s "
            inputs.extend([datetime.fromisoformat(date),idpic])
            
        sqlcode+=" ORDER BY date DESC LIMIT 5;"
        self.cur.execute(sqlcode,tuple(inputs))
        
        unknowns  =np.array(self.cur.fetchall())
        for id,img,date,idcam,idgard,idimage in unknowns:

                img = readcvimg(img)
                frame_base64 = base64.b64encode(img).decode('utf-8')
                data = {"type":"feed","idunknown":id,"idpic":idimage,"camid":idcam,"idgard":idgard,"pic":frame_base64,"date":date.isoformat(),"new":0}
                if (idgard != None):
                    self.cur.execute("SELECT u.name,u.picture FROM gards AS g  JOIN users as u ON u.iduser =g.Iduser WHERE g.idgard=%s;",(idgard,))
                    name,picgard = self.cur.fetchone()
                    
                    picgard= readcvimg(picgard)
                    frame_base64 = base64.b64encode(picgard).decode('utf-8')
                    data["username"] = name
                    data["userpic"] = frame_base64
                    
                yield json.dumps(data)
                
    def deleteUnkown(self, data):
        idunknown = data["idunknown"]
        idgard = data["idgard"]
            
        query = """
        DELETE FROM  imposters
        WHERE idImposter = %s
        """
        self.cur.execute(query, (idunknown,))
        

    
        self.conn.commit()
        
        self.incrementImposters(idgard)
        return  json.dumps({"type": "CheckedDone", "idunknown": idunknown})          
        
        
    def incrementImposters(self, idgard):
     try:
        query = "UPDATE gards SET numberImposters = numberImposters + 1 WHERE idGard = %s"
        self.cur.execute(query, (idgard,))
        self.conn.commit()
        
     except mysql.connector.Error as err:
        print(f"Error: {err}")
    def Volunteer(self,msg):
        idgard,idpic = (msg["idgard"],msg["idpic"])
        self.cur.execute("SELECT idgard FROM imposterpics WHERE idimage = %s",(idpic,))
        res = self.cur.fetchone()
        if(res[0] !=None):
            return False,json.dumps({"type":"error","idpic":idpic})
        response = []
        self.cur.execute("SELECT idimage FROM imposterpics WHERE idgard = %s AND idImposter NOT IN (SELECT idImposter FROM reports) ;",(idgard,))
        idrows =self.cur.fetchall()
        for idrow in idrows:
            response.append(self.cancelVolenteer({"idpic":idrow[0]}))

        self.cur.execute("SELECT g.idgard, u.name, u.picture FROM gards AS g JOIN users AS u ON u.iduser = g.iduser WHERE g.idgard = %s;",(idgard,))
        _,name,picgard = self.cur.fetchone()
        self.cur.execute("Update imposterpics SET idgard = %s WHERE idimage = %s ",(idgard,idpic))
        self.commit()
        
        picgard= readcvimg(picgard)
        frame_base64 = base64.b64encode(picgard).decode('utf-8')

        res = json.dumps({"type":"updateFeed","idpic":idpic,"idgard":idgard,"userpic":frame_base64,"username":name})
        response.append(res)

        return True,response
    def authenticate_user(self, data):
        email = data["email"]
        password = data["password"]        
        
        self.cur.execute('SELECT idGard, password, isAdmin FROM gards WHERE email = %s', (email,))
        user = self.cur.fetchone()
        
        if user is None:
            return json.dumps({"type": "authResponse", "success": False, "message": 'Invalid credentials'})

        stored_password = user[1] 
        if password == stored_password:
            return json.dumps({"type": "authResponse", "success": True, "message": 'Login successful', "idgard": user[0], "isAdmin": user[2] })  
        else:
            return json.dumps({"type": "authResponse", "success": False, "message": 'Invalid credentials'})
    def cancelVolenteer(self,data):
        idpic =data["idpic"]
        self.cur.execute("Update imposterpics SET idgard = NULL WHERE idimage = %s ",(idpic,))
        self.commit()

        res = {"type":"updateFeed","idpic":idpic,"idgard":None}
        return json.dumps(res)
    def getUnkownUnique(self):
        self.cur.execute("SELECT idImposter, Embedding,TIMESTAMPDIFF(MINUTE, max(date), NOW()) >= 5 FROM imposterpics  GROUP BY idImposter ; ")
        unknown =np.array(self.cur.fetchall())

        if (len(unknown) != 0):
            ids,Embs,olds = np.hsplit(unknown,unknown.shape[1])
            ids = np.array(ids,dtype=np.uint)[:,0]
            is_olds = np.array(olds,dtype=bool)[:,0]
            Embs = [json.loads(embedding[0]) for embedding in Embs]

        else :
            ids,Embs,is_olds = np.empty((3,0))
        return ids,Embs,is_olds
    

    
    
    def commit(self):
        self.conn.commit()
    def close(self):
        self.conn.close()



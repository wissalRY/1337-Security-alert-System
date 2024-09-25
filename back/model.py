
from ModelsArchitecture.facenetmobile import FaceRecognition
import torch
from torchvision import transforms



import pathlib
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath


class Model():

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    yolo =  torch.hub.load('ultralytics/yolov5', 'custom', path='models/Yolo.pt',force_reload=True,trust_repo=True)
    faceRecogniser = FaceRecognition().to(device).eval()
    faceRecogniser.load_state_dict(torch.load("models/faceRec.pt",map_location=device))
    def __init__(self):
        
        self.image_size = 112
        self.transormImageRecogniser = transforms.Compose([
                    transforms.Resize((self.image_size,self.image_size)),
                    transforms.ToTensor(),  
                ])
        
    def getEmbeddings(self,img,threshhold = 0.85,mindimensionBox = 40) ->torch.Tensor:
        results =self.yolo(img)
        PILimage = transforms.ToPILImage()(img)
        xyxy = results.xyxy[0]
        mask = (
    (xyxy[:, 4] > threshhold) &
    ((xyxy[:, 2]-xyxy[:, 0])*(xyxy[:, 3]-xyxy[:, 1])>mindimensionBox**2)
    )
        xyxy = xyxy[mask]
        batch_size = len(xyxy)

        batch = torch.zeros((batch_size, 3, self.image_size, self.image_size),device=self.device)
        for index,result in enumerate(xyxy):
            face = PILimage.crop((int(result[0]),int(result[1]),int(result[2]),int(result[3])))
            face =self.transormImageRecogniser(face)
            batch[index] = face
        Embeddings = self.faceRecogniser(batch)
        Embeddings= Embeddings.squeeze()
        if Embeddings.dim() == 1:
            Embeddings =Embeddings.unsqueeze(0)
        return   results.render(),batch,Embeddings
    def compareEmbeddingsPicToList(self,Embedding,EmbeddingList):
        if Embedding.dim() == 1:
            Embedding = Embedding.unsqueeze(0)

        if EmbeddingList.dim() == 1:
            EmbeddingList = EmbeddingList.unsqueeze(0)
        
        return torch.sqrt(torch.pow(Embedding-EmbeddingList,2.).sum(axis=1))
    
    def compareEmbeddingsMainListToList(self,MainListEmbedding,ListEmbedding):
        res = torch.empty((len(MainListEmbedding),len(ListEmbedding)))
        for index,emb in enumerate(MainListEmbedding):
            res[index] =self.compareEmbeddingsPicToList(emb,ListEmbedding)
        return res
    def minListEmbedding(self,ListEmbedding):
        return torch.min(ListEmbedding,dim=1)
    def prepareIdsUnknows(self,condition,ids):
        return torch.where(condition,ids,torch.nan)
    def makeTensor(self,List):
        tensor = torch.Tensor(List).squeeze().to(self.device)
        if tensor.dim() == 1:
            tensor =tensor.unsqueeze(0)
        return tensor
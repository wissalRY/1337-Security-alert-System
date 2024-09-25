from facenetMobile.facenetmobile import FaceRecognition
import torch
import pathlib
import cv2
import numpy as np
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath
from model import Model
model = Model()
import cv2
import torch

# Load YOLOv5 yolo

# Open the video capture
cap = cv2.VideoCapture(0)  # Use 0 for webcam or provide the video file path
ret, frame = cap.read()
originalembedding = model.getEmbeddings(frame)[1].unsqueeze(0)
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Perform inference
    img,emb = model.getEmbeddings(frame)
    if emb.shape[0] == 0:
        continue
    print(model.compareEmbeddings(emb,originalembedding))
    cv2.imshow("how",np.squeeze(img))
    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

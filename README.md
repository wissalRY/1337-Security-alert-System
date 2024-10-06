# Real-time monitoring system to detect and claim unauthorized persons
## About the system
This project implements a real-time surveillance system leveraging AI for enhanced security and monitoring. It integrates YOLO object detection for identifying individuals and MobileFaceNet for facial recognition. The system sends alerts upon detecting unauthorized individuals, enhancing safety and efficiency in surveillance operations.

Key Features:

- **Real-Time Monitoring**:  The system provides live camera feeds, allowing users to monitor various areas in real time through a web-based interface.

- **Face Detection and Recognition:** Using YOLO for object detection and MobileFaceNet for face recognition, the system can accurately detect and recognize faces.

- **Unauthorized Person Detection:** If an unknown or unauthorized individual is detected, the system automatically triggers an alert and sends notifications to designated users.
- **User Management:** Administrators can add, update, or remove authorized individuals from the system’s database, making it adaptable to different environments.

  ## Technologies Used

- **Python**: Backend processing and handling of camera feeds.
- **ReactJS**: Frontend development for creating an interactive web-based interface.
- **YOLO**: Object detection model used for real-time identification of individuals.
- **MobileFaceNet**: Facial recognition model for efficient identification of authorized and unauthorized individuals.
- **WebSocket**: Enables real-time communication between the frontend and backend.
## Getting started
1. Clone the repository:bach git clone https://github.com/wissalRY/1337-alert-System.git
2. Install dependencies:
   
   **Backend (Python)**:
   ```
   cd back
   pip install -r requirments.txt
   ```
   To run the main file, use the following command:
    ```
   python CSP.py

 **FrontEnd (ReactJs)**:
   ```
   cd front
   npm install
  ```
  To run the application:
  ```
  npm run dev
  ```

## Project Screenshot 
<img src="https://github.com/user-attachments/assets/dc24d8a3-3e30-4373-be3f-7f7d94c0aff2">
   

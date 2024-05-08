# Chat Application

Welcome to my Chat Application! This project is a full-fledged messaging application with a user interface 
inspired by WhatsApp. It enables users to exchange messages individually or within groups.

## Features

- **Realtime Messaging:** Experience seamless, real-time messaging with instant message delivery.
- **Individual Messaging:** Send private messages to other users.
- **Group Messaging:** Create groups to communicate with more than one user.
- **Login And Signup:** Securely access the application with a login and signup system.

## Technologies

- **Frontend:** Typescript with React
- **Backend:** Java with Spring Boot, Spring Security, Spring Websocket and Spring Data JPA
- **Database:** PostgreSQL / H2
- **Authentication:** JSON Web Token (JWT)
- **State Management:** Redux, Thunk
- **Component Library:** Material UI

## Getting Started

1. **Clone the repository:**  
    ```bash  
    git clone https://github.com/nicolasjusten95/chat-app.git
    ```
   
2. **Navigate to the Frontend and install the required dependencies:**  
    ```bash
    cd frontend
    npm install
    ```
   
3. **Navigate to the Backend and install the required dependencies:**  
    ```bash
    cd backend
    mvn clean install
    ```
   
4. **Configure Environment Variables:**
   Configure Spring Boot application.properties for database and other configurations.

5. **Run the Application:**
    - Start the frontend:
      ```bash
      npm start
      ```
    - Start the backend:
      ```bash
      mvn spring-boot:run
      ```
6. **Access the Application:**
   - Open your browser and visit [http://localhost:3000](http://localhost:3000) to use the Realtime Chat Application.
   - You can log in with the sample user:
     - email: luke.skywalker@test.com
     - password: luke
   - Or you can create your own Accounts and start chatting!

## Images

![image Screenshot](./images/homepage.png)
View your chats with other users.

![image Screenshot](./images/send_messages.png)
Send messages to other users.

![image Screenshot](./images/signin.png)
Log into your account.

![image Screenshot](./images/signup.png)
Create a new account.

![image Screenshot](./images/start_new_group_chat.png)
Start a new chat.

![image Screenshot](./images/edit_group_chat.png)
Edit your chats.

## Contribution Guidelines

We welcome contributions! If you have ideas for improvements or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

Thank you for using and contributing to the Realtime Chat Application!

 

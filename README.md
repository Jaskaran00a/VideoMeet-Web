# VideoMeet - WebRTC Video Calling Application

A full-featured video calling web application built with the MERN stack (MongoDB, Express, React, Node.js) and WebRTC for real-time communication.

## Features

- Create and join video call meetings
- Real-time chat during video calls
- Audio/video toggle controls
- Screen sharing capability
- Schedule future meetings
- Password-protected meetings

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository or download the source code

2. Install server dependencies:
```
npm install
```

3. Install client dependencies:
```
npm run install-client
```

4. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/video-calling-app
JWT_SECRET=your_jwt_secret_key
```

## Running the Application

1. Run the full application (both client and server):
```
npm run dev
```

2. Run only the server:
```
npm run server
```

3. Run only the client:
```
npm run client
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Create a new meeting or join an existing one using a meeting ID
3. Allow camera and microphone permissions when prompted
4. Use the controls at the bottom to toggle audio/video, share screen, or leave the meeting
5. Use the chat panel on the right to communicate with other participants

## Technologies Used

- **Frontend**: React, Socket.io-client, PeerJS, React Router
- **Backend**: Node.js, Express, Socket.io, MongoDB
- **Real-time Communication**: WebRTC, PeerJS
- **Authentication**: JWT, bcrypt

## Project Structure

- `/client` - React frontend application
- `/server` - Node.js backend API and WebRTC signaling server
- `/server/models` - MongoDB data models
- `/server/config` - Configuration files

## Deployment

For production deployment:

1. Build the React client:
```
npm run build
```

2. Set the environment variable `NODE_ENV=production`

3. Deploy to your preferred hosting service (Heroku, Vercel, AWS, etc.)

## License

MIT
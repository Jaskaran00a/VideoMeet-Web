import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'peerjs';
import { v4 as uuidv4 } from 'uuid';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaComments, FaPhoneSlash } from 'react-icons/fa';

const Room = () => {
  const { roomId } = useParams();
  const [myStream, setMyStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [userId] = useState(uuidv4());
  
  const socketRef = useRef();
  const myVideoRef = useRef();
  const peersRef = useRef({});
  const myPeerRef = useRef();
  const messagesEndRef = useRef();

  // Initialize socket and peer connection
  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    myPeerRef.current = new Peer(userId, {
      host: 'localhost',
      port: 5000,
      path: '/peerjs'
    });

    // Get user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setMyStream(stream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

        // Join room
        socketRef.current.emit('join-room', roomId, userId);

        // Handle new user connection
        socketRef.current.on('user-connected', (newUserId) => {
          connectToNewUser(newUserId, stream);
        });

        // Handle user disconnection
        socketRef.current.on('user-disconnected', (userId) => {
          if (peersRef.current[userId]) {
            peersRef.current[userId].close();
            const newPeers = { ...peers };
            delete newPeers[userId];
            setPeers(newPeers);
          }
        });

        // Handle incoming call
        myPeerRef.current.on('call', call => {
          call.answer(stream);
          
          call.on('stream', userVideoStream => {
            peersRef.current[call.peer] = call;
            setPeers(prevPeers => ({
              ...prevPeers,
              [call.peer]: userVideoStream
            }));
          });
        });

        // Handle chat messages
        socketRef.current.on('receive-message', message => {
          setMessages(prevMessages => [...prevMessages, message]);
        });
      })
      .catch(err => {
        console.error('Failed to get local stream', err);
      });

    return () => {
      // Cleanup
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (myPeerRef.current) {
        myPeerRef.current.destroy();
      }
    };
  }, [roomId, userId]);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Connect to a new user
  const connectToNewUser = (userId, stream) => {
    const call = myPeerRef.current.call(userId, stream);
    
    call.on('stream', userVideoStream => {
      peersRef.current[userId] = call;
      setPeers(prevPeers => ({
        ...prevPeers,
        [userId]: userVideoStream
      }));
    });

    call.on('close', () => {
      const newPeers = { ...peers };
      delete newPeers[userId];
      setPeers(newPeers);
    });
  };

  // Toggle audio
  const toggleAudio = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (myStream) {
      myStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // Share screen
  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true 
      });
      
      // Replace video track with screen track
      const videoTrack = screenStream.getVideoTracks()[0];
      
      const senders = myPeerRef.current.getSenders();
      const sender = senders.find(s => s.track.kind === 'video');
      
      if (sender) {
        sender.replaceTrack(videoTrack);
      }
      
      // When screen sharing stops
      videoTrack.onended = () => {
        const userVideoTrack = myStream.getVideoTracks()[0];
        const senders = myPeerRef.current.getSenders();
        const sender = senders.find(s => s.track.kind === 'video');
        
        if (sender) {
          sender.replaceTrack(userVideoTrack);
        }
      };
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  };

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && socketRef.current) {
      const message = {
        id: uuidv4(),
        userId,
        text: messageInput,
        timestamp: new Date().toISOString(),
        isSelf: true
      };
      
      socketRef.current.emit('send-message', {
        ...message,
        isSelf: false
      }, roomId);
      
      setMessages(prevMessages => [...prevMessages, message]);
      setMessageInput('');
    }
  };

  // Leave meeting
  const leaveMeeting = () => {
    window.location.href = '/';
  };

  return (
    <div>
      <h2>Meeting: {roomId}</h2>
      
      <div className="room-container">
        <div className="video-container">
          <div className="video-item">
            <video ref={myVideoRef} muted autoPlay playsInline />
            <div className="user-name">You</div>
          </div>
          
          {Object.entries(peers).map(([peerId, stream]) => (
            <div key={peerId} className="video-item">
              <video
                autoPlay
                playsInline
                ref={video => {
                  if (video && stream) video.srcObject = stream;
                }}
              />
              <div className="user-name">Participant</div>
            </div>
          ))}
        </div>
        
        <div className="chat-container">
          <div className="chat-header">
            <h3>Chat</h3>
          </div>
          
          <div className="chat-messages">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.isSelf ? 'sent' : 'received'}`}
              >
                <div className="sender">
                  {message.isSelf ? 'You' : 'Participant'}
                </div>
                <div>{message.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chat-input" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Send</button>
          </form>
        </div>
      </div>
      
      <div className="controls">
        <div className="control-btn" onClick={toggleAudio}>
          <div className={`icon ${isMuted ? 'active' : ''}`}>
            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </div>
          <div className="text">{isMuted ? 'Unmute' : 'Mute'}</div>
        </div>
        
        <div className="control-btn" onClick={toggleVideo}>
          <div className={`icon ${isVideoOff ? 'active' : ''}`}>
            {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
          </div>
          <div className="text">{isVideoOff ? 'Start Video' : 'Stop Video'}</div>
        </div>
        
        <div className="control-btn" onClick={shareScreen}>
          <div className="icon">
            <FaDesktop />
          </div>
          <div className="text">Share Screen</div>
        </div>
        
        <div className="control-btn" onClick={leaveMeeting}>
          <div className="icon" style={{ backgroundColor: '#e74c3c' }}>
            <FaPhoneSlash style={{ color: 'white' }} />
          </div>
          <div className="text">Leave</div>
        </div>
      </div>
    </div>
  );
};

export default Room;
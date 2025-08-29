import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
  useCall,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { PhoneOff, Mic, MicOff, Video, VideoOff, MoreVertical, MessageSquare, ArrowLeft } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [searchParams] = useSearchParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [otherUserId, setOtherUserId] = useState(null);
  const navigate = useNavigate();

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData.token || !authUser || !callId) return;

      try {
        console.log("Initializing Stream video client...");

        // First, try to get otherUserId from URL params
        const targetUserIdFromUrl = searchParams.get('targetUserId');
        console.log("Target user ID from URL:", targetUserIdFromUrl);
        
        if (targetUserIdFromUrl && targetUserIdFromUrl !== authUser._id) {
          setOtherUserId(targetUserIdFromUrl);
          console.log("Other user ID set from URL params:", targetUserIdFromUrl);
        }

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser?.profilePic || '/default-avatar.png',
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        console.log("Joined call successfully");
        console.log("Full call ID received:", callId);
        
        // If otherUserId is not set from URL params, try to extract from call ID
        if (!otherUserId) {
          console.log("Trying to extract otherUserId from call ID...");
          
          // Extract other user ID from call ID (format: userId1-userId2)
          const callParts = callId.split('-');
          console.log("Call ID parts after split:", callParts);
          console.log("Current user ID:", authUser._id);
          
          if (callParts.length >= 2) {
            // Find the user ID that is not the current user
            const otherUser = callParts.find(id => id !== authUser._id);
            console.log("Found other user:", otherUser);
            if (otherUser) {
              setOtherUserId(otherUser);
              console.log("Other user ID set successfully from call ID:", otherUser);
            } else {
              console.log("Could not find other user in call parts");
            }
          } else {
            console.log("Call ID format not recognized, trying with underscore");
            // Fallback: try with underscore separator
            const underscoreParts = callId.split('_');
            if (underscoreParts.length >= 2) {
              const otherUser = underscoreParts.find(id => id !== authUser._id);
              if (otherUser) {
                setOtherUserId(otherUser);
                console.log("Other user ID set from underscore format:", otherUser);
              }
            }
          }
        } else {
          console.log("Other user ID already set from URL params:", otherUserId);
        }

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, authUser, callId, searchParams]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen w-full whatsapp-gradient-bg relative overflow-hidden">
      {/* Mobile WhatsApp-like header */}
      <div className="absolute top-0 left-0 right-0 z-20 mobile-call-header">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                if (otherUserId) {
                  navigate(`/chat/${otherUserId}`);
                } else {
                  navigate("/");
                }
              }}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors touch-manipulation"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="flex items-center space-x-3">
              <img 
                src={authUser?.profilePic || '/default-avatar.png'} 
                alt="Profile"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-green-300"
              />
              <div className="flex-1">
                <p className="font-semibold text-base sm:text-lg leading-tight">
                  {authUser?.fullName || 'Unknown User'}
                </p>
                <p className="text-xs sm:text-sm text-green-200 leading-tight">
                  Video calling...
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors touch-manipulation">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors touch-manipulation">
              <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main video content */}
      <div className="w-full h-full">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <WhatsAppCallContent authUser={authUser} otherUserId={otherUserId} />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full px-4">
            <div className="text-center text-white">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
                <Video className="w-12 h-12 sm:w-16 sm:h-16" />
              </div>
              <p className="text-lg sm:text-xl font-semibold mb-2">Could not connect</p>
              <p className="text-sm sm:text-base text-green-200">Please refresh or try again later.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WhatsAppCallContent = ({ authUser, otherUserId }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const call = useCall();
  
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState(null);

  const navigate = useNavigate();

  // Sync with actual call state
  useEffect(() => {
    if (call) {
      // Get initial states
      try {
        setIsMicEnabled(call.microphone?.isEnabled ?? true);
        setIsCameraEnabled(call.camera?.isEnabled ?? true);
      } catch (error) {
        console.log("Error getting initial call state:", error);
      }
    }
  }, [call]);

  // Handle call timer
  useEffect(() => {
    if (callingState === CallingState.JOINED && !callStartTime) {
      setCallStartTime(new Date());
    }
  }, [callingState, callStartTime]);

  // Listen for call events (participant left, call ended, etc.)
  useEffect(() => {
    if (!call) return;

    const handleCallEnded = () => {
      console.log("Call ended by another participant");
      console.log("Other user ID for navigation:", otherUserId);
      toast("Call ended by the other participant", { icon: 'ℹ️' });
      setIsProcessing(false);
      // Navigate to chat page if we have other user ID, otherwise go to home
      if (otherUserId) {
        console.log("Navigating to chat page:", `/chat/${otherUserId}`);
        navigate(`/chat/${otherUserId}`);
      } else {
        console.log("No other user ID found, navigating to home");
        navigate("/");
      }
    };

    const handleParticipantLeft = (event) => {
      console.log("Participant left:", event);
      if (event.participants && event.participants.length === 0) {
        toast("Other participant left the call", { icon: 'ℹ️' });
        setTimeout(() => {
          if (otherUserId) {
            navigate(`/chat/${otherUserId}`);
          } else {
            navigate("/");
          }
        }, 2000); // Give 2 seconds delay before redirecting
      }
    };

    const handleCallDisconnected = () => {
      console.log("Call disconnected");
      toast.error("Call disconnected");
      setIsProcessing(false);
      if (otherUserId) {
        navigate(`/chat/${otherUserId}`);
      } else {
        navigate("/");
      }
    };

    // Subscribe to call events
    try {
      call.on('call.ended', handleCallEnded);
      call.on('call.session_ended', handleCallEnded);
      call.on('call.participant_left', handleParticipantLeft);
      call.on('call.disconnected', handleCallDisconnected);
      call.on('call.session_participant_left', handleParticipantLeft);
    } catch (error) {
      console.log("Error subscribing to call events:", error);
    }

    // Cleanup event listeners
    return () => {
      try {
        call.off('call.ended', handleCallEnded);
        call.off('call.session_ended', handleCallEnded);
        call.off('call.participant_left', handleParticipantLeft);
        call.off('call.disconnected', handleCallDisconnected);
        call.off('call.session_participant_left', handleParticipantLeft);
      } catch (error) {
        console.log("Error cleaning up call events:", error);
      }
    };
  }, [call, navigate, otherUserId]);

  // Update call duration every second
  useEffect(() => {
    let interval = null;
    
    if (callingState === CallingState.JOINED && callStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now - callStartTime) / 1000);
        setCallDuration(duration);
      }, 1000);
    } else {
      setCallDuration(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callingState, callStartTime]);

  // Handle calling state changes (automatic call end detection)
  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      console.log("Call state changed to LEFT - redirecting to chat");
      toast("Call ended", { icon: 'ℹ️' });
      if (otherUserId) {
        navigate(`/chat/${otherUserId}`);
      } else {
        navigate("/");
      }
    } else if (callingState === CallingState.OFFLINE) {
      console.log("Call went offline");
      toast.error("Connection lost");
      setTimeout(() => {
        if (otherUserId) {
          navigate(`/chat/${otherUserId}`);
        } else {
          navigate("/");
        }
      }, 1000);
    }
  }, [callingState, navigate, otherUserId]);

  // Format duration as HH:MM:SS or MM:SS
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (callingState === CallingState.LEFT) {
    navigate("/");
    return null;
  }

  const handleEndCall = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (call) {
        // End the call for all participants
        console.log("Ending call for all participants...");
        
        // First try to end the call session (this will notify all participants)
        try {
          await call.endCall();
          console.log("Call ended successfully for all participants");
          toast.success("Call ended");
        } catch (endError) {
          // If endCall doesn't work, try to leave the call
          console.log("EndCall failed, trying to leave:", endError);
          await call.leave();
          console.log("Left call successfully");
          toast.success("Call ended");
        }
      }
    } catch (error) {
      console.error("Error ending call:", error);
      toast.error("Error ending call");
    } finally {
      setIsProcessing(false);
      // Navigate after a short delay to ensure proper cleanup
      setTimeout(() => {
        console.log("End call - Other user ID for navigation:", otherUserId);
        if (otherUserId) {
          console.log("Navigating to chat page:", `/chat/${otherUserId}`);
          navigate(`/chat/${otherUserId}`);
        } else {
          console.log("No other user ID found, navigating to home");
          navigate("/");
        }
      }, 500);
    }
  };

  const toggleMute = async () => {
    if (isProcessing || !call) return;
    
    setIsProcessing(true);
    try {
      if (isMicEnabled) {
        await call.microphone.disable();
        setIsMicEnabled(false);
        toast.success("Microphone muted");
      } else {
        await call.microphone.enable();
        setIsMicEnabled(true);
        toast.success("Microphone unmuted");
      }
    } catch (error) {
      console.error("Error toggling microphone:", error);
      toast.error("Error toggling microphone");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleVideo = async () => {
    if (isProcessing || !call) return;
    
    setIsProcessing(true);
    try {
      if (isCameraEnabled) {
        await call.camera.disable();
        setIsCameraEnabled(false);
        toast.success("Camera turned off");
      } else {
        await call.camera.enable();
        setIsCameraEnabled(true);
        toast.success("Camera turned on");
      }
    } catch (error) {
      console.error("Error toggling camera:", error);
      toast.error("Error toggling camera");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChatClick = () => {
    toast.info("Chat feature coming soon!");
  };

  const handleMoreOptions = () => {
    toast.info("More options coming soon!");
  };

  return (
    <div className="relative w-full h-full">
      {/* Video Content */}
      <div className="absolute inset-0 pt-20">
        <StreamTheme className="w-full h-full">
          <div className="w-full h-full relative">
            <SpeakerLayout />
          </div>
        </StreamTheme>
      </div>

      {/* Mobile WhatsApp-style Call Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-30 whatsapp-call-controls">
        <div className="flex items-center justify-center space-x-4 sm:space-x-6 px-4 sm:px-6 py-4 sm:py-6">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            disabled={isProcessing || !call}
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 touch-manipulation ${
              !isMicEnabled 
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50' 
                : 'bg-gray-800 hover:bg-gray-700 shadow-lg'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {!isMicEnabled ? (
              <MicOff className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            ) : (
              <Mic className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            )}
          </button>

          {/* Video Toggle Button */}
          <button
            onClick={toggleVideo}
            disabled={isProcessing || !call}
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 touch-manipulation ${
              !isCameraEnabled 
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50' 
                : 'bg-gray-800 hover:bg-gray-700 shadow-lg'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {!isCameraEnabled ? (
              <VideoOff className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            ) : (
              <Video className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            )}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            disabled={isProcessing}
            className={`w-16 h-16 sm:w-20 sm:h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-lg shadow-red-500/50 touch-manipulation ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <PhoneOff className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
          </button>

          {/* Chat Button */}
          <button 
            onClick={handleChatClick}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-lg touch-manipulation"
          >
            <MessageSquare className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          </button>

          {/* More Options Button */}
          <button 
            onClick={handleMoreOptions}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-lg touch-manipulation"
          >
            <MoreVertical className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          </button>
        </div>

        {/* Mobile Call Duration and Status */}
        <div className="mobile-call-duration">
          <p className={`text-base sm:text-lg font-medium mb-1 ${
            callingState === CallingState.JOINED ? 'animate-pulse' : ''
          }`}>
            {callingState === CallingState.JOINED 
              ? formatDuration(callDuration)
              : "Connecting..."
            }
          </p>
          <p className="text-xs sm:text-sm text-green-300">
            {callingState === CallingState.JOINED 
              ? `Connected • ${formatDuration(callDuration)}`
              : callingState === CallingState.RINGING 
              ? "Ringing..." 
              : "Connecting..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallPage;

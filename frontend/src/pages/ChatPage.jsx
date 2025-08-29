import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser?.profilePic || '/default-avatar.png',
          },
          tokenData.token
        );

        //
        const channelId = [authUser._id, targetUserId].sort().join("-");

        // you and me
        // if i start the chat => channelId: [myId, yourId]
        // if you start the chat => channelId: [yourId, myId]  => [myId,yourId]

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      // Include targetUserId as query parameter for easier extraction in CallPage
      const callUrl = `${window.location.origin}/call/${channel.id}?targetUserId=${targetUserId}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
      
      // Navigate to call page immediately for the caller
      window.open(callUrl, '_blank');
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] w-full bg-base-100 text-base-content overflow-hidden transition-colors duration-200">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          {/* Mobile First Layout */}
          <div className="w-full h-full relative flex flex-col bg-base-100 transition-colors duration-200">
            {/* Mobile Call Button - Fixed position with better mobile positioning */}
            <div className="call-button-container absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 z-30">
              <CallButton handleVideoCall={handleVideoCall} />
            </div>
            
            <Window>
              <div className="flex flex-col h-full bg-base-100 transition-colors duration-200">
                {/* Mobile Header - Sticky and compact */}
                <div className="flex-shrink-0 bg-base-200 border-b border-base-300 sticky top-2 z-10 transition-colors duration-200 mt-2">
                  <div className="px-2 py-2 sm:px-4 sm:py-3">
                    <ChannelHeader />
                  </div>
                </div>
                
                {/* Mobile Message List - Full height with safe area */}
                <div className="flex-1 min-h-0 bg-base-100 overflow-hidden transition-colors duration-200">
                  <div className="h-full pb-safe">
                    <MessageList 
                      messageActions={['edit', 'delete', 'react']}
                      additionalMessageInputProps={{
                        maxRows: 3,
                        placeholder: 'Type a message...'
                      }}
                    />
                  </div>
                </div>
                
                {/* Mobile Message Input - Sticky bottom with safe area */}
                <div className="flex-shrink-0 bg-base-200 border-t border-base-300 sticky bottom-0 z-10 pb-safe transition-colors duration-200">
                  <div className="p-2 sm:p-3 lg:p-4">
                    <MessageInput 
                      focus 
                      grow
                      maxRows={4}
                      additionalTextareaProps={{
                        placeholder: 'Type your message...',
                        rows: 1
                      }}
                    />
                  </div>
                </div>
              </div>
            </Window>
          </div>
          
          {/* Thread - Hidden on mobile, sidebar on tablet, overlay on desktop */}
          <div className="hidden lg:block bg-base-100 transition-colors duration-200">
            <Thread />
          </div>
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;

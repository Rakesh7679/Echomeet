import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <button 
      onClick={handleVideoCall} 
      className="btn btn-success btn-sm sm:btn-md text-white rounded-full shadow-lg hover:shadow-xl transition-all"
      aria-label="Start video call"
    >
      <VideoIcon className="size-4 sm:size-5" />
      <span className="hidden sm:inline">Call</span>
    </button>
  );
}

export default CallButton;

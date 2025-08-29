import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <button 
      onClick={handleVideoCall} 
      className="btn btn-success text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 touch-manipulation relative z-30 flex items-center justify-center"
      aria-label="Start video call"
      style={{ 
        minWidth: '48px', 
        minHeight: '48px',
        padding: '12px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        border: '2px solid #ffffff',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1)'
      }}
    >
      <VideoIcon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
      <span className="hidden sm:inline ml-2 font-semibold">Call</span>
    </button>
  );
}

export default CallButton;

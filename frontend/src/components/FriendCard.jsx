import { Link } from "react-router-dom";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  // Add safety check for friend object
  if (!friend) {
    return null;
  }

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow h-full">
      <div className="card-body p-3 sm:p-4 flex flex-col h-full">
        {/* USER INFO */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <div className="avatar w-10 h-10 sm:w-12 sm:h-12">
            <img 
              src={friend.profilePic || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRTVFNUU1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEMxOC4wMTA5IDIwIDE2LjEwMzIgMTkuNDEgMTQuNTk2NyAxOC4zMDM0QzEzLjA5MDIgMTcuMTk2OCAxMiAxNS41NzEyIDEyIDEzLjc3NzhDMTIgMTEuOTg0MyAxMy4wOTAyIDEwLjM1ODcgMTQuNTk2NyA5LjI1MjEyQzE2LjEwMzIgOC4xNDU1NCAxOC4wMTA5IDcuNTU1NTYgMjAgNy41NTU1NkMyMS45ODkxIDcuNTU1NTYgMjMuODk2OCA4LjE0NTU0IDI1LjQwMzMgOS4yNTIxMkMyNi45MDk4IDEwLjM1ODcgMjggMTEuOTg0MyAyOCAxMy43Nzc4QzI4IDE1LjU3MTIgMjYuOTA5OCAxNy4xOTY4IDI1LjQwMzMgMTguMzAzNEMyMy44OTY4IDE5LjQxIDIxLjk4OTEgMjAgMjAgMjBaTTIwIDM1LjU1NTZDMTEuMTYyIDM1LjU1NTYgMTAgMzAuNjE4IDEwIDMwLjYxOEMxMCAyNi44NzgyIDEzLjEzNCAyMy43Nzc4IDIwIDIzLjc3NzhDMjYuODY2IDIzLjc3NzggMzAgMjYuODc4MiAzMCAzMC42MThDMzAgMzAuNjE4IDI4LjgzOCAzNS41NTU2IDIwIDM1LjU1NTZaIiBmaWxsPSIjOTQ5NDk0Ii8+Cjwvc3ZnPgo='} 
              alt={friend.fullName || 'User'} 
              className="rounded-full w-full h-full object-cover" 
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRTVFNUU1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEMxOC4wMTA5IDIwIDE2LjEwMzIgMTkuNDEgMTQuNTk2NyAxOC4zMDM0QzEzLjA5MDIgMTcuMTk2OCAxMiAxNS41NzEyIDEyIDEzLjc3NzhDMTIgMTEuOTg0MyAxMy4wOTAyIDEwLjM1ODcgMTQuNTk2NyA5LjI1MjEyQzE2LjEwMzIgOC4xNDU1NCAxOC4wMTA5IDcuNTU1NTYgMjAgNy41NTU1NkMyMS45ODkxIDcuNTU1NTYgMjMuODk2OCA4LjE0NTU0IDI1LjQwMzMgOS4yNTIxMkMyNi45MDk4IDEwLjM1ODcgMjggMTEuOTg0MyAyOCAxMy43Nzc4QzI4IDE1LjU3MTIgMjYuOTA5OCAxNy4xOTY4IDI1LjQwMzMgMTguMzAzNEMyMy44OTY4IDE5LjQxIDIxLjk4OTEgMjAgMjAgMjBaTTIwIDM1LjU1NTZDMTEuMTYyIDM1LjU1NTYgMTAgMzAuNjE4IDEwIDMwLjYxOEMxMCAyNi44NzgyIDEzLjEzNCAyMy43Nzc4IDIwIDIzLjc3NzhDMjYuODY2IDIzLjc3NzggMzAgMjYuODc4MiAzMCAzMC42MThDMzAgMzAuNjE4IDI4LjgzOCAzNS41NTU2IDIwIDM1LjU1NTZaIiBmaWxsPSIjOTQ5NDk0Ii8+Cjwvc3ZnPgo=';
              }}
            />
          </div>
          <h3 className="font-semibold truncate text-sm sm:text-base">{friend.fullName || 'Unknown User'}</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-1.5 mb-3 flex-grow">
          <span className="badge badge-secondary text-xs flex-1 sm:flex-initial justify-center">
            {getLanguageFlag(friend.nativeLanguage)}
            <span className="hidden sm:inline">Native: </span>
            <span className="sm:hidden">N: </span>
            {friend.nativeLanguage || 'Unknown'}
          </span>
          <span className="badge badge-outline text-xs flex-1 sm:flex-initial justify-center">
            {getLanguageFlag(friend.learningLanguage)}
            <span className="hidden sm:inline">Learning: </span>
            <span className="sm:hidden">L: </span>
            {friend.learningLanguage || 'Unknown'}
          </span>
        </div>

        <Link to={`/chat/${friend._id || ''}`} className="btn btn-outline btn-sm sm:btn-md w-full mt-auto">
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}

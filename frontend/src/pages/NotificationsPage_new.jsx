import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-6 sm:space-y-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-4 sm:mb-6">Notifications</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-3 sm:space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 flex-wrap">
                  <UserCheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span>Friend Requests</span>
                  <span className="badge badge-primary badge-sm sm:badge-md">{incomingRequests.length}</span>
                </h2>

                <div className="space-y-2 sm:space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            <div className="avatar w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-base-300 flex-shrink-0">
                              <img 
                                src={request.sender.profilePic} 
                                alt={request.sender.fullName}
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm sm:text-base truncate">{request.sender.fullName}</h3>
                              <div className="flex flex-col sm:flex-row gap-1 sm:gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-xs sm:badge-sm">
                                  Native: {request.sender.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-xs sm:badge-sm">
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {acceptedRequests.length > 0 && (
              <section className="space-y-3 sm:space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-2 sm:space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div key={notification._id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-3 sm:p-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="avatar mt-1 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0">
                            <img
                              src={notification.recipient.profilePic}
                              alt={notification.recipient.fullName}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base">{notification.recipient.fullName}</h3>
                            <p className="text-xs sm:text-sm my-1">
                              {notification.recipient.fullName} accepted your friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success badge-sm">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">New Friend</span>
                            <span className="sm:hidden">New</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;

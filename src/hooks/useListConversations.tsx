import { useConversations } from "@xmtp/react-sdk";
import { useEffect } from "react";
import { useXmtpStore } from "../store/xmtp";

const useListConversations = () => {
  const setLoadingConversations = useXmtpStore(
    (state) => state.setLoadingConversations,
  );

  useEffect(() => {
    if (Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }, []);

  const { conversations, isLoading, error } = useConversations();

  useEffect(() => {
    setLoadingConversations(isLoading);
  }, [isLoading, setLoadingConversations]);

  return {
    conversations,
    error,
    isLoading,
  };
};

export default useListConversations;

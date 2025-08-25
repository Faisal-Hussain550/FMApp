import React, { useEffect, useRef } from "react";
import { useManagerTag } from "../../context/ManagerTagContext";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";

// Mount this once (e.g., in your app layout)
const ManagerNotifications = () => {
  const { taggedIssues } = useManagerTag();
  const { auth } = useAuth();
  const lastSeenCountRef = useRef(0);

  useEffect(() => {
    if (!auth?.userId) return;

    const mine = taggedIssues.filter(t => String(t.managerId) === String(auth.userId));
    if (mine.length > lastSeenCountRef.current) {
      const newest = mine[mine.length - 1];
      toast.info(`New issue tagged to you: “${newest.title}” (#${newest.issueId})`);
      lastSeenCountRef.current = mine.length;
    }
  }, [taggedIssues, auth?.userId]);

  return null;
};

export default ManagerNotifications;


import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db, auth } from "./firebase";
import { SystemLog } from "../types";

const COLLECTION_NAME = "system_audit_logs";

export const logUserAction = async (action: string, module: string, details: string) => {
  try {
    const user = auth.currentUser;
    const userId = user ? user.uid : 'anonymous';
    const userName = user ? (user.displayName || user.email || 'Usuário Sem Nome') : 'Visitante';

    await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      userName,
      action,
      module,
      details,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent
    });
  } catch (error) {
    console.error("Error logging audit action:", error);
  }
};

export const subscribeToAuditLogs = (callback: (logs: SystemLog[]) => void) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy("timestamp", "desc"),
    limit(100)
  );

  return onSnapshot(q, (querySnapshot) => {
    const logs: SystemLog[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        action: data.action,
        module: data.module,
        details: data.details,
        timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
      });
    });
    callback(logs);
  });
};

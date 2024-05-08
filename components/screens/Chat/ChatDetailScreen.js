import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";

const ChatDetailScreen = ({ route }) => {
  const { selectedUser, selectedChatroom } = route.params;
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userUid = user.uid;
          const userDataDocRef = doc(firestore, "employeesprofile", userUid);
          const userDataDocSnapshot = await getDoc(userDataDocRef);
          if (userDataDocSnapshot.exists()) {
            const userData = userDataDocSnapshot.data();
            setEmployeeData(userData);
          } else {
            console.error("User data not found for UID:", userUid);
          }
        } else {
          console.log("No user signed in.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (employeeData && selectedUser) {
      const participants = [employeeData.uid, selectedUser.uid]
        .sort()
        .join("_");
      const chatRef = collection(firestore, "chats");
      const chatQuery = query(
        chatRef,
        where("participants", "==", participants)
      );

      const unsubscribeChat = onSnapshot(chatQuery, (snapshot) => {
        if (!snapshot.empty) {
          const chatDoc = snapshot.docs[0];
          setChatId(chatDoc.id);

          const messagesRef = collection(chatDoc.ref, "messages");
          const messagesQuery = query(messagesRef, orderBy("timestamp"));
          const unsubscribeMessages = onSnapshot(
            messagesQuery,
            (messagesSnapshot) => {
              const newMessages = messagesSnapshot.docs.map((doc) =>
                doc.data()
              );
              setMessages(newMessages);
            }
          );
        } else {
          const newChatRef = addDoc(chatRef, { participants });
          setChatId(newChatRef.id);
        }
      });

      return () => {
        unsubscribeChat();
      };
    } else if (selectedChatroom) {
      const chatroomId = selectedChatroom.id;
      const messagesRef = collection(
        firestore,
        "chatrooms",
        chatroomId,
        "messages"
      );
      const messagesQuery = query(messagesRef, orderBy("timestamp"));

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => doc.data());
        setMessages(newMessages);
      });

      return () => unsubscribe();
    }
  }, [employeeData, selectedUser, selectedChatroom]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    if (selectedChatroom) {
      await addDoc(
        collection(firestore, "chatrooms", selectedChatroom.id, "messages"),
        {
          senderId: employeeData.uid,
          text: newMessage,
          timestamp: serverTimestamp(),
        }
      );
    } else if (selectedUser) {
      if (!chatId) return;
      await addDoc(collection(firestore, "chats", chatId, "messages"), {
        senderId: employeeData.uid,
        text: newMessage,
        timestamp: serverTimestamp(),
      });
    }

    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {selectedUser
          ? `Chat with ${selectedUser.fullName}`
          : selectedChatroom
          ? `Chatroom: ${selectedChatroom.name}`
          : "No user selected"}
      </Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              {
                justifyContent:
                  item.senderId === employeeData.uid
                    ? "flex-end"
                    : "flex-start",
              },
            ]}
          >
            {item.senderId !== employeeData.uid && (
              <Image
                source={{
                  uri: selectedUser
                    ? selectedUser.profilePicture || ""
                    : (selectedChatroom &&
                        selectedChatroom.participants &&
                        selectedChatroom.participants.find(
                          (participant) => participant.uid === item.senderId
                        )?.profilePicture) ||
                      "",
                }}
                style={styles.profilePicture}
              />
            )}
            <View
              style={[
                styles.messageBubble,
                {
                  backgroundColor:
                    item.senderId === employeeData.uid ? "#cbb4ef" : "#d9c9f4",
                },
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
            {item.senderId === employeeData.uid && (
              <Image
                source={{
                  uri: employeeData.profilePicture || "",
                }}
                style={styles.profilePicture}
              />
            )}
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
          placeholder="Type a message..."
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={(!selectedUser && !selectedChatroom) || !newMessage.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "#ffffff",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 15,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: "#ffffff",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#9060de",
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default ChatDetailScreen;

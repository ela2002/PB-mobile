import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";

const ChatListScreen = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [users, setUsers] = useState([]);
  const [chatrooms, setChatrooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Friends");
  const navigation = useNavigation();
  const avatar = "../../../assets/avatar.jpg";

  const flatListRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const employeeQuerySnapshot = await getDocs(
          query(
            collection(firestore, "employeesprofile"),
            where("uid", "==", user.uid)
          )
        );
        if (!employeeQuerySnapshot.empty) {
          const employeeDoc = employeeQuerySnapshot.docs[0];
          setEmployeeData({ ...employeeDoc.data(), id: employeeDoc.id });
        } else {
          console.error("Employee data not found for UID:", user.uid);
          setEmployeeData(null);
        }
      } else {
        setEmployeeData(null);
        console.log("User not authenticated");
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (employeeData) {
      const unsubscribeUsers = onSnapshot(
        collection(firestore, "employeesprofile"),
        (snapshot) => {
          setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      );

      const chatroomsRef = collection(firestore, "chatrooms");
      const chatroomsQuery = query(
        chatroomsRef,
        where("participants", "array-contains", employeeData.uid)
      );
      const unsubscribeChatrooms = onSnapshot(chatroomsQuery, (snapshot) => {
        setChatrooms(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });

      return () => {
        unsubscribeUsers();
        unsubscribeChatrooms();
      };
    }
  }, [employeeData]);

  useEffect(() => {
    const results = users.filter(
      (employeeData) =>
        employeeData.fullName &&
        employeeData.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, users]);

  const navigateToChatDetail = (selectedItem) => {
    if (selectedItem.type === "user") {
      navigation.navigate("ChatDetailScreen", { selectedUser: selectedItem });
    } else if (selectedItem.type === "chatroom") {
      navigation.navigate("ChatDetailScreen", {
        selectedChatroom: selectedItem,
      });
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  const onScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY === 0) {
      handleRefresh();
    }
  };

  const renderSearchResults = () => (
    <FlatList
      ref={flatListRef}
      data={searchResults}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.searchResultItem}
          onPress={() => navigateToChatDetail({ ...item, type: "user" })} // Specify the type as "user"
        >
          <Image
            source={{ uri: item.profilePicture || avatar }}
            style={styles.profileImage}
          />
          <Text style={styles.fullName}>{item.fullName}</Text>
        </TouchableOpacity>
      )}
      onScroll={onScroll}
      scrollEventThrottle={16}
    />
  );

  const renderChatRooms = () => (
    <FlatList
      data={chatrooms}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigateToChatDetail({ ...item, type: "chatroom" })}
          style={styles.chatroomCard}
        >
          <Image uri={item.image || avatar} style={styles.chatroomImage} />
          <Text style={styles.chatroomName}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );

  const renderContent = () => {
    if (selectedTab === "Friends") {
      return (
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Friends</Text>
          {renderSearchResults()}
        </View>
      );
    } else if (selectedTab === "Chatrooms") {
      return (
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Chatrooms</Text>
          {renderChatRooms()}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Friends" && styles.selectedTab]}
          onPress={() => setSelectedTab("Friends")}
        >
          <Text style={styles.tabText}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "Chatrooms" && styles.selectedTab,
          ]}
          onPress={() => setSelectedTab("Chatrooms")}
        >
          <Text style={styles.tabText}>Chatrooms</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  fullName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chatroomCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
  },
  chatroomImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatroomName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  spinner: {
    marginTop: 10,
  },
});

export default ChatListScreen;

import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import WelcomeScreen from "../components/screens/Welcome/WelcomeScreen";
import SignUpScreen from "../components/screens/Authentication/SignUpScreen";
import SignInScreen from "../components/screens/Authentication/SignInScreen";
import HomeScreen from "../components/screens/Home/HomeScreen";
import InsightzoneScreen from "../components/screens/Insightzone/InsightzoneScreen";
import ChatScreen from "../components/screens/Chat/ChatScreen";
import CommunityScreen from "../components/screens/Community/CommunityScreen";
import EmployeeProfileScreen from "../components/screens/EmployeeProfile/EmployeeProfileScreen";
import AddPostScreen from "../components/screens/AddPost/AddPostScreen";
import ApplicationsScreen from "../components/screens/Applications/ApplicationsScreen";
import Tabs from "../components/tabs/Tabs";

import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../firebase/firebase";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator tabBar={(props) => <Tabs {...props} />}>
      <Tab.Screen name="Insightzone" component={InsightzoneScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="AddPost" component={AddPostScreen} />
      <Tab.Screen name="Applications" component={ApplicationsScreen} />
      <Tab.Screen name="EmployeeProfile" component={EmployeeProfileScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState("Auth");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setInitialRoute(user ? "Main" : "Auth");
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

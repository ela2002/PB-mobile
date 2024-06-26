import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import WelcomeScreen from "../components/screens/Welcome/WelcomeScreen";
import SignUpScreen from "../components/screens/Authentication/SignUpScreen";
import SignInScreen from "../components/screens/Authentication/SignInScreen";
import InsightzoneScreen from "../components/screens/Insightzone/InsightzoneScreen";
import ChatListScreen from "../components/screens/Chat/ChatListScreen";
import ChatDetailScreen from "../components/screens/Chat/ChatDetailScreen";
import CommunityScreen from "../components/screens/Community/CommunityScreen";
import EmployeeProfileScreen from "../components/screens/EmployeeProfile/EmployeeProfileScreen";
import AddPostScreen from "../components/screens/AddPost/AddPostScreen";
import AddReview from "../components/screens/AddPost/AddReview";
import ApplicationsScreen from "../components/screens/Applications/ApplicationsScreen";
import Tabs from "../components/tabs/Tabs";
import SearchScreen from "../components/screens/Search/SearchScreen";
import CompanyDetail from "../components/CompanyProfile/CompanyDetail";
import JobDetail from "../components/Jobs/JobDetail";
import ParticipantDetail from "../components/screens/participant/participantdetails";
import AcademicBackground from "../components/EmployeeProfile/academicBackground";
import Certifications from "../components/EmployeeProfile/certifications";
import Resume from "../components/EmployeeProfile/resume";
import Languages from "../components/EmployeeProfile/languages";
import Interests from "../components/EmployeeProfile/Interests";
import Workexperience from "../components/EmployeeProfile/workexperience";
import Projects from "../components/EmployeeProfile/projects";
import Informations from "../components/EmployeeProfile/inormations";

import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../firebase/firebase";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator tabBar={(props) => <Tabs {...props} />}>
      <Tab.Screen
        name="Insightzone"
        component={InsightzoneScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="AddPost"
        component={AddPostScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="AddReview"
        component={AddReview}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Applications"
        component={ApplicationsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="EmployeeProfile"
        component={EmployeeProfileScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="participantdetail"
        component={ParticipantDetail}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Informations"
        component={Informations}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Projects"
        component={Projects}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Resume"
        component={Resume}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Workexperience"
        component={Workexperience}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Interests"
        component={Interests}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="AcademicBackground"
        component={AcademicBackground}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Languages"
        component={Languages}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Certifications"
        component={Certifications}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
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
        <Stack.Screen
          name="Main"
          component={MainNavigator}
          options={{
            headerShown: false,
            gestureEnabled: false, // Disable gestures to prevent back navigation
          }}
        />
        <Stack.Screen
          name="ChatListScreen"
          component={ChatListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatDetailScreen"
          component={ChatDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompanyDetail"
          component={CompanyDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobDetail"
          component={JobDetail}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

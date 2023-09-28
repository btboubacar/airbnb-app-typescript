import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// navigation
import { HomeStackParamList } from "./navigation/types";

// Screens
import HomeScreen from "./screens/HomeScreen";
import RoomScreen from "./screens/RoomScreen";
import SignInScreen from "./screens/SignInScreen";
import AroundMeScreen from "./screens/AroundMeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignUpScreen from "./screens/SignUpScreen";

// components
import Logo from "./components/Logo";
import HeaderGoBack from "./components/HeaderGoBack";

// utils
import HandleAsyncStorage from "./utils/handleAsyncStorage";

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator();

export default function App() {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setToken = async (token: string | null, id: string | null) => {
    const handleAsyncStorage = new HandleAsyncStorage(token, id);
    await handleAsyncStorage.handleStorage();
    setUserToken(token);
    setUserId(id);
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      const handleAsync = new HandleAsyncStorage();
      const value = await handleAsync.getAsyncStorage();
      setUserToken(value[0]);
      setUserId(value[1]);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          <>
            {/* ----------------------------------------------------------------- */}
            {/* -------------------------- SignIn & SignUp----------------------- */}
            {/* ----------------------------------------------------------------- */}
            <Stack.Screen name="SignIn">
              {(props) => <SignInScreen setToken={setToken} {...props} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp">
              {(props) => <SignUpScreen setToken={setToken} {...props} />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="StackTabHome" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: "tomato",
                  tabBarInactiveTintColor: "gray",
                }}
              >
                {/* ----------------------------------------------------------------- */}
                {/* -------------------------- HOME tab ----------------------------- */}
                {/* ----------------------------------------------------------------- */}
                <Tab.Screen
                  name="TabHome"
                  options={{
                    headerShown: false,
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="ios-home" size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Home"
                        options={{
                          title: "",
                          headerTitleAlign: "center",
                          headerTitle: () => <Logo />,
                          headerLeft: ({ canGoBack }) => {
                            return canGoBack ? <HeaderGoBack /> : null;
                          },
                        }}
                      >
                        {(props) => <HomeScreen {...props} />}
                      </Stack.Screen>
                      <Stack.Screen
                        name="Room"
                        options={{
                          headerTitleAlign: "center",
                          headerTitle: () => <Logo />,
                          headerLeft: () => <HeaderGoBack />,
                        }}
                      >
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                {/* ----------------------------------------------------------------- */}
                {/* -----------------------Around me tab ----------------------------- */}
                {/* ----------------------------------------------------------------- */}
                <Tab.Screen
                  name="TabAround"
                  options={{
                    tabBarLabel: "Around me",
                    tabBarIcon: ({ size, color }) => (
                      <FontAwesome
                        name="map-marker"
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="AroundMe"
                        options={{
                          headerTitle: () => <Logo />,
                          headerTitleAlign: "center",
                        }}
                      >
                        {(props) => <AroundMeScreen {...props} />}
                      </Stack.Screen>
                      <Stack.Screen
                        name="Room"
                        options={{
                          headerTitleAlign: "center",
                          headerTitle: () => <Logo />,
                          headerLeft: () => <HeaderGoBack />,
                        }}
                      >
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                {/* ----------------------------------------------------------------- */}
                {/* ----------------------- profile tab ----------------------------- */}
                {/* ----------------------------------------------------------------- */}
                <Tab.Screen
                  name="TabProfile"
                  options={{
                    tabBarLabel: "My Profile",
                    tabBarIcon: ({ size, color }) => (
                      <Ionicons
                        name="settings-outline"
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Profile"
                        options={{
                          headerTitleAlign: "center",
                          headerTitle: () => <Logo />,
                        }}
                      >
                        {() => (
                          <ProfileScreen
                            setToken={setToken}
                            userId={userId}
                            userToken={userToken}
                          />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

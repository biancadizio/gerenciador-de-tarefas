// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from "./src/screens/HomeScreen";
import { theme } from "./src/theme";
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();


const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1, height: '100%' }}>
      <NavigationContainer>
        <StatusBar backgroundColor={theme.colors.background} />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTintColor: theme.colors.text,
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Gerenciador de Tarefas" }}
          />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
import React from "react";
import {
  extendTheme,
} from "native-base";
import { Login } from "./page/loginPage/Login";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import { Pages } from "./types/PageProps";
import { SignUp } from "./page/signUpPage/SignUp";
import { Home } from "./page/homePage/HomePage";
import { MapPage } from "./page/mapPage/Map";
import { NavigationPage } from "./page/navigationPage/NavigationPage";
import { CreateQuest } from "./page/createQuestPage/CreateQuestPage";
import { AddCode } from "./page/addCodePage/AddCodePage";
import { ScanPage } from "./page/scanPage/Scan";
import { EditLocation } from "./page/editLocationPage/EditLocationPage";
import { ViewLocations} from "./page/viewAllLocations/viewAllLocationsPage";
import { LogBox } from "react-native";

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

LogBox.ignoreAllLogs(); //Ignore all log notifications

// extend the theme
export const theme = extendTheme({ config });
type MyThemeType = typeof theme;
declare module "native-base" {
  interface ICustomTheme extends MyThemeType { }
}
export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen
          name={Pages.Login}
          component={Login}
        />
        <Stack.Screen
          name={Pages.SignUp}
          component={SignUp}
        />
        <Stack.Screen
          name={Pages.Map}
          component={MapPage}
        />
        <Stack.Screen
          name={Pages.Home}
          component={Home}
        />
        <Stack.Screen
          name={Pages.Navigation}
          component={NavigationPage}
        />
        <Stack.Screen
          name={Pages.Scan}
          component={ScanPage}
        />
        <Stack.Screen
          name={Pages.CreateQuest}
          component={CreateQuest}
        />
        <Stack.Screen
          name={Pages.AddCode}
          component={AddCode}
        />
        <Stack.Screen
          name={Pages.EditLocation}
          component={EditLocation}
        />
        <Stack.Screen
          name={Pages.ViewLocations}
          component={ViewLocations}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

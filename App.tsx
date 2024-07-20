import * as React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { SQLiteProvider } from 'expo-sqlite/next';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [DbLoaded, setDbLoaded] = React.useState<boolean>(false);
  const [fontsLoaded] = useFonts({
    Nothing: require('./assets/fonts/nothingfont.otf'),
  });

  React.useEffect(() => {
    async function loadDatabase() {
      const dbName = 'mySQLiteDB.db';
      const dbAsset = require('./assets/mySQLiteDB.db');
      const dbUri = Asset.fromModule(dbAsset).uri;
      const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

      const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
      if (!fileInfo.exists) {
        await FileSystem.makeDirectoryAsync(
          `${FileSystem.documentDirectory}SQLite`,
          { intermediates: true }
        );
        await FileSystem.downloadAsync(dbUri, dbFilePath);
      }
      setDbLoaded(true);
    }

    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      await loadDatabase();
    }

    prepare().catch((e) => console.error(e));
  }, []);

  React.useEffect(() => {
    if (fontsLoaded && DbLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, DbLoaded]);

  if (!fontsLoaded || !DbLoaded)
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size={'large'} />
        <Text>Loading....</Text>
      </View>
    );

  return (
    <NavigationContainer>
      <SQLiteProvider databaseName='mySQLiteDB.db' useSuspense>
        <Stack.Navigator>
          <Stack.Screen
            name='Home'
            component={Home}
            options={{
              headerTitle: '💲NOTHING TRACKER ⬛',
              headerLargeTitle: true,
              headerTitleStyle: { fontFamily: 'Nothing' }
            }}
          />
        </Stack.Navigator>
      </SQLiteProvider>
    </NavigationContainer>
  );
}

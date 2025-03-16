/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import AppNavigator from './src/navigation';
import {ThemeProvider} from './src/contexts/ThemeContext';
import {UserProvider} from './src/contexts/UserContext';

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <UserProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <SafeAreaView style={styles.container}>
          <AppNavigator />
        </SafeAreaView>
      </UserProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;

import { NavigationContainer } from '@react-navigation/native';
import { JobProvider } from './context/JobContext';
import { ThemeProvider } from './context/ThemeContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <JobProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </JobProvider>
    </ThemeProvider>
  );
}

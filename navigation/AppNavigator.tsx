import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JobFinderScreen from '../screens/JobFinderScreen';
import SavedJobsScreen from '../screens/SavedJobsScreen';
import ApplyJobScreen from '../screens/ApplyJobScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Jobs" component={JobFinderScreen} />
      <Stack.Screen name="SavedJobs" component={SavedJobsScreen} />
      <Stack.Screen name="Apply" component={ApplyJobScreen} />
    </Stack.Navigator>
  );
}

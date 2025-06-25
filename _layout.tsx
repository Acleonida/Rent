import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from '../src/contexts/AuthContext'
import Toast from 'react-native-toast-message'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#3b82f6',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'RentMate',
            }}
          />
          <Stack.Screen
            name="auth/login"
            options={{
              title: 'Sign In',
            }}
          />
          <Stack.Screen
            name="auth/signup"
            options={{
              title: 'Create Account',
            }}
          />
          <Stack.Screen
            name="browse"
            options={{
              title: 'Browse Items',
            }}
          />
          <Stack.Screen
            name="item/[id]"
            options={{
              title: 'Item Details',
            }}
          />
          <Stack.Screen
            name="profile"
            options={{
              title: 'Profile',
            }}
          />
          <Stack.Screen
            name="dashboard"
            options={{
              title: 'Dashboard',
            }}
          />
          <Stack.Screen
            name="create-item"
            options={{
              title: 'List Item',
            }}
          />
          <Stack.Screen
            name="messages"
            options={{
              title: 'Messages',
            }}
          />
          <Stack.Screen
            name="rentals"
            options={{
              title: 'My Rentals',
            }}
          />
        </Stack>
        <StatusBar style="light" />
        <Toast />
      </AuthProvider>
    </QueryClientProvider>
  )
} 
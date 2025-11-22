import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { AuthProvider } from '@/contexts/authContext'

const  StackLayout = () => {
  return (
    <Stack screenOptions={{headerShown : false}}>
      <Stack.Screen name='(main)/profileModal' options={{presentation : "modal"}}/>
      <Stack.Screen name='(main)/newConversation' options={{presentation : "modal"}}/>

    </Stack>
  )
}

const RootLayout = () => {
    return (
        <AuthProvider>
            <StackLayout />
        </AuthProvider>
    )
}

export default RootLayout
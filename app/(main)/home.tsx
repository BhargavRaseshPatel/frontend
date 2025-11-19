import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '@/contexts/authContext'

const Home = () => {
  const {user} = useAuth()
  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})
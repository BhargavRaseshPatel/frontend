import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/authContext'
import { testSocket } from '@/socket/socketEvent'

const Home = () => {

  // useEffect(() => {
  //   testSocket(testSocketCallbackHandler)

  //   return () => {
  //     testSocket(testSocketCallbackHandler, true)
  //   }
  // }, [])

  // const testSocketCallbackHandler = (data: any) => {
  //   console.log("got response from testSocket event: ", data)
  // }

  const { user } = useAuth()
  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})
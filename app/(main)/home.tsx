import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/authContext'
import { getConversations, newConversation, testSocket } from '@/socket/socketEvent'
import { verticalScale } from '@/utils/styling'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Type'
import * as Icons from 'phosphor-react-native'
import { useRouter } from 'expo-router'
import ConversationItem from '@/components/ConversationItem'
import Loading from '@/components/Loading'
import Button from '@/components/Button'
import { ConversationProps, ResponseProps } from '@/types'

const Home = () => {

  const { user: currentUser, signOut } = useAuth()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationProps[]>([])

  useEffect(() => {
    getConversations(processConversations)
    newConversation(newConversationHandler)
    getConversations(null)

    return () => {
      getConversations(processConversations, true)
      newConversation(newConversationHandler, true)
    }
  }, [])

  const processConversations = (res: ResponseProps) => {
    // console.log("res", res)

    if (res.success) {
      setConversations(res.data)
    }
  }

  const newConversationHandler = (res: ResponseProps) => {
    if (res.success && res?.data?.isNew) {
      setConversations((prev) => [...prev, res.data])
    }
  }
  // useEffect(() => {
  //   testSocket(testSocketCallbackHandler)

  //   return () => {
  //     testSocket(testSocketCallbackHandler, true)
  //   }
  // }, [])

  // const testSocketCallbackHandler = (data: any) => {
  //   console.log("got response from testSocket event: ", data)
  // }

  // const conversations = [
  //   {
  //     name: "Alice",
  //     type: "direct",
  //     lastMessage: {
  //       senderName: "Alice",
  //       content: "Hey! Are we stilll on for tonight?",
  //       createdAt: "2025-06-22T18:45:00Z"
  //     }
  //   }
  // ]

  let directConversations = conversations.filter((item: ConversationProps) => item.type == 'direct').sort((a: ConversationProps, b: ConversationProps) => {
    const aDate = a?.lastMessage?.createdAt || a.createdAt;
    const bData = b?.lastMessage?.createdAt || b.createdAt;

    return new Date(bData).getTime() - new Date(aDate).getTime();

  })

  let groupConversations = conversations.filter((item: ConversationProps) => item.type == 'group').sort((a: ConversationProps, b: ConversationProps) => {
    const aDate = a?.lastMessage?.createdAt || a.createdAt;
    const bData = b?.lastMessage?.createdAt || b.createdAt;

    return new Date(bData).getTime() - new Date(aDate).getTime();

  })

  const { user } = useAuth()
  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.4}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Typo color={colors.white} size={19} textProps={{ numberOfLines: 1 }}>Welcome back, <Typo size={20} color={colors.white} fontWeight={'800'}> {currentUser?.name}</Typo></Typo>
          </View>

          <TouchableOpacity style={styles.settingIcon} onPress={() => router.push('/(main)/profileModal')}>
            <Icons.GearSixIcon color={colors.white} weight='fill' size={verticalScale(22)} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <ScrollView contentContainerStyle={{ paddingVertical: spacingY._20 }}>

            <View style={styles.navBar}>
              <View style={styles.tabs}>
                <TouchableOpacity onPress={() => setSelectedTab(0)} style={[styles.tabStyle, selectedTab == 0 && styles.activeTabStyle]}>
                  <Typo>Direct Message</Typo>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSelectedTab(1)} style={[styles.tabStyle, selectedTab == 1 && styles.activeTabStyle]}>
                  <Typo>Groups</Typo>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.conversationList}>
              {selectedTab == 0 && directConversations.map((item: ConversationProps, index) => {
                return (
                  <ConversationItem item={item} key={index} router={router} showDivider={directConversations.length != index + 1} />
                )
              })}

              {selectedTab == 1 && groupConversations.map((item: ConversationProps, index) => {
                return (
                  <ConversationItem item={item} key={index} router={router} showDivider={directConversations.length != index + 1} />
                )
              })}
            </View>

            {!loading && selectedTab == 0 && directConversations.length == 0 && (
              <Typo style={{ textAlign: 'center' }}>You don't have any direct message.</Typo>
            )}

            {!loading && selectedTab == 1 && groupConversations.length == 0 && (
              <Typo style={{ textAlign: 'center' }}>You haven't joined any group yet.</Typo>
            )}

            {loading && <Loading />}
          </ScrollView>
        </View>
      </View>

      <Button style={styles.floatingButton} onPress={() => router.push({
        pathname: "/(main)/newConversation",
        params: { isGroup: selectedTab }
      })}>

        <Icons.PlusIcon color='black' weight='bold' size={verticalScale(24)} />
      </Button>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacingX._20,
    gap: spacingY._15,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._20
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: 'hidden',
    paddingHorizontal: spacingX._20
  },
  navBar: {
    flexDirection: 'row',
    gap: spacingX._15,
    alignItems: 'center',
    paddingHorizontal: spacingX._10
  },
  tabs: {
    flexDirection: 'row',
    gap: spacingX._10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabStyle: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius.full,
    backgroundColor: colors.neutral100
  },
  activeTabStyle: {
    backgroundColor: colors.primaryLight
  },
  conversationList: {
    paddingVertical: spacingY._20
  },
  settingIcon: {
    padding: spacingY._10,
    backgroundColor: colors.neutral700,
    borderRadius: radius.full
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: 'absolute',
    bottom: verticalScale(30),
    right: verticalScale(30)
  }
})
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import Avatar from '@/components/Avatar'
import * as ImagePicker from 'expo-image-picker';
import Input from '@/components/Input'
import Typo from '@/components/Type'
import { useAuth } from '@/contexts/authContext'
import Button from '@/components/Button'
import { verticalScale } from '@/utils/styling'
import { getContacts, newConversation } from '@/socket/socketEvent'
import { uploadFileToCloudinary } from '@/services/imageService'
import { green } from 'react-native-reanimated/lib/typescript/Colors'

const NewConversationalModal = () => {

    const { isGroup } = useLocalSearchParams()
    const isGroupMode = isGroup == '1'
    const router = useRouter()
    const [groupAvatar, setGroupAvatar] = useState<{ uri: string } | null>(null)
    const [groupName, setGroupName] = useState("")
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
    const { user: currentUser } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [contacts, setContacts] = useState([])

    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images',],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        // console.log(result);

        if (!result.canceled) {
            setGroupAvatar(result.assets[0]);
        }
    }

    useEffect(() => {
        getContacts(processGetContacts);
        newConversation(processNewConversation);
        getContacts(null)

        return () => {
            getContacts(processGetContacts, true)
            newConversation(processNewConversation, true);
        }
    }, [])

    const processNewConversation = (res: any) => {
        setIsLoading(false)
        console.log("new conversation result : ", res);
        if (res.success) {
            router.back();
            router.push({
                pathname: '/(main)/conversation',
                params: {
                    id: res.data._id,
                    name: res.data.name,
                    avatar: res.data.avatar,
                    type: res.data.type,
                    participants: JSON.stringify(res.data.participants),
                }
            })
        } else {
            console.log("Error fetching/creating conversation. ", res.msg)
            Alert.alert("Error", res.msg)
        }
    }

    const processGetContacts = (res: any) => {
        console.log("got contacts", res);

        if (res.success) {
            setContacts(res.data)
        }
    }

    const toggleParticipant = (user: any) => {
        setSelectedParticipants((prev: any) => {
            if (prev.includes(user.id)) {
                return prev.filter((id: string) => id != user.id)
            }
            return [...prev, user.id]
        })
    }

    const onSelectUser = (user: any) => {
        if (!currentUser) {
            Alert.alert("Authentication", "Please login to start a conversation")
            return;
        }

        if (isGroupMode) {
            toggleParticipant(user)
        } else {
            newConversation({
                type: "direct",
                participants: [currentUser.id, user.id]
            })
        }
    }

    const createGroup = async () => {
        if (!groupName.trim() || !currentUser || selectedParticipants.length < 2) {
            return;
        }

        setIsLoading(true);

        try {

            let avatar = null;
            if (groupAvatar) {
                const uploadResult = await uploadFileToCloudinary(groupAvatar, "group-avatars");
                if (uploadResult.success) avatar = uploadResult.data
            }

            newConversation({
                type : 'group',
                participants : [currentUser.id, ...selectedParticipants],
                name : groupName,
                avatar
            })
        } catch (error: any) {
            console.log("Error creating group", error);
            Alert.alert("Error", error.message);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ScreenWrapper isModal={true}>
            <View style={styles.container}>
                <Header title={isGroupMode ? 'New Group' : "Select User"} leftIcon={<BackButton color={colors.black} />} />

                {isGroupMode && (
                    <View style={styles.groupInfoContainer}>
                        <View style={styles.avatarContainer}>
                            <TouchableOpacity onPress={onPickImage}>
                                <Avatar uri={groupAvatar?.uri || null} size={100} isGroup={true} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.groupNameContainer}>
                            <Input placeholder='Group Name' value={groupName} onChangeText={setGroupName} />
                        </View>
                    </View>
                )}

                {isGroupMode && <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contactList}>
                    {contacts.map((user: any, index: number) => {
                        const isSelected = selectedParticipants.includes(user.id)
                        return (
                            <TouchableOpacity key={index} style={[styles.contactRow, isSelected && styles.selectedContact]} onPress={() => onSelectUser(user)}>
                                <Avatar size={45} uri={user.avatar} />
                                <Typo fontWeight={"500"}>{user.name}</Typo>
                                {isGroupMode && (
                                    <View style={styles.selectionIndicator}>
                                        <View style={[styles.checkbox, isSelected && styles.checked]} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>}

                {!isGroupMode && (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.contactList}
                    >
                        {contacts.map((contactUser: any) => {
                            if (currentUser?.id === contactUser.id) return null

                            const isSelected = selectedParticipants.includes(contactUser.id)

                            return (
                                <TouchableOpacity
                                    key={contactUser.id}
                                    style={[
                                        styles.contactRow,
                                        isSelected && styles.selectedContact,
                                    ]}
                                    onPress={() => onSelectUser(contactUser)}
                                >
                                    <Avatar size={45} uri={contactUser.avatar} />
                                    <Typo fontWeight={"500"}>{contactUser.name}</Typo>
                                </TouchableOpacity>
                            )
                        })}

                    </ScrollView>
                )}


                {isGroupMode && selectedParticipants.length >= 2 && (
                    <View style={styles.createGroupButton}>
                        <Button onPress={createGroup} disabled={!groupName.trim()} loading={isLoading}>
                            <Typo fontWeight={'bold'} size={17}>Create Group</Typo>
                        </Button>
                    </View>
                )}
            </View>
        </ScreenWrapper>
    )
}

export default NewConversationalModal

const styles = StyleSheet.create({
    container: {
        marginHorizontal: spacingX._15,
        flex: 1
    },
    groupInfoContainer: {
        alignItems: "center",
        marginTop: spacingY._10
    },
    avatarContainer: {
        marginBottom: spacingY._10
    },
    groupNameContainer: {
        width: '100%'
    },
    contactRow: {
        flexDirection: "row",
        alignItems: 'center',
        gap: spacingX._10,
        paddingVertical: spacingY._5
    },
    selectedContact: {
        backgroundColor: colors.neutral100,
        borderRadius: radius._15
    },
    contactList: {
        gap: spacingY._12,
        marginTop: spacingY._10,
        paddingTop: spacingY._10,
        paddingBottom: verticalScale(150)
    },
    selectionIndicator: {
        marginLeft: 'auto',
        marginRight: spacingX._10
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.primary
    },

    checked: {
        backgroundColor: colors.primary
    },
    createGroupButton: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacingX._15,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.neutral200
    }
})
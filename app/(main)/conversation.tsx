import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Type'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useLocalSearchParams } from 'expo-router'
import { useAuth } from '@/contexts/authContext'
import { scale, verticalScale } from '@/utils/styling'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import Avatar from '@/components/Avatar'
import * as Icons from 'phosphor-react-native'
import MessageItem from '@/components/MessageItem'
import Input from '@/components/Input'
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image'
import Loading from '@/components/Loading'
import { uploadFileToCloudinary } from '@/services/imageService'

const Conversation = () => {
    const { user: currentUser } = useAuth()
    const { id: conversationId, name, participants: stringifiedParticipants, avatar, type } = useLocalSearchParams();
    const [message, setMessage] = useState("")
    const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(null)
    const [loading, setLoading] = useState(false)

    const participants = JSON.parse(stringifiedParticipants as string);

    let conversationAvatar = avatar;
    let isDirect = type == 'direct';
    const otherParticipant = isDirect ? participants.find((p: any) => p._id != currentUser?.id) : null;

    if (isDirect && otherParticipant) {
        conversationAvatar = otherParticipant.avatar
    }

    let conversationName = isDirect ? otherParticipant.name : name

    const onPickFile = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images',],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        // console.log(result);

        if (!result.canceled) {
            setSelectedFile(result.assets[0]);
        }
    }

    const onSend = async () => {
        if (!message.trim() && !selectedFile) return;
        if (!currentUser) return;

        setLoading(true)
        try {
            let attachment = null;

            if (selectedFile) {
                const uploadResult = await uploadFileToCloudinary(selectedFile, "message-attachements")

                if (uploadResult.success) {
                    attachment = uploadResult.data
                } else {
                    setLoading(false);
                    Alert.alert("Error","Could not send the image!")
                }
            }
        } catch (error: any) {
            console.log("Error sending message: ", error);
            Alert.alert("Error", "Failed to send message")
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScreenWrapper showPattern={true} bgOpacity={0.5}>
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} style={styles.container}>

                <Header style={styles.header} leftIcon={<View style={styles.headerLeft}><BackButton />
                    <Avatar size={40} uri={conversationAvatar as string} isGroup={type == 'group'} />
                    <Typo color={colors.white} fontWeight={'500'} size={22}>{conversationName}</Typo></View>}
                    rightIcon={<TouchableOpacity style={{ marginBottom: verticalScale(7) }}>
                        <Icons.DotsThreeOutlineVerticalIcon weight='fill' color={colors.white} />
                    </TouchableOpacity>} />

                {/* message  */}

                <View style={styles.content} >
                    <FlatList data={null} inverted contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <MessageItem item={item} isDirect={isDirect} />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                    <View style={styles.footer}>
                        <Input value={message} onChangeText={setMessage} placeholder='Type Message' icon={
                            <TouchableOpacity style={styles.inputIcon} onPress={onPickFile}>
                                <Icons.PlusIcon color={colors.black} weight='bold' size={verticalScale(22)} />
                                {selectedFile && selectedFile.uri && (
                                    <Image source={selectedFile.uri} style={styles.selectedFile} />
                                )}
                            </TouchableOpacity>
                        }
                            containerStyle={{ paddingLeft: spacingX._10, paddingRight: scale(65), borderWidth: 0 }} />

                        <View style={styles.inputRightIcon} >
                            <TouchableOpacity style={styles.inputIcon} onPress={onSend}>
                                {loading ? (<Loading size={'small'} color={colors.black} />) : (
                                    <Icons.PaperPlaneTiltIcon color='black' weight='fill' size={verticalScale(22)} />)}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    )
}

export default Conversation

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        paddingHorizontal: spacingX._15,
        paddingTop: spacingY._10,
        paddingBottom: spacingY._15
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingX._12
    },
    inputRightIcon: {
        position: 'absolute',
        right: scale(10),
        top: verticalScale(15),
        paddingLeft: spacingX._12,
        borderLeftWidth: 1.5,
        borderLeftColor: colors.neutral300
    },
    selectedFile: {
        position: "absolute",
        height: verticalScale(38),
        width: verticalScale(38),
        borderRadius: radius.full,
        alignSelf: 'center'
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        borderCurve: "continuous",
        overflow: "hidden",
        paddingHorizontal: spacingX._15
    },
    inputIcon: {
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        padding: 8
    },
    footer: {
        paddingTop: spacingY._7,
        paddingBottom: verticalScale(22)
    },
    messageContainer: {
        flex: 1
    },
    messagesContent: {
        paddingTop: spacingY._20,
        paddingBottom: spacingY._10,
        gap: spacingY._12
    },
    plusIcon: {
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        padding: 8
    }
})
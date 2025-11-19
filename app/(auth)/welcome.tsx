import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Type'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Animated, { FadeIn } from 'react-native-reanimated'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'

const welcome = () => {
    const router = useRouter()
    return (
        <ScreenWrapper showPattern bgOpacity={0.8}>
            <View style={style.container} >
                <View style={{alignItems : 'center'}}>
                    <Typo color={colors.white} size={43} fontWeight={"900"}>
                        Bubbly
                    </Typo>
                </View>

                <Animated.Image entering={FadeIn.duration(700).springify()} source={require('../../assets/images/drive-download/welcome.png')}
                 style={style.welcomeImage} resizeMode={"contain"}/>

                 <View>
                    <Typo color={colors.white} size={33}  fontWeight={'800'}>
                        Stay Connected 
                    </Typo>
                    <Typo color={colors.white} size={33} fontWeight={'800'}>
                        with your friends
                    </Typo>
                    <Typo color={colors.white} size={33} fontWeight={'800'}>
                        and family 
                    </Typo>
                 </View>

                 <Button style={{backgroundColor : colors.white}} onPress={() => router.push('/(auth)/login')}>
                    <Typo size={23} fontWeight={'bold'}>Get Started</Typo>
                 </Button>
            </View>
        </ScreenWrapper>
    )
}

export default welcome

const style = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'space-around',
        paddingHorizontal : spacingX._20,
        marginVertical : spacingY._10
    },
    background : {
        flex : 1,
        backgroundColor : colors.neutral900
    },
    welcomeImage : {
        height : verticalScale(300),
        aspectRatio : 1,
        alignSelf : 'center'
    }
})
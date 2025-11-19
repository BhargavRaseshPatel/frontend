import { API_URL } from '@/constants'
import axios from 'axios'

export const login = async (email: string, password: string): Promise<{ token: string }> => {
    try {

        const response = await axios.post(`${API_URL}/auth/login`, {
            email, password
        })
        return response.data

    } catch (error: any) {
        console.log("Login Error Frontend", error)
        const msg = error?.response?.data?.msg || "Login Failed"
        throw new Error(msg)
    }
}

export const register = async (email: string, password: string, name: string, avatar?: string): Promise<{ token: string }> => {
    try {

        const response = await axios.post(`${API_URL}/auth/register`, {
            email, password, name, avatar
        })
        return response.data

    } catch (error: any) {
        console.log("Register Error Frontend", error)
        const msg = error?.response?.data?.msg || "Login Failed"
        throw new Error(msg)
    }
} 
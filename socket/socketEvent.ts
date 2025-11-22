import { getSocket } from "./socket"

export const testSocket = (paylaod: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {
        console.log("Socket is not connected")
        return;
    }

    if (off) {
        // turn off listening to this event
        socket.off("testSocket", paylaod) // payload is the callback
    } else if (typeof paylaod == 'function') {
        socket.on("testSocket", paylaod) // payload as callback for this event
    } else {
        socket.emit("testSocket", paylaod) // sending payload as data
    }
}

export const updateProfile = (paylaod: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {
        console.log("Socket is not connected")
        return;
    }

    if (off) {
        // turn off listening to this event
        socket.off("updateProfile", paylaod) // payload is the callback
    } else if (typeof paylaod == 'function') {
        socket.on("updateProfile", paylaod) // payload as callback for this event
    } else {
        socket.emit("updateProfile", paylaod) // sending payload as data
    }
}

export const getContacts = (paylaod: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {
        console.log("Socket is not connected")
        return;
    }

    if (off) {
        // turn off listening to this event
        socket.off("getContacts", paylaod) // payload is the callback
    } else if (typeof paylaod == 'function') {
        socket.on("getContacts", paylaod) // payload as callback for this event
    } else {
        socket.emit("getContacts", paylaod) // sending payload as data
    }
}

export const newConversation = (paylaod: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {
        console.log("Socket is not connected")
        return;
    }

    if (off) {
        // turn off listening to this event
        socket.off("newConversation", paylaod) // payload is the callback
    } else if (typeof paylaod == 'function') {
        socket.on("newConversation", paylaod) // payload as callback for this event
    } else {
        socket.emit("newConversation", paylaod) // sending payload as data
    }
}

export const getConversations = (paylaod: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {
        console.log("Socket is not connected")
        return;
    }

    if (off) {
        // turn off listening to this event
        socket.off("getConversations", paylaod) // payload is the callback
    } else if (typeof paylaod == 'function') {
        socket.on("getConversations", paylaod) // payload as callback for this event
    } else {
        socket.emit("getConversations", paylaod) // sending payload as data
    }
}
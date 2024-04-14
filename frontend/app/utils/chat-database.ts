
import localforage from "localforage";

export interface Chat {
    id: string;
    title: string;
}


export const chatDatabase = localforage.createInstance({
    name: "KodeRumahDB", 
    storeName: "chats",
    description: "Chat database",
    driver: [
        localforage.INDEXEDDB,
        localforage.LOCALSTORAGE,
    ],
});

export async function addChat(chat: Chat) {
    await chatDatabase.setItem(chat.id, chat.title);
}

export async function removeChat(chatId: string) {
    await chatDatabase.removeItem(chatId);
}

export async function renameChat(chatId: string, title: string) {
    await chatDatabase.setItem(chatId, title);
}

export async function getChat(chatId: string) {
    try {
        return await chatDatabase.getItem(chatId);
    } catch (error) {
        return null;
    } 
}

export async function getChats() {
    const keys = await chatDatabase.keys();
    const chats: Chat[] = [];
    for (const key of keys) {
        chats.push({ id: key, title: await chatDatabase.getItem(key) ?? "" });
    }
    return chats;
}

export async function seedChats() {
    await addChat({ id: "9f50c0b1-27e3-4cd8-b2ef-f08513d80388", title: "Rumah di Jakarta" });
    await addChat({ id: "096a178c-516f-4dc7-86a0-c263ddb4243d", title: "Conversation 3" });
}
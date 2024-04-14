const baseUrl = 'https://rumah-backend.fahminlb338482.workers.dev';

const apiUrl = '/chat/sessions';
const apiCompletionUrl = '/chat/completion';

export interface Chat {
    id: string;
    role: string;
    content: string;
    createdAt: string;
    imageUrl?: string;
    houses: {
        id: string;
        price: string;
        address: string;
        content: string;
        images: string[];
    }[];
}



const getChatSession = async (id: string) => {
    const url = new URL(`${apiUrl}/${id}`, baseUrl);
    const response = await fetch(url, {
        method: 'GET'
    }).then(res => res.json<Chat[]>());
    return response;
};

const newChatSession = async () => {
    const url = new URL(`${apiUrl}`, baseUrl);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: "Conversation - " + new Date().toISOString()
        })
    });
    return response.json();
};


const sendMessages = async (id: string, message: string) => {
    const url = new URL(`${apiCompletionUrl}/${id}/text`, baseUrl);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: message
        })
    });
    return response.json();
};

const sendAttachment = async (id: string, attachment: File) => {
    const url = new URL(`${apiCompletionUrl}/${id}/image`, baseUrl); 
    console.log("Sending attachment");
    const buffer = await attachment.arrayBuffer();
    console.log("Buffer length: ", buffer.byteLength);
    
    const response = await fetch(url, {
        method: 'POST',
        body: buffer
    }).then(res => res.json());


    return response;
};

export { getChatSession, newChatSession, sendMessages, sendAttachment };
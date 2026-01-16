import {StreamChat} from "stream-chat"
import "dotenv/config"

const apikey=process.env.STREAM_API_KEY
const apisecret=process.env.STREAM_API_SECRET

if(!apikey||!apisecret){
    console.log("Stream API or Secret is Missing")
}

const streamClient=StreamChat.getInstance(apikey,apisecret)

export const upsertStreamUser=async (userData)=>{
    try {
        await streamClient.upsertUsers([userData])
        return userData
    } catch (error) {
        console.log("Error upserting Stream User",error)
    }
}


export const generateStreamToken=(userId)=>{
    try {
        const userIdStr=userId.toString();
        return streamClient.createToken(userIdStr)

    } catch (error) {
        console.log("Error Generating stream token",error)
        
    }
}
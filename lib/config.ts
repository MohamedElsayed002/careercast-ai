import OpenAI from "openai";
import {createOpenAI} from "@ai-sdk/openai"


export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export const openaiVercel =  createOpenAI({
    apiKey: process.env.OPENAI_API_KEY
})
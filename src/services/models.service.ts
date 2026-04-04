import {ChatGoogle} from '@langchain/google';
import { ChatMistralAI, MistralAI } from '@langchain/mistralai';
import { ChatCohere } from '@langchain/cohere';
import config from "../config/config.js"

export const geminiModel = new ChatGoogle({
    model:"gemini-2.5-flesh",
    apiKey: config.GOOGLE_API_KEY,
});

export const mistralModel = new MistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRAL_API_KEY,
});

export const cohereModel = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: config.COHERE_API_KEY
})
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

export const sendSlackMessage = async (message: string) => {
    const url = process.env.SLACK_WEBHOOK_URL;
    if (!url) {
        throw new Error("SLACK_WEBHOOK_URL is not defined");
    }
    const response = await axios.post(url, { text: message });
    return response;
}

export const sendLowLiquidityAlert = async (token: string, liquidity: number, explorerUrl: string, chain: string) => {
    const url = process.env.SLACK_WEBHOOK_URL;
    if (!url) {
        throw new Error("SLACK_WEBHOOK_URL is not defined");
    }
    const response = await axios.post(url, {
        blocks: [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Low Liquidity Alert!",
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*Chain:*\n${chain}`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `*Token:*\n${token}`
                    }
                ]
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*Available Liquidity:*\n${liquidity}`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `*Contract:*\n<${explorerUrl}|OriginalTokenBridge>`
                    }
                ]
            }
        ]
    });
    return response;
}
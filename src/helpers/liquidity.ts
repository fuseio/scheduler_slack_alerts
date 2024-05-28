import { appConfig } from "../config/config";
import { insertRowsAsStream } from "./gcloud";
import { sendLowLiquidityAlert, sendSlackMessage } from "./slack";
import { BigQueryDate } from "@google-cloud/bigquery";
import { getERC20Balance, getERC20TotalSupply } from "./erc20";
import dotenv from 'dotenv';
dotenv.config();

const WETH_MIN_LIQUIDITY = parseInt(process.env.WETH_MIN_LIQUIDITY || "1");
const USDC_MIN_LIQUIDITY = parseInt(process.env.USDC_MIN_LIQUIDITY || "1");
const USDT_MIN_LIQUIDITY = parseInt(process.env.USDT_MIN_LIQUIDITY || "1");
const FDM_MIN_LIQUIDITY = parseInt(process.env.FDM_MIN_LIQUIDITY || "50000");
const BNB_MIN_LIQUIDITY = parseInt(process.env.BNB_MIN_LIQUIDITY || "5");

export const getTotalSupply = async (date: BigQueryDate) => {
    let rowsToInsert = []
    for (let i = 0; i < appConfig.wrappedBridge.fuse.tokens.length; i++) {
        let token = appConfig.wrappedBridge.fuse.tokens[i]
        if (token.symbol == "FUSE") continue;
        let res = await getERC20TotalSupply(
            token.address,
            "https://rpc.fuse.io",
            token.decimals
        );
        rowsToInsert.push({
            token: token.symbol,
            total_supply: parseFloat(res).toFixed(4),
            date: date,
        })
    }
    insertRowsAsStream(
        rowsToInsert,
        "fuse_bridge_analytics",
        "total_supply_hourly"
    );
}

export const getBridgeLiquidity = async (date: BigQueryDate) => {
    let rowsToInsert = []
    for (let i = 0; i < appConfig.wrappedBridge.chains.length; i++) {
        let chain = appConfig.wrappedBridge.chains[i]
        for (let j = 0; j < chain.tokens.length; j++) {
            let token = chain.tokens[j]
            if (token.isNative && token.isBridged) {
                let res = await getERC20TotalSupply(
                    token.address,
                    chain.rpcUrl,
                    token.decimals
                );
                rowsToInsert.push({
                    token: token.symbol,
                    source_chain: "Fuse",
                    dest_chain: chain.name,
                    liquidity: parseFloat(res).toFixed(4),
                    date: date,
                })
            } else if (!token.isNative && !token.isBridged) {
                let res = await getERC20Balance(
                    token.address,
                    chain.original,
                    chain.rpcUrl,
                    token.decimals
                );
                checkLowLiquidity(token.symbol, parseFloat(res), chain.name, chain.explorerUrl, chain.original)
                rowsToInsert.push({
                    token: token.symbol,
                    source_chain: chain.name,
                    dest_chain: "Fuse",
                    liquidity: parseFloat(res).toFixed(4),
                    date: date,
                })
            }
        }
    }
    insertRowsAsStream(
        rowsToInsert,
        "fuse_bridge_analytics",
        "liquidity_hourly"
    );
};

const checkLowLiquidity = async (token: string, balance: number, chain: string, explorer: string, address: string) => {
    if (token == "WETH" && balance < WETH_MIN_LIQUIDITY) {
        sendLowLiquidityAlert(token, balance, `${explorer}address/${address}`, chain)
    }
    if (token == "USDC" && balance < USDC_MIN_LIQUIDITY) {
        sendLowLiquidityAlert(token, balance, `${explorer}address/${address}`, chain)
    }
    if (token == "USDT" && balance < USDT_MIN_LIQUIDITY) {
        sendLowLiquidityAlert(token, balance, `${explorer}address/${address}`, chain)
    }
    if (token == "FDM" && balance < FDM_MIN_LIQUIDITY) {
        sendLowLiquidityAlert(token, balance, `${explorer}address/${address}`, chain)
    }
    if (token == "BNB" && balance < BNB_MIN_LIQUIDITY) {
        sendLowLiquidityAlert(token, balance, `${explorer}address/${address}`, chain)
    }
}
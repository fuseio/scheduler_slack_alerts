import { voltageBridgeConfig } from "../config/voltage"
import { insertRowsAsStream } from "./gcloud";
import { BigQueryDate } from "@google-cloud/bigquery";
import { getERC20Balance, getERC20TotalSupply, getNativeBalance } from "./erc20";
import dotenv from 'dotenv';
dotenv.config();

export const getVoltageBridgeLiquidity = async (date: BigQueryDate) => {
    let rowsToInsert = []
    for (let i = 0; i < voltageBridgeConfig.length; i++) {
        const chain = voltageBridgeConfig[i]
        for (let j = 0; j < chain.bridges.length; j++) {
            const bridge = chain.bridges[j]
            for (let k = 0; k < bridge.tokens.length; k++) {
                const token = bridge.tokens[k]
                if (token.isNative) {
                    const res = await getNativeBalance(bridge.address, chain.rpc, token.decimals)
                    rowsToInsert.push({
                        token: token.symbol,
                        source_chain: chain.chain,
                        dest_chain: "Fuse",
                        liquidity: parseFloat(res).toFixed(4),
                        date: date,
                    })
                }
                else {
                    const res = await getERC20Balance(
                        bridge.tokens[k].address,
                        bridge.address,
                        chain.rpc,
                        bridge.tokens[k].decimals
                    );
                    rowsToInsert.push({
                        token: token.symbol,
                        source_chain: chain.chain,
                        dest_chain: "Fuse",
                        liquidity: parseFloat(res).toFixed(4),
                        date: date,
                    })
                }

            }
        }
    }
    insertRowsAsStream(
        rowsToInsert,
        "voltage_bridge",
        "liquidity_hourly"
    );
};
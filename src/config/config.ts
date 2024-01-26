import { chains } from "./chains";
import { coins } from "./coins";
import { bridgeConfig } from "./bridge";

const createAppConfig = (bridgeConfig: { tokens: any[]; fuse: { chainId: any; wrapped: any; }; version: any; original: any[]; wrapped: any[]; originalFuse: any[]; }, chainConfig: { chains: any; }, tokenConfig: { coins: any; }) => {
    let wrappedTokens: any[] = [];
    if (bridgeConfig.tokens.length > 0) {
        tokenConfig.coins.forEach((coin: { symbol: any; icon: any; }) => {
            const token = bridgeConfig.tokens
                .find((token: { symbol: any; }[]) => token[0].symbol === coin.symbol)
                ?.find((token: { chainId: any; }) => token.chainId === bridgeConfig.fuse.chainId);
            if (token) {
                wrappedTokens.push({
                    ...token,
                    icon: coin.icon,
                });
            }
        });
    }
    return {
        wrappedBridge: {
            version: bridgeConfig.version,
            fuse: {
                lzChainId: bridgeConfig.fuse.chainId,
                wrapped: bridgeConfig.fuse.wrapped,
                tokens: wrappedTokens,
            },
            chains: chainConfig.chains.map((chain: { lzChainId: any; chainId: any; chainName: any; icon: any; rpc: any; unmarshallName: any; explorerUrl: string }) => {
                let tokens: { address: any; decimals: any; name: any; symbol: any; icon: any; isNative: any; isBridged: any; coinGeckoId: any; }[] = [];
                if (bridgeConfig.tokens.length > 0) {
                    tokenConfig.coins.forEach((coin: { symbol: any; icon: any; coinGeckoId: any; }) => {
                        const token = bridgeConfig.tokens
                            .find((token: { symbol: any; }[]) => token[0].symbol === coin.symbol)
                            ?.find((token: { chainId: any; }) => token.chainId === chain.lzChainId);
                        if (token) {
                            tokens.push({
                                address: token.address,
                                decimals: token.decimals,
                                name: token.name,
                                symbol: token.symbol,
                                icon: coin.icon,
                                isNative: token.isNative,
                                isBridged: token.isBridged,
                                coinGeckoId: coin.coinGeckoId,
                            });
                        }
                    });
                }
                return {
                    chainId: chain.chainId,
                    lzChainId: chain.lzChainId,
                    name: chain.chainName,
                    icon: chain.icon,
                    original: bridgeConfig.original.find(
                        (bridge: { chainId: any; }) => bridge.chainId === chain.lzChainId
                    )?.address,
                    wrapped: bridgeConfig.wrapped.find(
                        (bridge: { chainId: any; }) => bridge.chainId === chain.lzChainId
                    )?.address,
                    originalFuse: bridgeConfig.originalFuse.find(
                        (bridge: { chainId: any; }) => bridge.chainId === chain.lzChainId
                    )?.address,
                    tokens: tokens,
                    rpcUrl: chain.rpc,
                    unmarshallName: chain.unmarshallName,
                    explorerUrl: chain.explorerUrl,
                };
            }),
        },
    };
};

const createCoinConfig = (config: any) => {
    return {
        coins: config,
    };
};

const createChainConfig = (config: any) => {
    return {
        chains: config,
    };
};

const chainConfig = createChainConfig(chains);
const coinConfig = createCoinConfig(coins);
export const appConfig = createAppConfig(bridgeConfig, chainConfig, coinConfig);

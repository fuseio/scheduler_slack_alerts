import { ethers } from "ethers";
import { ERC20ABI } from "../abi/ERC20";

const getERC20ContractWithoutSigner = (address: string, rpcUrl: string) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(address, ERC20ABI, provider);
  return contract;
};

export const getERC20Balance = async (contractAddress: string, address: string, rpcUrl: string, decimals: number) => {
  const contract = getERC20ContractWithoutSigner(contractAddress, rpcUrl);
  const balance = await contract.balanceOf(address);
  return ethers.utils.formatUnits(balance, decimals);
};

export const getERC20TotalSupply = async (contractAddress: string, rpcUrl: string, decimals: number) => {
  const contract = getERC20ContractWithoutSigner(contractAddress, rpcUrl);
  const totalSupply = await contract.totalSupply();
  return ethers.utils.formatUnits(totalSupply, decimals);
};

export const getNativeBalance = async (address: string, rpcUrl: string, decimals: number) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const balance = await provider.getBalance(address)
  return ethers.utils.formatUnits(balance, decimals);
}

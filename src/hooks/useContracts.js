import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";

import {
  TOKEN_CONTRACT_ADDRESS,
  PRESALE_CONTRACT_ADDRESS,
  TOKEN_ABI,
  PRESALE_ABI,
} from "../contracts/contract";

function useContract() {
  const { walletProvider } = useWeb3ModalProvider();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const getProvider = () => {
    return new BrowserProvider(walletProvider);
  };
  const getSigner = async (provider) => {
    return provider.getSigner();
  };

  const getContract = async (address, abi, signer) => {
    const contract = new Contract(address, abi, signer);
    return contract;
  };

  const buy = async (amount, myRef) => {
    const provider = getProvider();
    const signer = await getSigner(provider);
    // print singer address
    const contract = await getContract(
      PRESALE_CONTRACT_ADDRESS,
      PRESALE_ABI,
      signer
    );
    if (!myRef || myRef === "") {
      myRef = "0x0000000000000000000000000000000000000000";
    }
    const transaction = await contract.buyFromNative(myRef, {
      value: parseUnits(amount.toString(), 18),
    });
    const receipt = await transaction.wait();
    return receipt;
  };

  const getStage = async () => {
    const provider = getProvider();
    const signer = await getSigner(provider);
    // print singer address
    const contract = await getContract(
      PRESALE_CONTRACT_ADDRESS,
      PRESALE_ABI,
      signer
    );

    const _stage = Number(await contract.currentStage());

    let price = 0;
    let totalSold = 0;
    let stageLimit = 0;
    if (_stage == 1) {
      price = Number(await contract.rateStage1BNB());
      totalSold = formatUnits(await contract.tokenSolds1());
      stageLimit = formatUnits(await contract.super_early_birds());
    } else if (_stage == 2) {
      price = Number(await contract.rateStage2BNB());
      totalSold = formatUnits(await contract.tokenSolds2());
      stageLimit = formatUnits(await contract.very_early_birds());
    } else if (_stage == 3) {
      price = Number(await contract.rateStage3BNB());
      totalSold = formatUnits(await contract.tokenSolds3());
      stageLimit = formatUnits(await contract.early_birds());
    } else if (_stage == 4) {
      price = Number(await contract.rateStage4BNB());
      totalSold = formatUnits(await contract.tokenSolds4());
      stageLimit = formatUnits(await contract.presale_stage());
    } else if (_stage == 5) {
      price = Number(await contract.rateStage5BNB());
      totalSold = formatUnits(await contract.tokenSolds4());
      stageLimit = formatUnits(await contract.final_presale_stage());
    }
    const min = formatUnits(await contract.minPurchaseAmount());

    console.log(totalSold, stageLimit);
    console.log((totalSold * 100) / stageLimit);
    return { state: _stage, price, min, totalSold, stageLimit };
  };

  const getData = async () => {
    // console.log(address);
    const provider = getProvider();
    const signer = await getSigner(provider);
    const token = await getContract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI, signer);
    const balance = await token.balanceOf(address);
    const balanceInEth = formatUnits(balance, 18);
    // console.log(balanceInEth);
    // contract token balance
    const contractBalanceInEth = await token.balanceOf(
      PRESALE_CONTRACT_ADDRESS
    );
    const contractBalance = formatUnits(contractBalanceInEth, 18);
    return {
      balanceInEth,
      contractBalance,
    };
  };

  return { buy, getData, getStage };
}

export default useContract;

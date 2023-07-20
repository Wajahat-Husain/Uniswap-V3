import React, { useState } from 'react'
import { Contract } from 'ethers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import singleSwap from '../config/singleSwap.json'
import token from '../config/token.json'

const SwapToken = ({ userInfo, etherObj }) => {
    const [exchangeAmount, setExchangeAmount] = useState("");
    const [receiveAmount, setReceiveAmount] = useState(0);


    const exchangeAmountValue = (e) => {
        setExchangeAmount(e.target.value);
        const amount = e.target.value * 0.000330371063278209;
        setReceiveAmount(amount);
    }


    const exchangeToken = async (e) => {

        try {
            e.preventDefault();
            console.log(etherObj)
            console.log(singleSwap.contractAddress, exchangeAmount)
            let exchangeTokenContract = new Contract(token.link_contract_address, token.abi, etherObj)
            let decimal = await exchangeTokenContract.decimals();
            console.log('Decimal : ', decimal)
            let exchange_Amount = (parseInt(exchangeAmount) + "0".repeat(parseInt(decimal))).toString();
            console.log("Exchange Amount : ", exchange_Amount);

            let approveTx = await exchangeTokenContract.approve(singleSwap.contractAddress, exchange_Amount);
            approveTx = await approveTx.wait()
            console.log(approveTx)

            let link = `https://goerli.etherscan.io/tx/${approveTx.hash}`; 

            let notificationContent = (
              <div>
                🦄 Approve token success: 
                <a href={link} target="_blank" rel="noopener noreferrer">
                🔗View on block explorer
                </a>
              </div>
            );

            toast.success(notificationContent, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });


            let swapContract = new Contract(singleSwap.contractAddress, singleSwap.abi, etherObj)
            let swapTx = await swapContract.swapExactInputSingle(exchange_Amount);
            swapTx = await swapTx.wait()
            console.log(swapTx)

            link = `https://goerli.etherscan.io/tx/${swapTx.hash}`; 
            
            notificationContent = (
              <div>
                🦄 Swap token success:   
                <a href={link} target="_blank" rel="noopener noreferrer">
                🔗View on block explorer
                </a>
              </div>
            );


            toast.success(notificationContent, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            // let receiveTokenContract = new Contract(token.weth_contract_address, token.abi, etherObj)
            // decimal = await receiveTokenContract.decimals();
            // console.log('Decimal : ', decimal)
            // let amount = parseInt(1 + "0".repeat(parseInt(decimal)));
            //  let receive_amount = receiveAmount*amount; 
            // console.log("receive Amount : ", receive_amount);

            // let outTx = await swapContract.swapExactOutputSingle(receive_amount, exchange_Amount);
            // outTx = await outTx.wait()
            // console.log(outTx)
            // alert(outTx.hash);


            setExchangeAmount("");
            setReceiveAmount(0);




        } catch (e) {
            console.log(e.message)
            toast.warn('Error: Something went wrong', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        }

    }

    return (
        <div class="swap-card absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
            <div class="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">

                <div class="p-4">

                    <a href="#" class="flex  gap-x-2.5 p-3 font-semibold text-gray-900">
                        Swap | Buy
                    </a>

                    <div>
                        <div class="relative mt-2 rounded-md shadow-sm">
                            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            </div>
                            <input type="number" name="price" id="price" value={exchangeAmount} onChange={exchangeAmountValue} class="block w-full rounded-md border-0 py-1.5 pl-5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            <div class="absolute inset-y-0 right-0 flex items-center">
                                <label for="currency" class="sr-only">Currency</label>
                                <select id="currency" name="currency" class="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-5 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                                    <option>LINK</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="swap-images grid grid-cols-1 divide-x divide-gray-900/5  ">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAY AAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nO2VXQqCQBSFP/C9bC3RGlpBgdCDK3AdtZjERQi+9FIbcBWB/YAxcIRhKP/KKPDAgNeR8829w73CH8gD/KHMJ0AKXIBgCPMMKLXuwKaLga/025jbkFaZLIArEDeYG8NCz+cukFAf50/2do5RrjiywOZOpn0BS+AIrBRXgFDZJcC+pryNAFc2oLVGQKPGEn2/RJ7GQqJmcQFr4KQm6wXw1d6l2j2yAIHGgom3fQE4RtXgKqx3mbJzFetw8yaAC7FX9sK8Km/tYHNlhtjNMj8AMz6sQGmnNSd/W3V/tN/RAw8WdAigsui2AAAAAElFTkSuQmCC" />
                    </div>

                    <div>
                        <div class="relative mt-2 rounded-md shadow-sm">
                            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            </div>
                            <input type="number" name="price" id="price" class="block w-full rounded-md border-0 py-1.5 pl-5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder={receiveAmount} />
                            <div class="absolute inset-y-1 right-0 flex items-center">
                                <label for="currency" class="sr-only">Currency</label>
                                <select id="currency" name="currency" class="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-5 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                                    <option>WETH</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                    <a href="#" onClick={exchangeToken} class="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-secondary">
                        Swap Token
                    </a>
                </div>

            </div>
        </div>
    )
}

export default SwapToken
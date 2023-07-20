import React, { useState, useEffect } from 'react'
import { ethers } from "ethers";

const ConnectWallet = ({ userInfoValue, etherObjValue }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [etherObj, setEtherObj] = useState({});

    /************************************** onRefresh disconnect the Network **********************/

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("chainChanged", () => {
                onDisconnect();
            });
            window.ethereum.on("accountsChanged", () => {
                onDisconnect();
                onConnect();
            });
        }

        async function checkConnectedWallet() {
            const userData = JSON.parse(localStorage.getItem("userAccount"));
            const objData = JSON.parse(localStorage.getItem("userAccount"));
            if (userData !== null && objData !== null ) {
                await onConnect();
            }
            else {
                await switchNetwork();
                await onConnect();
            }
        }

        checkConnectedWallet();
    }, []);

    /************************************** detecting current provider ****************************/

    const detectCurrentProvider = () => {

        let provider;
        if (window.ethereum) {
            provider = window.ethereum;
        } else if (window.web3) {
            // eslint-disable-next-line
            provider = window.web3.currentProvider;
        } else {
            console.log(
                'Non-Ethereum browser detected. You should consider trying MetaMask!'
            );
        }
        return provider;

    };

    /**************************************** Switching to Selected Network ***********************/

    const addNetwork = async () => {
        try {
            if (!window.ethereum) throw new Error("No crypto wallet found");
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        ...networksConfig['GoerliTestnet'],
                    },
                ],
            });
        } catch (err) {
            console.log(err.message);
        }
    };

    /******************************************** Supported Networks ******************************/

    const networksConfig = {
        GoerliTestnet: {
            chainId: `0x${Number(5).toString(16)}`,
            rpcUrls: ["https://goerli.infura.io/v3/"],
            chainName: "Goerli test network",
            nativeCurrency: {
                name: "GoerliETH",
                symbol: "GoerliETH",
                decimals: 18,
            },
            blockExplorerUrls: ["https://goerli.etherscan.io"],
        },

    };

    /************************************ Formating Connected Wallet Address **********************/

    const convertAddress = async (account) => {
        // WallatAddress length 42
        const addressmystring = account.slice(0, 6) + " ..... " + account.slice(38, account.length);
        return addressmystring;
    };

    /**************************************** Connecting to Metamask ******************************/

    const onConnect = async () => {
        try {
            const currentProvider = detectCurrentProvider();
            if (currentProvider) {
                if (currentProvider !== window.ethereum) {
                    console.log("MetaMask not installed, using read-only defaults");

                }
                let provider = new ethers.BrowserProvider(currentProvider);
                let { name, chainId } = await provider.getNetwork();
                console.log(chainId, name,  networksConfig.GoerliTestnet.chainId);

                if (`0x${Number(parseInt(5)).toString(16)}` ==  networksConfig.GoerliTestnet.chainId) {

                    console.log("Bravo!, you are on the correct network");
                    let signer = await provider.getSigner();
                    let account = await provider.send("eth_requestAccounts", []);
                    let ethBalance = await provider.getBalance(account[0]);
                    ethBalance = ethers.formatEther(ethBalance);

                    const shortAddress = await convertAddress(account[0]);
                    saveUserInfo(account[0], parseInt(chainId), ethBalance, shortAddress, signer);
                    console.log(account[0], parseInt(chainId), ethBalance, shortAddress, signer);

                } else {

                    await switchNetwork();

                }
            }
        } catch (err) {
            console.log("There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.");
            console.log(err);
        }
    };

    /**************************************** Switching Network ***********************************/

    const switchNetwork = async () => {

        console.log("Switch chainId : ", `0x${Number(parseInt(5)).toString(16)}`)
        try {

            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: `0x${Number(parseInt(5)).toString(16)}` }],
            });
            console.log(`Successfully switched to chain with ID 0x${Number(parseInt(5)).toString(16)}`);

        } catch (switchError) {

            if (switchError.code === 4001) {

                console.log('User rejected the chain switching request');

            } else if (switchError.message.includes('already pending')) {

                console.log('A chain switching request is already pending, please wait');

            } else if (switchError.code === 5902) {

                console.log("This network is not available in your metamask, please add it");
                try {
                    await addNetwork();
                } catch (error) {
                    console.log("Failed to switch to the network");
                    console.log(error)
                }

            } else {

                console.error(switchError);

            }

        }
        console.log("oulalal, switch to the correct network");

    }

    /**************************************** Disconnecting to Metamask ***************************/

    const onDisconnect = () => {
        window.localStorage.removeItem('userAccount');
        window.localStorage.removeItem('etherObj');
        setEtherObj({});
        setUserInfo({});
        setIsConnected(false);
        console.log("You are dissconnected !!");
    };

    /********************************* Saving Connected User Wallet address ***********************/

    const saveUserInfo = (account, chainId, ethBalance, shortAddress, etherObj) => {
        console.log("Hereeeee");
        
        console.log(account, chainId, ethBalance, shortAddress, etherObj)
        const userAccount = {
            account: account,
            connectionid: chainId,
            balance: ethBalance,
            shortaddress: shortAddress
        };
        window.localStorage.setItem('userAccount', JSON.stringify(userAccount)); //user persisted data

        const userData = JSON.parse(localStorage.getItem('userAccount'));

        setUserInfo(userData);
        setEtherObj(etherObj);
        setIsConnected(true);
    };

    const changeHandler = () => {
        userInfoValue(userInfo);
        etherObjValue(etherObj);
    }


    return (
        <>
            {isConnected ? 
                <button onClick={onDisconnect} onChange={changeHandler()} className="btn btn-outline btn-secondary">
                        {userInfo.shortaddress}
                </button>
            :
                <button onClick={onConnect} onChange={changeHandler()} className="btn btn-outline btn-secondary">
                    Connect Metamask
                </button>
            }
        </>
    )
}

export default ConnectWallet
import { useWeb3Contract } from "react-moralis";
import { abi, conractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

const LotteryEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const raffleAddress =
        chainId in conractAddresses ? conractAddresses[chainId][0] : null;

    const dispatch = useNotification();

    const [entranceFee, setEntranceFee] = useState("0");
    const [numPlayers, setNumPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    });

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    });

    const updateUi = async () => {
        const entranceFeeFromContranct = (await getEntranceFee()).toString();
        const numPlayersFromCall = (await getNumberOfPlayers()).toString();
        const rectntWinnerFromCall = await getRecentWinner();
        setRecentWinner(rectntWinnerFromCall);
        setNumPlayers(numPlayersFromCall);
        setEntranceFee(entranceFeeFromContranct);
    };

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi();
        }
    }, [isWeb3Enabled]);

    const handleSuccess = async (tx) => {
        await tx.wait(1);
        updateUi();
        handleNewNotification(tx);
    };

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx notification",
            position: "topR",
            icon: "bell",
        });
    };

    return (
        <div className="p-5">
            {raffleAddress ? (
                <div>
                    <button
                        className="px-4 py-2 ml-auto font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        onClick={async () => {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            });
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="w-8 h-8 border-b-2 rounded-full animate-spin spinner-border"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div>
                        {" "}
                        Here is entranceFee:{" "}
                        {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                    </div>
                    <div>Players: {numPlayers}</div>
                    <div> RecentWinner: {recentWinner}</div>
                </div>
            ) : (
                <div>No raffle address detected!</div>
            )}
        </div>
    );
};

export default LotteryEntrance;

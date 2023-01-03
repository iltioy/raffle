import { ConnectButton } from "web3uikit";

const Header = () => {
    return (
        <div className="flex flex-row p-5 border-b-2">
            <h1 className="px-4 py-4 text-3xl font-bold">
                Decentralized Lottery
            </h1>
            <div className="px-4 py-2 ml-auto">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    );
};

export default Header;

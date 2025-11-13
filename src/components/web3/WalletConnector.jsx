import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { usePersistedState } from "../../utils/Helpers";

export default function WalletConnector({
  isOpen,
  onClose,
  theme,
  walletAddress,
  setWalletAddress
}) {
  const [disconnected, setDisconnected] = usePersistedState("disconnected", false);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [hasProvider, setHasProvider] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!window.ethereum) return;
    setHasProvider(true);

    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0 && !disconnected) {
          const account = accounts[0];
          setWalletAddress(account);
          const chainId = await window.ethereum.request({ method: "eth_chainId" });
          setNetwork(chainId);
          const balanceWei = await window.ethereum.request({
            method: "eth_getBalance",
            params: [account, "latest"],
          });
          setBalance((parseInt(balanceWei, 16) / 1e18).toFixed(4));
          setStatus("Wallet connected");
        }
      } catch {
        setStatus("Connection check failed");
      }
    };

    checkConnection();

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setDisconnected(false);
        setStatus("Wallet connected");
      } else {
        setWalletAddress(null);
        setStatus("Wallet disconnected");
      }
    };

    const handleChainChanged = (chainId) => setNetwork(chainId);

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnected]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus("MetaMask not detected");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];
      setWalletAddress(account);
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      setNetwork(chainId);
      const balanceWei = await window.ethereum.request({
        method: "eth_getBalance",
        params: [account, "latest"],
      });
      setBalance((parseInt(balanceWei, 16) / 1e18).toFixed(4));
      setDisconnected(false);
      setStatus("Wallet connected");
    } catch {
      setStatus("Connection failed");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWalletAddress(null);
    setBalance(null);
    setNetwork(null);
    setDisconnected(true);
    setStatus("Disconnected");
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity`}
    >
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-xl border ${
          theme === "dark"
            ? "bg-gray-900 border-gray-800 text-gray-100"
            : "bg-white border-gray-200 text-gray-900"
        } p-6`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-2 text-primary-600">Connect Your Wallet</h2>
        <p className="text-sm text-gray-500 mb-6">
          Choose your preferred wallet and start investing in tokenized properties.
        </p>

        {!hasProvider ? (
          <div className="text-center bg-primary-50 dark:bg-gray-800 p-4 rounded-xl">
            <p className="text-primary-600 font-medium mb-2">MetaMask not detected</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Please install the MetaMask extension to continue.
            </p>
            <a
              href="https://metamask.io/download.html"
              target="_blank"
              rel="noreferrer"
              className="btn"
            >
              Install MetaMask
            </a>
          </div>
        ) : !walletAddress ? (
          <div className="flex justify-center">
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="btn flex items-center justify-center gap-2 px-6 py-3 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect MetaMask"
              )}
            </button>
          </div>
        ) : (
          <div className="text-sm">
            <div
              onClick={() => navigator.clipboard.writeText(walletAddress)}
              className={"cursor-pointer bg-primary-50 p-3 rounded-lg mb-4" + (theme == "dark" && " bg-gray-800")}
            >
              <p className="font-semibold text-primary-600 mb-1">Connected Wallet</p>
              <p className={"text-gray-600" + (theme == "dark" && " text-gray-400")}>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>
            <div className={"p-3 rounded-lg bg-gray-50 space-y-1" + (theme == "dark" && " bg-gray-800")}>
              <p>
                <strong>Network:</strong> {network}
              </p>
              <p>
                <strong>Balance:</strong> {balance} ETH
              </p>
            </div>
            <button
              onClick={disconnect}
              className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
            >
              Disconnect
            </button>
          </div>
        )}

        {status && (
          <p
            className={`text-xs text-center mt-4 ${
              status.includes("failed") || status.includes("Disconnected")
                ? "text-red-500"
                : "text-primary-500"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

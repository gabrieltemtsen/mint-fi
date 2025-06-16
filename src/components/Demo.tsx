"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { signIn, signOut, getCsrfToken } from "next-auth/react";
import sdk, { SignIn as SignInCore } from "@farcaster/frame-sdk";
import { useAccount, useSendTransaction, useSignMessage, useDisconnect, useConnect } from "wagmi";
import { config } from "~/components/providers/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { useSession } from "next-auth/react";
import { useMiniApp } from "@neynar/react";
import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { APP_NAME } from "~/lib/constants";

type Tab = 'home' | 'collections' | 'my-nfts' | 'wallet';

interface NFTCollection {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  remaining: number;
  total: number;
}

interface NFT {
  id: string;
  collectionId: string;
  name: string;
  image: string;
  mintDate: string;
}

export default function NFTMintingApp({ title = "NFT Minting" }: { title?: string }) {
  const { isSDKLoaded, context } = useMiniApp();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<NFTCollection | null>(null);
  const [myNFTs, setMyNFTs] = useState<NFT[]>([]);

  const { address, isConnected } = useAccount();

  // Mock collections data
  const collections: NFTCollection[] = useMemo(() => [
    {
      id: "1",
      name: "Purple Pixels",
      description: "Unique pixel art collectibles on Base",
      image: "https://i.imgur.com/Jpgs0tW.png",
      price: "0.001",
      remaining: 42,
      total: 100
    },
    {
      id: "2",
      name: "Farcaster Frens",
      description: "Exclusive Farcaster community NFTs",
      image: "https://i.imgur.com/5XZwV7q.png",
      price: "0.0025",
      remaining: 87,
      total: 150
    },
    {
      id: "3",
      name: "Degens Anonymous",
      description: "For those who ape responsibly",
      image: "https://i.imgur.com/8QZQZQZ.png",
      price: "0.005",
      remaining: 15,
      total: 50
    }
  ], []);

  // Mock function to fetch user's NFTs
  useEffect(() => {
    if (address) {
      // In a real app, you'd fetch this from your backend
      const mockNFTs: NFT[] = [
        {
          id: "101",
          collectionId: "1",
          name: "Purple Pixel #42",
          image: "https://i.imgur.com/Jpgs0tW.png",
          mintDate: "2023-10-15"
        },
        {
          id: "203",
          collectionId: "2",
          name: "Farcaster Fren #12",
          image: "https://i.imgur.com/5XZwV7q.png",
          mintDate: "2023-11-02"
        }
      ];
      setMyNFTs(mockNFTs);
    }
  }, [address]);

  const { sendTransaction, isPending: isSendTxPending } = useSendTransaction();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();

  const mintNFT = useCallback(async (collection: NFTCollection) => {
    if (!isConnected || !address) return;

    try {
      // In a real app, you'd call your smart contract here
      // This is just a mock transaction
      sendTransaction(
        {
          to: address, // Sending to self for demo
          value: BigInt(Math.floor(parseFloat(collection.price) * 1e18)),
          data: "0x" // Mock data
        },
        {
          onSuccess: (hash) => {
            setTxHash(hash);
            // Simulate successful mint
            setTimeout(() => {
              setMyNFTs(prev => [
                ...prev,
                {
                  id: `${collection.id}${Math.floor(Math.random() * 1000)}`,
                  collectionId: collection.id,
                  name: `${collection.name} #${Math.floor(Math.random() * 100)}`,
                  image: collection.image,
                  mintDate: new Date().toISOString().split('T')[0]
                }
              ]);
              setTxHash(null);
            }, 3000);
          },
        }
      );
    } catch (error) {
      console.error("Minting error:", error);
    }
  }, [isConnected, address, sendTransaction]);

  if (!isSDKLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="mx-auto py-2 px-4 pb-20">
        <Header />

        <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>

        {activeTab === 'home' && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
            <div className="text-center w-full max-w-md mx-auto">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl mb-6">
                <h2 className="text-xl font-bold mb-2">Welcome to {APP_NAME}</h2>
                <p className="text-sm">Mint exclusive NFTs directly from your favorite apps</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div 
                  className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900 transition"
                  onClick={() => setActiveTab('collections')}
                >
                  <div className="text-2xl mb-2">🖼️</div>
                  <p className="text-sm">Collections</p>
                </div>
                <div 
                  className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900 transition"
                  onClick={() => setActiveTab('my-nfts')}
                >
                  <div className="text-2xl mb-2">🎴</div>
                  <p className="text-sm">My NFTs</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-500">Powered by Farcaster & Base</p>
            </div>
          </div>
        )}

        {activeTab === 'collections' && (
          <div className="space-y-4 px-6">
            <h2 className="text-xl font-bold">Available Collections</h2>
            
            {selectedCollection ? (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                <button 
                  onClick={() => setSelectedCollection(null)}
                  className="mb-4 text-sm text-purple-500 hover:underline"
                >
                  ← Back to collections
                </button>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <img 
                    src={selectedCollection.image} 
                    alt={selectedCollection.name}
                    className="w-full md:w-1/2 h-auto rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{selectedCollection.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 my-2">
                      {selectedCollection.description}
                    </p>
                    
                    <div className="my-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Price:</span>
                        <span className="font-bold">{selectedCollection.price} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Remaining:</span>
                        <span className="font-bold">
                          {selectedCollection.remaining}/{selectedCollection.total}
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-purple-500 h-2.5 rounded-full" 
                        style={{ width: `${(selectedCollection.remaining / selectedCollection.total) * 100}%` }}
                      ></div>
                    </div>
                    
                    <Button 
                      onClick={() => mintNFT(selectedCollection)}
                      disabled={!isConnected || isSendTxPending}
                      isLoading={isSendTxPending || !!txHash}
                      className="w-full mt-6"
                    >
                      {txHash ? "Minting..." : "Mint NFT"}
                    </Button>
                    
                    {txHash && (
                      <div className="text-xs mt-2 text-center text-gray-500">
                        Transaction: {truncateAddress(txHash)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collections.map(collection => (
                  <div 
                    key={collection.id}
                    className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
                    onClick={() => setSelectedCollection(collection)}
                  >
                    <img 
                      src={collection.image} 
                      alt={collection.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold">{collection.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {collection.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-bold">{collection.price} ETH</span>
                        <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                          {collection.remaining} left
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-nfts' && (
          <div className="px-6">
            <h2 className="text-xl font-bold mb-4">My NFT Collection</h2>
            
            {!isConnected ? (
              <div className="text-center py-10">
                <p className="mb-4">Connect your wallet to view your NFTs</p>
                <Button onClick={() => connect({ connector: connectors[0] })}>
                  Connect Wallet
                </Button>
              </div>
            ) : myNFTs.length === 0 ? (
              <div className="text-center py-10">
                <p>You don't have any NFTs yet</p>
                <Button 
                  onClick={() => setActiveTab('collections')}
                  className="mt-4"
                >
                  Browse Collections
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {myNFTs.map(nft => (
                  <div key={nft.id} className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img 
                      src={nft.image} 
                      alt={nft.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-bold text-sm truncate">{nft.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Minted: {nft.mintDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-3 px-6 w-full max-w-md mx-auto">
            {address && (
              <div className="text-xs w-full">
                Address: <pre className="inline w-full">{truncateAddress(address)}</pre>
              </div>
            )}

            {isConnected ? (
              <Button
                onClick={() => disconnect()}
                className="w-full"
              >
                Disconnect
              </Button>
            ) : (
              <Button
                onClick={() => connect({ connector: connectors[0] })}
                className="w-full"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        )}

        <Footer activeTab={activeTab} setActiveTab={setActiveTab} showWallet={true} />
      </div>
    </div>
  );
}

function truncateAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
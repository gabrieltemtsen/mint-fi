# Minti-Fi NFT Minting App

A modern, minimal NFT minting app template built with Next.js, TypeScript, and Farcaster Frames V2 UI patterns.

## Features

- Explore NFT collections and mint onchain collectibles
- Simple, mobile-first UI/UX
- Tab navigation (Home, Collections, My NFTs, Context)
- Farcaster & Neynar Mini App integration ready
- Easily plug in your smart contract mint logic (Wagmi, Thirdweb, or custom)

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/gabrieltemtsen/mint-fi.git
cd minti-fi-nft-mint
```

### 2. Install dependencies
```bash
pnpm install # or yarn install or npm install
```

### 3. Run the app locally
```bash
pnpm dev # or yarn dev or npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
/components
  ├─ ui/
  │   ├─ Header.tsx
  │   └─ Footer.tsx
  └─ NftMintApp.tsx
/lib/
  └─ constants.ts
/pages
  └─ index.tsx
```

- **NftMintApp.tsx:** Main NFT minting logic & UI (copy/paste provided code)
- **Header/Footer:** Modern UI for navigation and user info

## Usage
- Explore available NFT collections
- Mint NFTs (simulated, replace logic with contract call as needed)
- View your minted NFTs under "My NFTs"
- See your Farcaster context under "Context" (for debugging)

## Customization
- **Collections:** Replace demo data with your own, or fetch from your backend/contract
- **Minting:** Swap `handleMint` for your contract logic (Wagmi, Thirdweb, or ethers.js)
- **Wallet Integration:** Add wallet connect with Wagmi/Thirdweb if needed
- **Styling:** Built for Tailwind, but easily adjustable

## Credits
- Powered by [Next.js](https://nextjs.org/), [Wagmi](https://wagmi.sh/), [Farcaster Frames](https://docs.framesjs.org/), and [Neynar](https://neynar.com/)
- UI/UX styled with Tailwind CSS

---

**Feel free to fork and hack!**

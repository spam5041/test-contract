// SolCoin Metadata API
const metadata = {
    name: "SolCoin",
    symbol: "SOL",
    network: "Solana",
    contractAddress: "CARDSccUMFKoPRZxt5vt3ksUbxEFEcnZ3H2pd3dKxYjp",
    totalSupply: "1000000000",
    currentPrice: "0.045",
    version: "1.0.0",
    createdDate: "2024-01-01",
    audit: "Verified",
    description: "Инновационная криптовалюта на блокчейне Solana",
    website: "https://solcoin.example.com",
    whitepaper: "https://solcoin.example.com/whitepaper.pdf"
};

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = metadata;
}

// Глобальная переменная для браузера
if (typeof window !== 'undefined') {
    window.SolCoinMetadata = metadata;
}

console.log("SolCoin Metadata loaded:", metadata);

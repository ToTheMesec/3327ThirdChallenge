const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"

const WETH_10 = "0xf4BB2e28688e89fCcE3c0580D37d36A7672E8A9F"

const DAI_WHALE = process.env.DAI_WHALE
const USDC_WHALE = process.env.USDC_WHALE
const USDT_WHALE = process.env.USDT_WHALE
const WETH_WHALE = process.env.WETH_WHALE
const WBTC_WHALE = process.env.WBTC_WHALE

// compound
const CDAI = "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643"
const CUSDC = "0x39AA39c021dfbaE8faC545936693aC917d5E7563"
const CWBTC = "0xccF4429DB6322D5C611ee964527D42E5d685DD6a"
const CETH = "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5"

const l2 = {
    "posRootERC20": "0x655F2166b0709cd575202630952D71E2bB0d61Af",
    "posChildERC20": "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1",
    "posWETH": "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa",
    "rootChainWETH": "0x60D4dB9b534EF9260a88b0BED6c486fe13E604Fc",
    "plasmaWETH": "0x4DfAe612aaCB5b448C12A591cD0879bFa2e51d62",
    "plasmaRootERC20": "0x3f152B63Ec5CA5831061B2DccFb29a874C317502",
    "plasmaChildERC20": "0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e",
    "MATIC_RPC": "https://rpc-mumbai.matic.today",
    "ETHEREUM_RPC": "https://goerli.infura.io/v3/10792650c88f4b4b9636a1ec6054ad74",
    "VERSION": "mumbai",
    "NETWORK": "testnet",
    "MATIC_CHAINID": 80001,
    "ETHEREUM_CHAINID": 5
}
module.exports = {
    DAI,
    USDC,
    USDT,
    WETH,
    WBTC,
    WETH_10,
    DAI_WHALE,
    USDC_WHALE,
    USDT_WHALE,
    WETH_WHALE,
    WBTC_WHALE,
    CDAI,
    CUSDC,
    CWBTC,
    CETH,
    l2
}
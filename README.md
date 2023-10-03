# Safe API Kit Plugin

This plugin facilitates the interaction with the Safe Transaction Service API using Polywrap. The Safe Transaction Service API provides functionalities for multi-signature transactions, ERC20 tokens information, Safe account histories, and more.

## Features:

1. **Get Service Information**: Retrieve configuration and information of the Safe Transaction Service.
2. **Master Copies**: Obtain a list of Safe master copies.
3. **Data Decoding**: Decode specific Safe transaction data.
4. **Safes Information**: Get safes based on owner or module addresses and retrieve all configuration and data related to a specific safe.
5. **Transactions**: Extract details, confirmations, propose new transactions, and get histories of different types of transactions (multi-signature, incoming, module).
6. **Delegates**: Manage (add, remove) and fetch Safe delegates.
7. **ERC20 Tokens**: Fetch a list of all ERC20 tokens and get details about a specific token.

## Types:

The SDK contains several types to structure the data. Some of the core types are:

- `SafeServiceInfoResponse`: Contains details like the service name, version, and API settings.
- `MasterCopyResponse`: Provides information about Safe master copies.
- `SafeInfoResponse`: Contains configuration and data of a specific safe.
- `SafeMultisigTransactionResponse`: Gives details of a multi-signature transaction.
- `SafeDelegateListResponse`: Offers a list of delegates and their information.
  ... [and more]

## Usage:

## Installation:

```bash
npm install @polywrap/safe-api-plugin
```

## Usage:

First, make sure you have installed and set up the necessary packages:

- `@polywrap/client-js`
- `@polywrap/client-config-builder-js`
- `ethers`
- `@safe-global/protocol-kit`

### Setup:

To set up the plugin with `PolywrapClient`, follow the steps:

```javascript
import { PolywrapClient } from "@polywrap/client-js";
import { PolywrapClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { Safe } from "../types"; // Ensure you import or define the required types
import { safeApiPlugin } from "@polywrap/safe-api-plugin";
import { ethers } from "ethers";
import { EthersAdapter } from "@safe-global/protocol-kit";

const provider = new ethers.providers.JsonRpcProvider("YOUR_INFURA_ENDPOINT");
const safeOwner = provider.getSigner(0);

const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: safeOwner,
});

const config = new PolywrapClientConfigBuilder()
  .setPackage(
    "plugin/safe-api-kit",
    safeApiPlugin({
      txServiceUrl: "https://safe-transaction-mainnet.safe.global",
      ethAdapter,
      signer: safeOwner,
    })
  )
  .build();

const client = new PolywrapClient(config);
const safe = new Safe(client);
```

### Fetching Safe Info:

To fetch information about a specific Safe:

```javascript
const info = await safe.getSafeInfo({
  safeAddress: "YOUR_SAFE_ADDRESS",
});
console.log(info);
```

### Fetching Safes by Owner:

To retrieve a list of Safes owned by a specific address:

```javascript
const safes = await safe.getSafesByOwner({
  ownerAddress: "OWNER_ADDRESS",
});
console.log(safes);
```

## Errors:

The API can throw errors for various reasons. For example:

- `Invalid data`: Data provided does not match the expected format.
- `Not Found`: The requested resource is not available.
- `Checksum address validation failed`: The Ethereum address provided does not pass the checksum validation.

Always handle these errors gracefully in your application.

## Feedback and Contributions

If you encounter any issues or have feature requests, please open an issue on our GitHub repository. Contributions are also welcome! Please ensure to follow the contribution guidelines and code of conduct.

## License

This SDK is licensed under the [MIT License](LICENSE). Please refer to the LICENSE file for detailed information.

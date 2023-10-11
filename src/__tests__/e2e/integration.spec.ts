import { EthersAdapter } from "@safe-global/protocol-kit";
import { PolywrapClient } from "@polywrap/client-js";
import { PolywrapClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { Safe } from "../types";
import { ethers } from "ethers";
import { safeApiPlugin } from "../..";

jest.setTimeout(500000);

describe("Safe", () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6"
  );
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

  const client: PolywrapClient = new PolywrapClient(config);
  const safe = new Safe(client, undefined, undefined);

  test("getSafeInfo", async () => {
    const info = await safe.getSafeInfo({
      safeAddress: "0xa49A88055Ce0D972F6f6b9AF0843Fe4C9E9e5Ec5",
    });
    expect(info).toBeDefined();
    expect(info).toMatchObject({
      ok: true,
      value: {
        address: "0xa49A88055Ce0D972F6f6b9AF0843Fe4C9E9e5Ec5",
      },
    });
  });

  test("getSafesByOwner", async () => {
    const safes = await safe.getSafesByOwner({
      ownerAddress: "0x937F5b32Bc3cafcd1B02462F93e6AE5a843f6C6A",
    });

    expect(safes).toBeDefined();
    expect(safes).toMatchObject({
      ok: true,
      value: {
        safes: [
          "0xa49A88055Ce0D972F6f6b9AF0843Fe4C9E9e5Ec5",
          "0x8c3FA50473065f1D90f186cA8ba1Aa76Aee409Bb",
        ],
      },
    });
  });
});

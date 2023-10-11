import * as Types from "./wrap";

import { CoreClient, Module, manifest } from "./wrap";
import { PluginFactory, PluginPackage } from "@polywrap/plugin-js";
import { Signer, utils } from "ethers";

import { OperationType as CoreOperationType } from "@safe-global/safe-core-sdk-types";
import SafeApiKit from "@safe-global/api-kit";
import { SafeApiKitConfig } from "@safe-global/api-kit";

type SafeApiConfig = SafeApiKitConfig & {
  signer: Signer;
};

function toCoreOperationType(
  operationType: Types.OperationType
): CoreOperationType {
  switch (operationType) {
    case Types.OperationTypeEnum.Call:
    case "Call":
      return CoreOperationType.Call;
    case Types.OperationTypeEnum.DelegateCall:
    case "DelegateCall":
      return CoreOperationType.DelegateCall;
    default:
      throw new Error(`Unknown operation type: ${operationType}`);
  }
}

export class SafeApiPlugin extends Module<SafeApiConfig> {
  safe: SafeApiKit;

  constructor(config: SafeApiConfig) {
    super(config);
    this.safe = new SafeApiKit(config);
  }

  async getServiceInfo(
    args: Types.Args_getServiceInfo,
    client: CoreClient,
    env?: null
  ): Promise<Types.SafeServiceInfoResponse> {
    return this.safe.getServiceInfo();
  }

  async getServiceMasterCopiesInfo(
    args: Types.Args_getServiceMasterCopiesInfo,
    client: CoreClient,
    env?: null
  ): Promise<Array<Types.MasterCopyResponse>> {
    return this.safe.getServiceMasterCopiesInfo();
  }

  async decodeData(
    args: Types.Args_decodeData,
    client: CoreClient,
    env?: null
  ): Promise<Types.Json> {
    return JSON.stringify(await this.safe.decodeData(args.data));
  }

  async getSafesByOwner(
    args: Types.Args_getSafesByOwner,
    client: CoreClient,
    env?: null
  ): Promise<Types.OwnerResponse> {
    return this.safe.getSafesByOwner(utils.getAddress(args.ownerAddress));
  }

  async getSafesByModule(
    args: Types.Args_getSafesByModule,
    client: CoreClient,
    env?: null
  ): Promise<Types.ModulesResponse> {
    return this.safe.getSafesByModule(utils.getAddress(args.moduleAddress));
  }

  async getTransaction(
    args: Types.Args_getTransaction,
    client: CoreClient,
    env?: null
  ): Promise<Types.SafeMultisigTransactionResponse> {
    return this.safe.getTransaction(args.safeTxHash);
  }

  async getTransactionConfirmations(
    args: Types.Args_getTransactionConfirmations,
    client: CoreClient,
    env?: null
  ): Promise<Types.SafeMultisigConfirmationListResponse> {
    return this.safe.getTransactionConfirmations(args.safeTxHash);
  }

  async confirmTransaction(
    args: Types.Args_confirmTransaction,
    client: CoreClient,
    env?: null
  ): Promise<Types.SignatureResponse> {
    return this.safe.confirmTransaction(args.safeTxHash, args.signature);
  }

  async getSafeInfo(
    args: Types.Args_getSafeInfo,
    client: CoreClient,
    env?: null
  ): Promise<Types.SafeInfoResponse> {
    return this.safe.getSafeInfo(utils.getAddress(args.safeAddress));
  }

  async getSafeDelegates(
    args: Types.Args_getSafeDelegates,
    client: CoreClient,
    env?: null
  ): Promise<Types.SafeDelegateListResponse> {
    return this.safe.getSafeDelegates({
      safeAddress: args.safeAddress
        ? utils.getAddress(args.safeAddress)
        : undefined,
      delegateAddress: args.delegateAddress
        ? utils.getAddress(args.delegateAddress)
        : undefined,
      delegatorAddress: args.delegatorAddress
        ? utils.getAddress(args.delegatorAddress)
        : undefined,
      label: args.label || undefined,
      offset: args.offset || undefined,
      limit: args.limit || undefined,
    });
  }

  async addSafeDelegate(
    args: Types.Args_addSafeDelegate,
    client: CoreClient,
    env?: null
  ): Promise<Types.SafeDelegateResponse> {
    return this.safe.addSafeDelegate({
      ...args,
      safeAddress: utils.getAddress(args.safeAddress),
      delegateAddress: utils.getAddress(args.delegateAddress),
      delegatorAddress: utils.getAddress(args.delegatorAddress),
      signer: this.config.signer,
    });
  }

  async removeSafeDelegate(
    args: Types.Args_removeSafeDelegate,
    client: CoreClient,
    env?: null
  ): Promise<Types.Boolean> {
    await this.safe.removeSafeDelegate({
      ...args,
      delegateAddress: utils.getAddress(args.delegateAddress),
      delegatorAddress: utils.getAddress(args.delegatorAddress),
      signer: this.config.signer,
    });
    return true;
  }

  async getSafeCreationInfo(
    args: Types.Args_getSafeCreationInfo,
    client: CoreClient,
    env?: null
  ): Promise<Types.SafeCreationInfoResponse> {
    return this.safe.getSafeCreationInfo(utils.getAddress(args.safeAddress));
  }

  async estimateSafeTransaction(
    args: Types.Args_estimateSafeTransaction,
    client: CoreClient,
    env?: null
  ): Promise<Types.SafeMultisigTransactionEstimateResponse> {
    return this.safe.estimateSafeTransaction(
      utils.getAddress(args.safeAddress),
      {
        ...args.safeTransaction,
        to: utils.getAddress(args.safeTransaction.to),
        data: args.safeTransaction.data || undefined,
      }
    );
  }

  async proposeTransaction(
    args: Types.Args_proposeTransaction,
    client: CoreClient,
    env?: null
  ): Promise<Types.Boolean> {
    await this.safe.proposeTransaction({
      ...args,
      safeAddress: utils.getAddress(args.safeAddress),
      senderAddress: utils.getAddress(args.senderAddress),
      safeTransactionData: {
        ...args.safeTransactionData,
        to: utils.getAddress(args.safeTransactionData.to),
        operation: toCoreOperationType(args.safeTransactionData.operation),
      },
      origin: args.origin || undefined,
    });
    return true;
  }

  async getIncomingTransactions(
    args: Types.Args_getIncomingTransactions,
    client: CoreClient,
    env?: null
  ): Promise<Types.TransferListResponse> {
    return this.safe.getIncomingTransactions(
      utils.getAddress(args.safeAddress)
    );
  }

  async getModuleTransactions(
    args: Types.Args_getModuleTransactions,
    client: CoreClient,
    env?: null
  ): Promise<Types.SafeModuleTransactionListResponse> {
    return this.safe.getModuleTransactions(utils.getAddress(args.safeAddress));
  }

  async getMultisigTransactions(
    args: Types.Args_getMultisigTransactions,
    client: CoreClient,
    env?: null
  ): Promise<Types.SafeMultisigTransactionListResponse> {
    return this.safe.getMultisigTransactions(
      utils.getAddress(args.safeAddress)
    );
  }

  async getPendingTransactions(
    args: Types.Args_getPendingTransactions,
    client: CoreClient,
    env?: null
  ): Promise<Types.SafeMultisigTransactionListResponse> {
    return this.safe.getPendingTransactions(
      utils.getAddress(args.safeAddress),
      args.currentNonce || undefined
    );
  }

  async getAllTransactions(
    args: Types.Args_getAllTransactions,
    client: CoreClient,
    env?: null
  ): Promise<Types.AllTransactionsListResponse> {
    const result = await this.safe.getAllTransactions(
      utils.getAddress(args.safeAddress),
      {
        executed: args.options?.executed || undefined,
        queued: args.options?.queued || undefined,
        trusted: args.options?.trusted || undefined,
      }
    );
    return {
      count: result.count,
      next: result.next,
      previous: result.previous,
      results: result.results.map((res) => JSON.stringify(res)),
    };
  }

  async getNextNonce(
    args: Types.Args_getNextNonce,
    client: CoreClient,
    env?: null
  ): Promise<Types.Int> {
    return this.safe.getNextNonce(utils.getAddress(args.safeAddress));
  }

  async getTokenList(
    args: Types.Args_getTokenList,
    client: CoreClient,
    env?: null
  ): Promise<Types.TokenInfoListResponse> {
    return this.safe.getTokenList();
  }

  async getToken(
    args: Types.Args_getToken,
    client: CoreClient,
    env?: null
  ): Promise<Types.TokenInfoResponse> {
    return this.safe.getToken(utils.getAddress(args.tokenAddress));
  }
}

export const safeApiPlugin: PluginFactory<SafeApiConfig> = (
  config: SafeApiConfig
) => new PluginPackage(new SafeApiPlugin(config), manifest);

export const plugin = safeApiPlugin;

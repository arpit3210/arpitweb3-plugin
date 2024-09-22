import { Web3, Web3Context, Web3PluginBase } from "web3";
import { SWTRMiddleware } from "./SWTRMiddleware";
import { getNodePublicKey } from "@swisstronik/utils";

export class ArpitWeb3Plugin extends Web3PluginBase {
  public pluginNamespace = "swisstronik";
  public middleware: SWTRMiddleware;
  static web3: Web3;
  static rpcEndpoint?: string;

  constructor(rpcEndpoint?: string) {
    super();
    if (rpcEndpoint) ArpitWeb3Plugin.rpcEndpoint = rpcEndpoint;

    this.middleware = new SWTRMiddleware(this.getNodePublicKey);
  }

  public link(parentContext: Web3Context): void {
    parentContext.requestManager.setMiddleware(this.middleware);
    (parentContext as any).eth.setTransactionMiddleware(this.middleware);
    
    const clientUrl = (parentContext?.currentProvider as any)?.clientUrl;
    if (
      !ArpitWeb3Plugin.rpcEndpoint &&
      clientUrl &&
      typeof clientUrl === "string"
    ) {
      ArpitWeb3Plugin.rpcEndpoint = clientUrl;
    }

    ArpitWeb3Plugin.web3 = new Web3(parentContext.provider);
    this.middleware.web3 = ArpitWeb3Plugin.web3;

    super.link(parentContext);
  }

  public async getNodePublicKey(): Promise<string> {
    if (!ArpitWeb3Plugin.rpcEndpoint)
      throw new Error("RPC endpoint is not set");

    let { publicKey } = await getNodePublicKey(ArpitWeb3Plugin.rpcEndpoint);
    return publicKey!;
  }
}

// Module Augmentation
declare module "web3" {
  interface Web3Context {
    swisstronik: ArpitWeb3Plugin;
  }
}
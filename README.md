# 🏗 Scaffold-AVS

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building Eigenlayer AVM's on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy AMV smart contracts and build user interfaces that interact with those AVM contracts.

⚙️ Built using Eigenlayer, NextJS, RainbowKit, Foundry, Wagmi, Viem, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-AVS, follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
cd scaffold-avs
yarn install
```

2. Make sure Docker is running

3. Run a local network in the first terminal:

```
make start-chain-with-contracts-deployed
```

<!-- make a yarn command for this -->

This command starts a local Ethereum network using Foundry. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/foundry/foundry.toml`.

4. On a second terminal, deploy the test contract and setup the AVS software:
<!-- TODO: make start-operator doesnt work here, make new script? -->

```
yarn deploy
make start-operator
```

This command deploys a test smart contract to the local network. The contract is located in `packages/foundry/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/foundry/script` to deploy the contract to the network. You can also customize the deploy script.

5. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn foundry:test`

- Edit your smart contract `YourContract.sol` in `packages/foundry/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/foundry/script`

## Next steps

This project is a work in progress. Here is a list of things that I still need to do:

- Replace Makefile by yarn commands for:
  - start-chain-with-contracts-deployed
  - start-operator
  - spam-tasks
- Migrate project to hardhat
- Prefund operator wallet with funds

## Documentation

Visit [Scaffold-ETH 2 docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out [the Scaffold-ETH website](https://scaffoldeth.io).

## Team

This project is made for the Encode Club EigenLayer Hackathon and AVS MicroHacks Hackathon by:

- [arjanjohan](https://x.com/arjanjohan/)

"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useAccount, useSignMessage } from "wagmi";
import externalContracts from "~~/contracts/externalContracts";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

// TODO: Remove hardcoded chainid
const registeryContractAddress = externalContracts[31337].ECDSAStakeRegistry.address;
const registeryContractAbi = externalContracts[31337].ECDSAStakeRegistry.abi;
const registryCoordinatorPrivateKey = "0x1a6c3bd4b4e51b98cbe6c4cefc44d8b7b49fff24e1464fd74e6f843302b8e7c4";

// const HelloWorldServiceManagerAddress = "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB"; // Example address
const HelloWorldServiceManagerAddress = externalContracts[31337].HelloWorldServiceManager.address; // deployed address

const salt = "0xb657b16b777e3b82e2ba44cdec61235d5d62e1be45a0ea151b826dc832aca0bd";
const expiry = 1818599325n;

const RegisterOperatorAVS: React.FC = () => {
  const { address } = useAccount();
  const { targetNetwork } = useTargetNetwork();

  const { writeContractAsync: stakeRegistry } = useScaffoldWriteContract("ECDSAStakeRegistry");
  const { signMessageAsync } = useSignMessage();

  const { data: isOperatorRegistered, isLoading: isOperatorRegisteredLoading } = useScaffoldReadContract({
    contractName: "ECDSAStakeRegistry",
    functionName: "operatorRegistered",
    args: [address],
  });

  const { data: digestHash, isLoading: isDigestHashLoading } = useScaffoldReadContract({
    contractName: "AVSDirectory",
    functionName: "calculateOperatorAVSRegistrationDigestHash",
    args: [address, HelloWorldServiceManagerAddress, salt, expiry], // Example expiry
  });

  const registerOperator = async () => {
    try {
      let operatorSignature = {
        expiry: expiry,
        salt: salt,
        signature: "" as `0x${string}`,
      };

      const signature = await signMessageAsync({ message: digestHash ? digestHash : "" });
      operatorSignature.signature = `0x${signature.slice(2)}` as `0x${string}`;
      // console.log("signature:", signature);
      // console.log("Operator signature:", operatorSignature);

      const sig1 = ethers.Signature.from(signature);
      const sig2 = ethers.Signature.from(signature).serialized;

      console.log("sig1", sig1);

      const provider = new ethers.JsonRpcProvider(targetNetwork.rpcUrls.default.http[0]);

      const registryCoordinatorWallet = new ethers.Wallet(registryCoordinatorPrivateKey, provider);
      const registeryContract = new ethers.Contract(
        registeryContractAddress,
        registeryContractAbi,
        registryCoordinatorWallet,
      );

      console.log("Registering operator with AVS");
      console.log("Operator address:", address);
      console.log("Operator signature:", operatorSignature);
      // await stakeRegistry({
      //   functionName: "registerOperatorWithSignature",
      //   args: [operatorSignature, address],
      // });

      const tx = await registeryContract.registerOperatorWithSignature(operatorSignature, address);
      await tx.wait();

      console.log("Operator registered with AVS successfully");
    } catch (error) {
      console.error("Error registering operator: ", error);
    }
  };

  const deregisterOperator = async () => {
    try {
      console.log("Deregistering operator...");
      await stakeRegistry({
        functionName: "deregisterOperator",
      });
      console.log("Operator deregistered on EL successfully");
    } catch (error) {
      console.error("Error deregistering operator: ", error);
    }
  };

  return (
    <div>
      {isOperatorRegisteredLoading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <p className="m-0">
          {isOperatorRegistered ? (
            <div>
              "✅ You are registered as operator with AVS"
              <button disabled={!address} onClick={deregisterOperator} className="btn btn-primary btn-sm">
                Deregister Operator with AVS
              </button>
            </div>
          ) : (
            <button disabled={!address} onClick={registerOperator} className="btn btn-primary btn-sm">
              Register Operator with AVS
            </button>
          )}
        </p>
      )}
    </div>
  );
};

export default RegisterOperatorAVS;

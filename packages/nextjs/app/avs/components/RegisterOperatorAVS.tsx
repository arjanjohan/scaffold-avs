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

  const { data: isOperatorAVS, isLoading: isOperatorAVSLoading } = useScaffoldReadContract({
    contractName: "ECDSAStakeRegistry",
    functionName: "operatorRegistered",
    args: [address],
  });

  const { data: digestHash, isLoading: isDigestHashLoading } = useScaffoldReadContract({
    contractName: "AVSDirectory",
    functionName: "calculateOperatorAVSRegistrationDigestHash",
    args: [address, HelloWorldServiceManagerAddress, salt, expiry], // Example expiry
  });

  const registerOperatorAVS = async () => {
    try {
      // console.log("Registering operator...");
      console.error("NOT IMPLEMENTED YET");
      // console.log("Operator registered with AVS successfully");
    } catch (error) {
      console.error("Error registering operator: ", error);
    }
  };

  const deregisterOperatorAVS = async () => {
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
      {isOperatorAVSLoading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <p className="m-0">
          {isOperatorAVS ? (
            <div>
              "✅ You are registered as operator with AVS"
              <button disabled={!address} onClick={deregisterOperatorAVS} className="btn btn-primary btn-sm">
                Deregister Operator with AVS
              </button>
            </div>
          ) : (
            <button disabled={!address} onClick={registerOperatorAVS} className="btn btn-primary btn-sm">
              Register Operator with AVS
            </button>
          )}
        </p>
      )}
    </div>
  );
};

export default RegisterOperatorAVS;

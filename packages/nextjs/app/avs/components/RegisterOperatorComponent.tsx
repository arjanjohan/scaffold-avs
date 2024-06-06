"use client";

import { useState } from "react";
import RegisterOperatorAVS from "./RegisterOperatorAVS";
import StyledButton from "./StyledButton";
import { ethers } from "ethers";
import { useAccount, useSignMessage } from "wagmi";
import externalContracts from "~~/contracts/externalContracts";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// TODO: Remove hardcoded chainid
const registeryContractAddress = externalContracts[31337].ECDSAStakeRegistry.address;
const registeryContractAbi = externalContracts[31337].ECDSAStakeRegistry.abi;
const registryCoordinatorPrivateKey = "0x1a6c3bd4b4e51b98cbe6c4cefc44d8b7b49fff24e1464fd74e6f843302b8e7c4";

// const HelloWorldServiceManagerAddress = "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB"; // Example address
const HelloWorldServiceManagerAddress = externalContracts[31337].HelloWorldServiceManager.address; // deployed address

// TODO: remove hardcoded values for testing purposes
const salt = "0xb657b16b777e3b82e2ba44cdec61235d5d62e1be45a0ea151b826dc832aca0bd";
const expiry = 1818599325n;

const RegisterOperatorEL: React.FC = () => {
  const { address } = useAccount();

  const { writeContractAsync: delegationManager, isPending: isPendingDelegationManager } =
    useScaffoldWriteContract("DelegationManager");

  const { writeContractAsync: stakeRegistry, isPending: isPendingStakeRegistery } =
    useScaffoldWriteContract("ECDSAStakeRegistry");

  const { signMessageAsync } = useSignMessage();

  const { data: isOperatorEigenlayer, isLoading: isOperatorEigenlayerLoading } = useScaffoldReadContract({
    contractName: "DelegationManager",
    functionName: "isOperator",
    args: [address],
  });

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

  const registerOperatorEigenlayer = async () => {
    if (!address) {
      console.log("No address available");
      return;
    }

    try {
      console.log("Registering operator...");

      await delegationManager({
        functionName: "registerAsOperator",
        args: [
          {
            earningsReceiver: address,
            delegationApprover: "0x0000000000000000000000000000000000000000",
            stakerOptOutWindowBlocks: 0,
          },
          "0x",
        ],
      });
      console.log("Operator registered on EL successfully");
    } catch (error) {
      console.error("Error registering operator: ", error);
    }
  };

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
      {isOperatorEigenlayerLoading || isOperatorAVSLoading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <div>
          <div style={{ margin: "10px 0" }}>
            {isOperatorEigenlayer ? "✅ Registered on EL." : "❌ Not registered on EL."}
          </div>
          <div style={{ margin: "10px 0" }}>
            {isOperatorAVS ? "✅ Registered with AVS." : "❌ Not registered with AVS."}
          </div>

          <p className="m-0">
            {isOperatorEigenlayer ? (
              <div>
                {isOperatorAVS ? (
                  <StyledButton
                    onClick={deregisterOperatorAVS}
                    disabled={!address}
                    isPending={isPendingStakeRegistery}
                    className="btn-primary"
                    pendingText="Deregistering..."
                  >
                    Deregister Operator with AVS
                  </StyledButton>
                ) : (
                  <StyledButton
                    onClick={registerOperatorAVS}
                    disabled={!address}
                    isPending={isPendingStakeRegistery}
                    className="btn-primary"
                    pendingText="Registering..."
                  >
                    Register Operator with AVS
                  </StyledButton>
                )}
              </div>
            ) : (
              <StyledButton
                onClick={registerOperatorEigenlayer}
                disabled={!address}
                isPending={isPendingDelegationManager}
                className="btn-primary"
                pendingText="Registering..."
              >
                Register Operator on EL
              </StyledButton>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default RegisterOperatorEL;

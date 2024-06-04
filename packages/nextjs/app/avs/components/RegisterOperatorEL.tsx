"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const RegisterOperatorEL: React.FC = () => {
  const { address } = useAccount();

  const { writeContractAsync: delegationManager } = useScaffoldWriteContract("DelegationManager");

  const { data: isOperator, isLoading: isOperatorLoading } = useScaffoldReadContract({
    contractName: "DelegationManager",
    functionName: "isOperator",
    args: [address],
  });

  const registerOperator = async () => {
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

  return (
    <div className="mt-8">
      {isOperatorLoading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <p className="m-0">
          {isOperator ? (
            <p>✅ You are registered as operator on EL."</p>
          ) : (
            <button onClick={registerOperator} className="btn btn-primary btn-sm">
              Register Operator on EL
            </button>
          )}
        </p>
      )}
    </div>
  );
};

export default RegisterOperatorEL;

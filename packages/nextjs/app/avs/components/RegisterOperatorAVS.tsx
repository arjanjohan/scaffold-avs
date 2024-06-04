"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const RegisterOperatorAVS: React.FC = () => {
  const { address } = useAccount();

  const { writeContractAsync: stakeRegistry } = useScaffoldWriteContract("ECDSAStakeRegistry");

  // TODO: store this globally?
  const { data: isOperatorRegistered, isLoading: isOperatorRegisteredLoading } = useScaffoldReadContract({
    contractName: "ECDSAStakeRegistry",
    functionName: "operatorRegistered",
    args: [address],
  });

  const registerOperator = async () => {
    try {
      // const salt = ethers.utils.hexlify(ethers.utils.randomBytes(32));
      const salt = "0x0"; // TODO: generate random salt
      const expiry = BigInt(Math.floor(Date.now() / 1000) + 3600); // Example expiry, 1 hour from now

      const digestHash = await useScaffoldReadContract({
        contractName: "AVSDirectory",
        functionName: "calculateOperatorAVSRegistrationDigestHash",
        args: [address, "contractAddress", salt, expiry],
      });

      // const signingKey = new ethers.utils.SigningKey(process.env.NEXT_PUBLIC_PRIVATE_KEY!);
      // const signature = signingKey.signDigest(digestHash);
      // const operatorSignature = {
      //   expiry,
      //   salt,
      //   signature: ethers.utils.joinSignature(signature),
      // };

      // console.log("Registering operator...");
      // await stakeRegistry({
      //   functionName: "registerOperatorWithSignature",
      //   args: [address, operatorSignature],
      // });
      console.log("Operator registered on EL successfully");
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
    <div className="mt-8">
      {isOperatorRegisteredLoading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <p className="m-0">
          {isOperatorRegistered ? (
            <div>
              <p>✅ You are registered as operator with AVS</p>
              <button disabled={!address} onClick={deregisterOperator} className="btn btn-primary btn-sm">
                Deregister Operator
              </button>
            </div>
          ) : (
            <button disabled={!address} onClick={registerOperator} className="btn btn-primary btn-sm">
              Register Operator
            </button>
          )}
        </p>
      )}
    </div>
  );
};

export default RegisterOperatorAVS;

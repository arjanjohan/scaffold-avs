"use client";

import { useState } from "react";
import { SigningKey, ethers } from "ethers";
import { useAccount, useSignMessage } from "wagmi";
import externalContracts from "~~/contracts/externalContracts";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

// TODO: Remove hardcoded chainid
const registeryContractAddress = externalContracts[31337].ECDSAStakeRegistry.address;
const registeryContractAbi = externalContracts[31337].ECDSAStakeRegistry.abi;
const registryCoordinatorPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

const HelloWorldServiceManagerAddress = "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB";

const salt = "0xb657b16b777e3b82e2ba44cdec61235d5d62e1be45a0ea151b826dc832aca0bd";
const expiry = 1717599325n;

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
    args: [address, HelloWorldServiceManagerAddress, salt, expiry], // Example expiry, 1 hour from now
  });

  // const generateSaltAndExpiry = () => {
  //   // const newSalt = ethers.utils.hexlify(ethers.utils.randomBytes(32));
  //   const newSalt = "0xb657b16b777e3b82e2ba44cdec61235d5d62e1be45a0ea151b826dc832aca0bd";
  //   const newExpiry = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
  //   setSalt(newSalt);
  //   setExpiry(newExpiry);
  // };

  const registerOperator = async () => {
    try {
      let operatorSignature = {
        expiry: expiry,
        salt: salt,
        signature: "",
      };

      const signingKey = new SigningKey(registryCoordinatorPrivateKey);
      const signature = signingKey.sign(digestHash ? digestHash : "");
      operatorSignature.signature = ethers.Signature.from(signature).serialized;
      console.log("Operator signature:", operatorSignature);

      const provider = new ethers.JsonRpcProvider(targetNetwork.rpcUrls.default.http[0]);

      const registryCoordinatorWallet = new ethers.Wallet(registryCoordinatorPrivateKey, provider);
      const registeryContract = new ethers.Contract(
        registeryContractAddress,
        registeryContractAbi,
        registryCoordinatorWallet,
      );

      console.log("Registering operator with AVS");
      const tx = await registeryContract.registerOperatorWithSignature(address, operatorSignature);
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

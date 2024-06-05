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
const registryCoordinatorPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

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

  const [salt, setSalt] = useState<string>("0x0000000000000000000000000000000000000000000000000000000000000000");
  const [expiry, setExpiry] = useState<number>(0);

  const { data: digestHash, isLoading: isDigestHashLoading } = useScaffoldReadContract({
    contractName: "AVSDirectory",
    functionName: "calculateOperatorAVSRegistrationDigestHash",
    args: [
      address,
      "0x1291Be112d480055DaFd8a610b7d1e203891C274",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      BigInt(expiry),
    ], // Example expiry, 1 hour from now
  });

  const generateSaltAndExpiry = () => {
    // const newSalt = ethers.utils.hexlify(ethers.utils.randomBytes(32));
    const newSalt = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const newExpiry = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    setSalt(newSalt);
    setExpiry(newExpiry);
  };

  const registerOperator = async () => {
    try {
      generateSaltAndExpiry();
      console.log("digestHash", digestHash);

      const signature = await signMessageAsync({ message: digestHash ? digestHash : "" });
      console.log("signature", signature);

      const provider = new ethers.JsonRpcProvider(targetNetwork.rpcUrls.default.http[0]);
      const wallet = new ethers.Wallet(registryCoordinatorPrivateKey, provider);

      const contract = new ethers.Contract(registeryContractAddress, registeryContractAbi, wallet);
      console.log("Registering operator with AVS");
      const tx = await contract.registerOperatorWithSignature(address, {
        signature: signature,
        salt: salt,
        expiry: expiry,
      });
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
              <p>✅ You are registered as operator with AVS</p>
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

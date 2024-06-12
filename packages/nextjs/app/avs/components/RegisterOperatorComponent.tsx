"use client";

import StyledButton from "./StyledButton";
import { useAccount, useSignMessage } from "wagmi";
import { ethers } from "ethers";
import externalContracts from "~~/contracts/externalContracts";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const HelloWorldServiceManagerAddress = externalContracts[31337].HelloWorldServiceManager.address; // deployed address

// TODO: remove hardcoded values for testing purposes
const salt = "0xb657b16b777e3b82e2ba44cdec61235d5d62e1be45a0ea151b826dc832aca0bd";
const expiry = 1818599325n;

const RegisterOperatorComponent: React.FC = () => {
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
      let operatorSignature = {
        expiry: expiry,
        salt: salt,
        signature: "" as `0x${string}`,
      };

      const signature = await signMessageAsync({ message: digestHash ? digestHash : "" });
      operatorSignature.signature = `0x${signature.slice(2)}` as `0x${string}`;

      const sig1 = ethers.Signature.from(signature);
      const sig2 = ethers.Signature.from(signature).serialized;

      console.log("sig1", sig1);

      console.log("Registering operator with AVS");
      console.log("Operator address:", address);
      console.log("Operator signature:", operatorSignature);
      await stakeRegistry({
        functionName: "registerOperatorWithSignature",
        args: [operatorSignature, address],
      });

      console.log("Operator registered with AVS successfully");
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
                    className="btn-accent"
                    pendingText="Deregistering..."
                  >
                    Deregister Operator with AVS
                  </StyledButton>
                ) : (
                  <StyledButton
                    onClick={registerOperatorAVS}
                    disabled={!address}
                    isPending={isPendingStakeRegistery}
                    className="btn-accent"
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
                className="btn-accent"
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

export default RegisterOperatorComponent;

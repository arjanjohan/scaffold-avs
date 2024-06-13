"use client";

import StyledButton from "./StyledButton";
import { useAccount, useSignMessage } from "wagmi";
import { ethers, getBytes } from "ethers";
import externalContracts from "~~/contracts/externalContracts";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const HelloWorldServiceManagerAddress = externalContracts[31337].HelloWorldServiceManager.address; // deployed address

// TODO: remove hardcoded values for testing purposes
const salt = "0xe2db5b2ccfdfef2a650cc1974253e1d8f6438e7462944aa8ff77f50ffa4144ce" as `0x${string}`;
const expiry = 1718261340n; // Note the 'n' suffix to indicate bigint

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
      const digestBytes = getBytes(digestHash ? digestHash : "");
      console.log("digestHash", digestHash);
      console.log("digestBytes", digestBytes);

      const signature = await signMessageAsync({ message: { raw: digestBytes } });
      // const signature = await signMessageAsync({ message: digestHash as `0x${string}` });

      // Different signature based on signing the digestHash or digestBytes
      // digestBytes = 0x4cc01da2bd2009185dfcf25ddedaecde805219e9e0b41a8885dfcf4e6ca7fea54f252285f45315b7972813c0b25e10e600ab972081facd44f586ad20f9f3a1ca1b
      // digestHash = 0xe0f948a4af80c621ed4018098cc534ae4e30277628574408ed6159d6e6f5b98f581351dc6561fb150324a477b1897e67b98d28c1e1dbe04542478e129dd3d9f31b

      let operatorSignature = {
        expiry: expiry,
        salt: salt,
        signature: signature as `0x${string}`,
      };
      console.log("Registering operator with AVS");
      console.log("Operator address:", address);
      console.log("Operator signature:", signature);
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

"use client";

import { useCallback, useEffect, useState } from "react";
import StyledButton from "./StyledButton";
import StyledInput from "./StyledInput";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import externalContracts from "~~/contracts/externalContracts";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

// Function to generate random names
function generateRandomName(): string {
  const adjectives = ["Quick", "Lazy", "Sleepy", "Noisy", "Hungry"];
  const nouns = ["Fox", "Dog", "Cat", "Mouse", "Bear"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomName = `${adjective}${noun}${Math.floor(Math.random() * 1000)}`;
  return randomName;
}

// TODO: Remove hardcoded chainid
const avsContractAddress = externalContracts[31337].HelloWorldServiceManager.address;
const abi = externalContracts[31337].HelloWorldServiceManager.abi;

const CreateNewTaskComponent: React.FC = () => {
  const [taskName, setTaskName] = useState<string>("");
  const [spamTasks, setSpamTasks] = useState<boolean>(false);
  const [privateKey, setPrivateKey] = useState<string>("");
  const { writeContractAsync: createNewTask, isPending } = useScaffoldWriteContract("HelloWorldServiceManager");
  const { chain } = useAccount();
  const { targetNetwork } = useTargetNetwork();

  const writeDisabled = !chain || chain?.id !== targetNetwork.id;

  const handleCreateTask = async () => {
    try {
      console.log("Creating task...");
      await createNewTask({
        functionName: "createNewTask",
        args: [taskName],
      });
      console.log("Task created successfully");
    } catch (error) {
      console.error("Error setting greeting:", error);
    }
  };

  const handleSpamTasks = useCallback(
    async (randomName: string) => {
      try {
        if (!privateKey) {
          // TODO: add popup with error
          // TODO: check valid private key
          console.error("Private key is required for spamming tasks");
          return;
        }

        const provider = new ethers.JsonRpcProvider(targetNetwork.rpcUrls.default.http[0]);
        const wallet = new ethers.Wallet(privateKey, provider);

        const contract = new ethers.Contract(avsContractAddress, abi, wallet);

        console.log(`Creating new task with name: ${randomName}`);
        const tx = await contract.createNewTask(randomName);
        await tx.wait();
        console.log("Task created successfully");
      } catch (error) {
        console.error("Error creating task with spam:", error);
      }
    },
    [privateKey, targetNetwork.rpcUrls.default.http],
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (spamTasks) {
      interval = setInterval(() => {
        const randomName = generateRandomName();
        handleSpamTasks(randomName);
      }, 5000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [spamTasks, privateKey, handleSpamTasks]);

  return (
    <div>
      <div className="flex items-start mb-4 space-x-4">
        <div className="flex flex-col items-center w-20">
          <span className="text-xs font-medium mb-1 leading-none">Spam tasks</span>
          <input
            type="checkbox"
            checked={spamTasks}
            onChange={() => setSpamTasks(!spamTasks)}
            className="toggle toggle-accent"
          />
        </div>
        <StyledInput type="text" value={privateKey} onChange={e => setPrivateKey(e.target.value)} name="Private Key" />
      </div>

      <StyledInput
        type="text"
        value={taskName}
        onChange={e => setTaskName(e.target.value)}
        name="Task Name"
        disabled={spamTasks}
      />

      <StyledButton
        onClick={handleCreateTask}
        disabled={writeDisabled || isPending || spamTasks}
        isPending={isPending}
        className="btn-primary"
        pendingText="Creating..."
      >
        Create Task
      </StyledButton>
    </div>
  );
};

export default CreateNewTaskComponent;

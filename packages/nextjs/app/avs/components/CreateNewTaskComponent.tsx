"use client";

import { useEffect, useState } from "react";
import StyledInput from "./StyledInput";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
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
const avsContractAddress = deployedContracts[31337].HelloWorldServiceManager.address;
const abi = deployedContracts[31337].HelloWorldServiceManager.abi;

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

  const handleSpamTasks = async (randomName: string) => {
    try {
      if (!privateKey) {
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
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
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
  }, [spamTasks, privateKey]);

  return (
    <div>
      <StyledInput
        type="password"
        value={privateKey}
        onChange={e => setPrivateKey(e.target.value)}
        name="Private Key"
      />

      <div className="flex items-center mb-4">
        <input type="checkbox" checked={spamTasks} onChange={() => setSpamTasks(!spamTasks)} className="mr-2" />
        <label>Spam Tasks</label>
      </div>

      <StyledInput
        type="text"
        value={taskName}
        onChange={e => setTaskName(e.target.value)}
        name="Task Name"
        disabled={spamTasks}
      />

      <button
        className="btn btn-primary btn-sm"
        disabled={writeDisabled || isPending || spamTasks}
        onClick={handleCreateTask}
      >
        {isPending && <span className="loading loading-spinner loading-xs"></span>}
        {isPending ? "Creating..." : "Create Task"}
      </button>

      {status && <p className="mt-4">{status}</p>}
    </div>
  );
};

export default CreateNewTaskComponent;

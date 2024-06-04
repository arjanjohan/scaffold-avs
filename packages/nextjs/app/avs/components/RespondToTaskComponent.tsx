"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

const RespondToTaskComponent: React.FC = () => {
  const [taskName, setTaskName] = useState<string>("EigenWorld");
  const [taskIndex, setTaskIndex] = useState<number>(0);
  const [taskCreatedBlock, setTaskCreatedBlock] = useState<number>(0);
  const { writeContractAsync: respondToTask, isPending } = useScaffoldWriteContract("HelloWorldServiceManager");
  const { chain } = useAccount();
  const { targetNetwork } = useTargetNetwork();

  const writeDisabled = !chain || chain?.id !== targetNetwork.id;

  const handleRespondToTask = async () => {
    try {
      const message = `Hello, ${taskName}`;
      const messageHash = ethers.utils.solidityKeccak256(["string"], [message]);
      const messageBytes = ethers.utils.arrayify(messageHash);
      const signature = await ethers.Wallet.createRandom().signMessage(messageBytes);

      console.log(`Signing and responding to task ${taskIndex}`);

      await respondToTask({
        functionName: "respondToTask",
        args: [{ name: taskName, taskCreatedBlock: taskCreatedBlock }, taskIndex, signature],
      });
      console.log("Task responded to successfully");
    } catch (error) {
      console.error("Error responding to task:", error);
    }
  };

  return (
    <div className="mt-8">
      <input
        type="text"
        value={taskName}
        onChange={e => setTaskName(e.target.value)}
        placeholder="Task Name"
        className="px-4 py-2 border rounded-md mb-4"
      />

      <input
        type="number"
        value={taskIndex}
        onChange={e => setTaskIndex(Number(e.target.value))}
        placeholder="Task Index"
        className="px-4 py-2 border rounded-md mb-4"
      />

      <input
        type="number"
        value={taskCreatedBlock}
        onChange={e => setTaskCreatedBlock(Number(e.target.value))}
        placeholder="Task Created Block"
        className="px-4 py-2 border rounded-md mb-4"
      />

      <button className="btn btn-primary btn-sm" disabled={writeDisabled || isPending} onClick={handleRespondToTask}>
        {isPending && <span className="loading loading-spinner loading-xs"></span>}
        {isPending ? "Responding..." : "Respond to Task"}
      </button>
    </div>
  );
};

export default RespondToTaskComponent;

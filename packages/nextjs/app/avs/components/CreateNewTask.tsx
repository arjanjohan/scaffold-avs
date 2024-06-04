"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

const CreateNewTask: React.FC = () => {
  const [taskName, setTaskName] = useState<string>("");
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

  return (
    <div className="mt-8">
      <input
        type="text"
        value={taskName}
        onChange={e => setTaskName(e.target.value)}
        placeholder="Task Name"
        className="px-4 py-2 border rounded-md"
      />

      <button className="btn btn-primary btn-sm" disabled={writeDisabled || isPending} onClick={handleCreateTask}>
        {isPending && <span className="loading loading-spinner loading-xs"></span>}
        {isPending ? "Creating..." : "Create Task"}
      </button>

      {status && <p className="mt-4">{status}</p>}
    </div>
  );
};

export default CreateNewTask;

"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

const RespondToTask: React.FC = () => {
  // const [taskName, setTaskName] = useState<string>("");
  // const { writeContractAsync: createNewTask, isPending } = useScaffoldWriteContract("HelloWorldServiceManager");
  // const { chain } = useAccount();
  // const { targetNetwork } = useTargetNetwork();

  // const writeDisabled = !chain || chain?.id !== targetNetwork.id;

  // const handleCreateTask = async () => {
  //   try {
  //     console.log("Creating task...");
  //     await createNewTask({
  //       functionName: "createNewTask",
  //       args: [taskName],
  //     });
  //     console.log("Task created successfully");
  //   } catch (error) {
  //     console.error("Error setting greeting:", error);
  //   }
  // };

  return <div className="mt-8"></div>;
};

export default RespondToTask;

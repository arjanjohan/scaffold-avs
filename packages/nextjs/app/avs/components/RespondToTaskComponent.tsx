import React, { useEffect, useState } from "react";
import { useTask } from "../context/TaskContext";
import StyledInput from "./StyledInput";
import { sign } from "crypto";
import { ethers, getBytes, keccak256, toQuantity, toUtf8Bytes } from "ethers";
import { useAccount, useSignMessage } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

const RespondToTaskComponent: React.FC = () => {
  const { task } = useTask();
  const [taskName, setTaskName] = useState<string>(task.taskName);
  const [taskIndex, setTaskIndex] = useState<number>(task.taskIndex);
  const [taskCreatedBlock, setTaskCreatedBlock] = useState<number>(task.taskCreatedBlock);
  const [messageToSign, setMessageToSign] = useState<string>("");

  useEffect(() => {
    setTaskName(task.taskName);
    setTaskIndex(task.taskIndex);
    setTaskCreatedBlock(task.taskCreatedBlock);
    if (task.taskName) {
      setMessageToSign(`Hello, ${task.taskName}`);
    } else {
      setMessageToSign("");
    }
  }, [task]);

  const { chain } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const { writeContractAsync: respondToTask, isPending } = useScaffoldWriteContract("HelloWorldServiceManager");
  const { signMessageAsync } = useSignMessage();

  const byteArrayToString = (byteArray: Uint8Array) => {
    return Array.from(byteArray)
      .map(byte => byte.toString())
      .join("");
  };
  const writeDisabled = !chain || chain?.id !== targetNetwork.id;

  const handleRespondToTask = async () => {
    try {
      const message = `Hello, ${taskName}`;
      const messageHash = keccak256(toUtf8Bytes(message));
      const signature = await signMessageAsync({ message: messageHash });
      console.log("messageHash:", messageHash);
      console.log("signature:", signature);
      console.log(`Signing and responding to task ${taskIndex}`);

      const newSig = ethers.Signature.from(signature);
      console.log("newSig", newSig);
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
    <div>
      <StyledInput type="text" value={taskName} onChange={e => setTaskName(e.target.value)} name="Task Name" />

      <StyledInput
        type="number"
        value={taskIndex}
        onChange={e => setTaskIndex(Number(e.target.value))}
        name="Task Index"
      />

      <StyledInput
        type="number"
        value={taskCreatedBlock}
        onChange={e => setTaskCreatedBlock(Number(e.target.value))}
        name="Task Created Block"
      />

      <StyledInput
        type="text"
        value={messageToSign}
        onChange={e => setMessageToSign(e.target.value)}
        name="Message to sign"
      />

      <button className="btn btn-primary btn-sm" disabled={writeDisabled || isPending} onClick={handleRespondToTask}>
        {isPending && <span className="loading loading-spinner loading-xs"></span>}
        {isPending ? "Responding..." : "Respond to Task"}
      </button>
    </div>
  );
};

export default RespondToTaskComponent;

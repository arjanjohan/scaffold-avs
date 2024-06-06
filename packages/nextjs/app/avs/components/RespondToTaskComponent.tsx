import React, { useEffect, useState } from "react";
import { useTask } from "../context/TaskContext";
import StyledButton from "./StyledButton";
import StyledInput from "./StyledInput";
import { ethers, keccak256, toUtf8Bytes } from "ethers";
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

      <StyledButton
        onClick={handleRespondToTask}
        disabled={writeDisabled || isPending}
        isPending={isPending}
        className="btn-primary"
        pendingText="Responding..."
      >
        Respond to Task
      </StyledButton>

      {/* <div className="mt-5 justify-end flex gap-3 mx-5">
        <span className="self-center text-primary-content font-medium">Auto response</span>
        <input
          type="checkbox"
          // checked={watchEvents}
          // onChange={() => setWatchEvents(!watchEvents)}
          className="toggle toggle-accent"
        />
      </div>
      <StyledInput type="text" value={privateKey} onChange={e => setPrivateKey(e.target.value)} name="Private Key" /> */}
    </div>
  );
};

export default RespondToTaskComponent;

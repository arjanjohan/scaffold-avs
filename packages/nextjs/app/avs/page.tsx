"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth/useScaffoldWatchContractEvent";

const EventListenerPage: NextPage = () => {
  const [events, setEvents] = useState<Array<{ taskIndex: number; name: string; taskCreatedBlock: number }>>([]);
  const [registrationStatus, setRegistrationStatus] = useState<string>("");

  const { address } = useAccount();

  const { writeContractAsync: delegationManager } = useScaffoldWriteContract("DelegationManager");

  const { writeContractAsync: stakeRegistry } = useScaffoldWriteContract("StakeRegistry");

  const registerOperator = async () => {
    if (!address) {
      setRegistrationStatus("No address available");
      return;
    }

    try {
      setRegistrationStatus("Registering operator...");

      const tx1 = await delegationManager({
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
    } catch (error) {
      setRegistrationStatus(`Error registering operator: ${error.message}`);
    }
  };

  useScaffoldWatchContractEvent({
    contractName: "HelloWorldServiceManager",
    eventName: "NewTaskCreated",
    onLogs: logs => {
      logs.map(log => {
        const { taskIndex, task } = log.args;
        setEvents(prevEvents => [
          ...prevEvents,
          { taskIndex, name: task.name, taskCreatedBlock: task.taskCreatedBlock },
        ]);
      });
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Event Listener</h1>
      <div className="w-full max-w-4xl bg-gray-100 p-6 rounded-lg shadow-md">
        {events.length > 0 ? (
          <ul>
            {events.map((event, index) => (
              <li key={index} className="mb-4">
                <p>
                  <strong>Task Index:</strong> {event.taskIndex}
                </p>
                <p>
                  <strong>Task Name:</strong> {event.name}
                </p>
                <p>
                  <strong>Task Created Block:</strong> {event.taskCreatedBlock}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events found.</p>
        )}
      </div>
      <div className="mt-8">
        <button onClick={registerOperator} className="px-6 py-2 bg-blue-600 text-white rounded-md">
          Register Operator
        </button>
        {registrationStatus && <p className="mt-4">{registrationStatus}</p>}
      </div>
    </div>
  );
};

export default EventListenerPage;

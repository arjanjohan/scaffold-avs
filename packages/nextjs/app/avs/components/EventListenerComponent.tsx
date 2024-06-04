"use client";

import { useEffect, useState } from "react";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth/useScaffoldWatchContractEvent";

const EventListenerComponent: React.FC = () => {
  // const [events, setEvents] = useState<Array<{ taskIndex: number; name: string; taskCreatedBlock: number }>>([]);

  // useScaffoldWatchContractEvent({
  //   contractName: "HelloWorldServiceManager",
  //   eventName: "NewTaskCreated",
  //   onLogs: logs => {
  //     logs.map(log => {
  //       const { taskIndex, task } = log.args;
  //       setEvents(prevEvents => [
  //         ...prevEvents,
  //         { taskIndex, name: task.name, taskCreatedBlock: task.taskCreatedBlock },
  //       ]);
  //     });
  //   },
  // });

  const {
    data: events,
    error: eventsError,
    isLoading: eventsLoading,
  } = useScaffoldEventHistory({
    contractName: "HelloWorldServiceManager",
    eventName: "NewTaskCreated",
    fromBlock: 100n,
  });

  return (
    <div className="w-full max-w-4xl bg-gray-100 p-6 rounded-lg shadow-md">
      {events && events.length > 0 ? (
        <ul>
          {events.map((event, index) => (
            <li key={index} className="mb-4">
              <p>
                <strong>Task Index:</strong> {event.args.taskIndex}
              </p>
              <p>
                <strong>Task Name:</strong> {event.args.task.name}
              </p>
              <p>
                <strong>Task Created Block:</strong> {event.args.task.taskCreatedBlock}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default EventListenerComponent;

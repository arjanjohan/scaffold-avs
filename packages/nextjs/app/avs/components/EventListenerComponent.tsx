"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import EventsTable from "./EventsTable";
import { PaginationButton } from "./PaginationButton";
import { useScaffoldEventHistory, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useTask } from "../context/TaskContext";

const EventListenerComponent: React.FC = () => {
  const { address } = useAccount();
  const { setTask } = useTask();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [watchEvents, setWatchEvents] = useState<boolean>(false);
  const [responseStatuses, setResponseStatuses] = useState<{ [key: number]: boolean }>({});
  const ITEMS_PER_PAGE = 5; // This should match the ITEMS_PER_PAGE from the PaginationButton component

  const { data: events, error: eventsError } = useScaffoldEventHistory({
    contractName: "HelloWorldServiceManager",
    eventName: "NewTaskCreated",
    fromBlock: 100n,
    watch: watchEvents,
  });

  useEffect(() => {
    const fetchStatuses = async () => {
      if (!events || events.length === 0) return;

      const statuses = await Promise.all(events.map(async (event) => {
        const { data: isTaskResponded } = await useScaffoldReadContract({
          contractName: "HelloWorldServiceManager",
          functionName: "allTaskResponses",
          args: [event.args.taskIndex],
        });
        return { index: event.args.taskIndex, responded: isTaskResponded !== "0x" };
      }));

      const statusMap = statuses.reduce((acc, status) => {
        acc[status.index] = status.responded;
        return acc;
      }, {});

      setResponseStatuses(statusMap);
    };

    fetchStatuses();
  }, [events]);

  const handleActionClick = (event: Event) => {
    setTask({
      taskName: event.args.task.name,
      taskIndex: event.args.taskIndex,
      taskCreatedBlock: event.args.task.taskCreatedBlock,
    });
  };

  // Pagination logic
  const totalItems = events ? events.length : 0;
  const currentEvents = events ? events.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE) : [];

  return (
    <div className="w-full max-w-4xl bg-base-200 p-6 rounded-lg shadow-md">
      {eventsError && <p>Error loading events: {eventsError}</p>}
      {events && events.length > 0 ? (
        <>
          <EventsTable events={currentEvents} responseStatuses={responseStatuses} handleActionClick={handleActionClick} />
        </>
      ) : (
        <p>No events found.</p>
      )}
      <div className="flex justify-between items-center mt-5">
        <div className="mt-5 justify-end flex gap-3 mx-5">
          <span className="self-center text-accent-content font-medium">Watch tasks</span>
          <input
            type="checkbox"
            checked={watchEvents}
            onChange={() => setWatchEvents(!watchEvents)}
            className="toggle toggle-primary bg-primary hover:bg-primary border-primary"
          />
        </div>
        <PaginationButton currentPage={currentPage} totalItems={totalItems} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default EventListenerComponent;

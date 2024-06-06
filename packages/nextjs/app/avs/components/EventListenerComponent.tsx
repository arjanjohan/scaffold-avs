"use client";

import { useState } from "react";
import { EventsTable } from "./EventsTable";
import { PaginationButton } from "./PaginationButton";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";

const EventListenerComponent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [watchEvents, setWatchEvents] = useState<boolean>(false);
  const ITEMS_PER_PAGE = 5; // This should match the ITEMS_PER_PAGE from the PaginationButton component

  const {
    data: events,
    error: eventsError,
    isLoading: eventsLoading,
  } = useScaffoldEventHistory({
    contractName: "HelloWorldServiceManager",
    eventName: "NewTaskCreated",
    fromBlock: 100n,
    watch: watchEvents,
  });

  // Pagination logic
  const totalItems = events ? events.length : 0;
  const currentEvents = events ? events.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE) : [];

  return (
    <div className="w-full max-w-4xl bg-gray-100 p-6 rounded-lg shadow-md">
      {/* {eventsLoading && <p>Loading events...</p>} */}
      {eventsError && <p>Error loading events: {eventsError.message}</p>}
      {events && events.length > 0 ? (
        <>
          <EventsTable events={currentEvents} />
        </>
      ) : (
        <p>No events found.</p>
      )}
      <div className="flex justify-between items-center mt-5">
        <div className="mt-5 justify-end flex gap-3 mx-5">
          <span className="self-center text-primary-content font-medium">Watch events</span>
          <input
            type="checkbox"
            checked={watchEvents}
            onChange={() => setWatchEvents(!watchEvents)}
            className="toggle toggle-accent"
          />
        </div>
        <PaginationButton currentPage={currentPage} totalItems={totalItems} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default EventListenerComponent;

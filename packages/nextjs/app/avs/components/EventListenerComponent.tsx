"use client";

import { useState } from "react";
// Adjust the import path according to your project structure
import { EventsTable } from "./EventsTable";
import { PaginationButton } from "./PaginationButton";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";

// Adjust the import path according to your project structure

const EventListenerComponent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const ITEMS_PER_PAGE = 5; // This should match the ITEMS_PER_PAGE from the PaginationButton component

  const {
    data: events,
    error: eventsError,
    isLoading: eventsLoading,
  } = useScaffoldEventHistory({
    contractName: "HelloWorldServiceManager",
    eventName: "NewTaskCreated",
    fromBlock: 100n,
  });

  // Pagination logic
  const totalItems = events ? events.length : 0;
  const currentEvents = events ? events.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE) : [];
  console.log("currentEvents", currentEvents);

  return (
    <div className="w-full max-w-4xl bg-gray-100 p-6 rounded-lg shadow-md">
      {eventsLoading && <p>Loading events...</p>}
      {eventsError && <p>Error loading events: {eventsError.message}</p>}
      {events && events.length > 0 ? (
        <>
          <EventsTable events={currentEvents} />
          <PaginationButton currentPage={currentPage} totalItems={totalItems} setCurrentPage={setCurrentPage} />
        </>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default EventListenerComponent;

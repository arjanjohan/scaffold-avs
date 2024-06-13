import React, { useEffect, useState } from "react";
import { useTask } from "../context/TaskContext";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

type Event = {
  args: {
    taskIndex: number;
    task: {
      name: string;
      taskCreatedBlock: number;
    };
  };
};

type EventsTableProps = {
  events: Event[];
  responseStatuses: { [key: number]: boolean };
  handleActionClick: (event: Event) => void;
};

const EventsTable: React.FC<EventsTableProps> = ({ events, responseStatuses, handleActionClick }) => {
  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
        <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
          <thead>
            <tr className="rounded-xl text-sm text-base-content">
              <th className="bg-primary">Index</th>
              <th className="bg-primary">Name</th>
              <th className="bg-primary">Block</th>
              <th className="bg-primary">Response</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <EventsTableRow
                key={index}
                event={event}
                index={index}
                handleActionClick={handleActionClick}
                responseStatus={responseStatuses[event.args.taskIndex] || false}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

type EventsTableRowProps = {
  event: Event;
  index: number;
  handleActionClick: (event: Event) => void;
  responseStatus: boolean;
};

const EventsTableRow: React.FC<EventsTableRowProps> = ({ event, index, handleActionClick, responseStatus }) => {
  return (
    <tr key={index} className="hover text-sm">
      <td className="w-1/12 md:py-4">{event.args.taskIndex}</td>
      <td className="w-3/12 md:py-4">{event.args.task.name}</td>
      <td className="w-1/12 md:py-4">{event.args.task.taskCreatedBlock}</td>
      <td className="w-2/12 md:py-4">
        <button className="btn btn-accent btn-sm" onClick={() => handleActionClick(event)} disabled={responseStatus}>
          {responseStatus ? "✅ Responded" : "Respond"}
        </button>
      </td>
    </tr>
  );
};

export default EventsTable;

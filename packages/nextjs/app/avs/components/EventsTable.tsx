import React from "react";
import { useTask } from "../context/TaskContext";


type Event = {
  args: Args;
};

type Args = {
  taskIndex: number;
  task: Task;
};

type Task = {
  name: string;
  taskCreatedBlock: number;
};

type EventsTableProps = {
  events: Event[];
};

type EventsTableProps = {
  events: Event[];
};

export const EventsTable: React.FC<EventsTableProps> = ({ events }) => {
  const { setTask } = useTask();

  const handleActionClick = (event: Event) => {
    setTask({ taskName: event.args.task.name, taskIndex: event.args.taskIndex, taskCreatedBlock: event.args.task.taskCreatedBlock });
  };

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
        <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
          <thead>
            <tr className="rounded-xl text-sm text-base-content">
              <th className="bg-primary">Task Index</th>
              <th className="bg-primary">Task Name</th>
              <th className="bg-primary">Task Created Block</th>
              <th className="bg-primary">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index} className="hover text-sm">
              <td className="w-1/12 md:py-4">{event.args.taskIndex}</td>
              <td className="w-2/12 md:py-4">{event.args.task.name}</td>
              <td className="w-2/12 md:py-4">{event.args.task.taskCreatedBlock}</td>
                <td className="w-1/12 md:py-4">
                  <button className="btn btn-primary btn-sm" onClick={() => handleActionClick(event)}>
                    Respond
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

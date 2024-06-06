import React from "react";

type Event = {
  args: {
    taskIndex: number;
    task: {
      name: string;
      taskCreatedBlock: number;
    };
  };
};

type EventsTableRowProps = {
  event: Event;
  index: number;
  handleActionClick: (event: Event) => void;
};

export const EventsTableRow: React.FC<EventsTableRowProps> = ({ event, index, handleActionClick }) => {
  //   const { address } = useAccount();
  const responseStatus = false;

  //   useEffect(() => {
  //     const fetchStatus = async () => {
  //       const { data: isTaskResponded } = await useScaffoldReadContract({
  //         contractName: "HelloWorldServiceManager",
  //         functionName: "allTaskResponses",
  //         args: [address, event.args.taskIndex],
  //       });
  //       setResponseStatus(isTaskResponded !== "0x");
  //     };

  //     fetchStatus();
  //   }, [address, event.args.taskIndex]);

  return (
    <tr key={index} className="hover text-sm">
      <td className="w-1/12 md:py-4">{event.args.taskIndex}</td>
      <td className="w-2/12 md:py-4">{event.args.task.name}</td>
      <td className="w-2/12 md:py-4">{event.args.task.taskCreatedBlock}</td>
      <td className="w-1/12 md:py-4">
        <button className="btn btn-primary btn-sm" onClick={() => handleActionClick(event)} disabled={responseStatus}>
          {responseStatus ? "✅ Responded" : "Respond"}
        </button>
      </td>
    </tr>
  );
};

"use client";

import CreateNewTask from "./components/CreateNewTask";
import EventListener from "./components/EventListener";
import RegisterOperatorAVS from "./components/RegisterOperatorAVS";
import RegisterOperatorEL from "./components/RegisterOperatorEL";
import RespondToTask from "./components/RespondToTask";
import type { NextPage } from "next";

const EventListenerPage: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Event Listener</h1>
      <EventListener />
      <h1 className="text-4xl font-bold mb-4">Operator status</h1>
      <RegisterOperatorEL />
      <RegisterOperatorAVS />
      <h1 className="text-4xl font-bold mb-4">Hello World Service Manager</h1>
      <CreateNewTask />
      <RespondToTask />
    </div>
  );
};

export default EventListenerPage;

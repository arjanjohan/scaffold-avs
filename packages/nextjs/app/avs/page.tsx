"use client";

import CreateNewTaskComponent from "./components/CreateNewTaskComponent";
import EventListenerComponent from "./components/EventListenerComponent";
import RegisterOperatorAVS from "./components/RegisterOperatorAVS";
import RegisterOperatorEL from "./components/RegisterOperatorEL";
import RespondToTaskComponent from "./components/RespondToTaskComponent";
import type { NextPage } from "next";

const EventListenerPage: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Event Listener</h1>
      <EventListenerComponent />
      <h1 className="text-4xl font-bold mb-4">Operator status</h1>
      <RegisterOperatorEL />
      <RegisterOperatorAVS />
      <h1 className="text-4xl font-bold mb-4">Hello World Service Manager</h1>
      <CreateNewTaskComponent />
      <RespondToTaskComponent />
    </div>
  );
};

export default EventListenerPage;

"use client";

import CreateNewTask from "./components/CreateNewTask";
import EventListener from "./components/EventListener";
import RegisterOperator from "./components/RegisterOperator";
import type { NextPage } from "next";

const EventListenerPage: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Event Listener</h1>
      <EventListener />
      <RegisterOperator />
      <CreateNewTask />
    </div>
  );
};

export default EventListenerPage;

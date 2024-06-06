"use client";

import CreateNewTaskComponent from "./components/CreateNewTaskComponent";
import EventListenerComponent from "./components/EventListenerComponent";
import RegisterOperatorAVS from "./components/RegisterOperatorAVS";
import RegisterOperatorComponent from "./components/RegisterOperatorComponent";
import RegisterOperatorEL from "./components/RegisterOperatorEL";
import RespondToTaskComponent from "./components/RespondToTaskComponent";
import { TaskProvider } from "./context/TaskContext";
import type { NextPage } from "next";

const EventListenerPage: NextPage = () => {
  // return (
  //   <div className="flex flex-col items-center justify-center min-h-screen py-2">
  //     <h1 className="text-4xl font-bold mb-4">Event Listener</h1>
  //     <EventListenerComponent />
  //     <h1 className="text-4xl font-bold mb-4">Operator status</h1>
  //     <RegisterOperatorEL />
  //     <RegisterOperatorAVS />
  //     <h1 className="text-4xl font-bold mb-4">Hello World Service Manager</h1>
  //     <CreateNewTaskComponent />
  //     <RespondToTaskComponent />
  //   </div>
  // );
  return (
    <TaskProvider>
      <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
        <div className="col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="col-span-1 flex flex-col">
            <div className="bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 space-y-1 py-4">
              <div className="flex">
                <div className="flex flex-col gap-1">
                  <span className="font-bold">Operator Dashboard</span>
                  <RegisterOperatorComponent />
                </div>
              </div>
            </div>
            <div className="bg-base-300 rounded-3xl px-6 lg:px-8 py-4 shadow-lg shadow-base-300">
              <div className="flex">
                <div className="flex flex-col gap-1">
                  <span className="font-bold">Respond To Tasks</span>
                  <RespondToTaskComponent />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
            <div className="z-10">
              <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
                <div className="h-[5rem] w-[5.5rem] bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-base-300">
                  <div className="flex items-center justify-center space-x-2">
                    <p className="my-0 text-sm">Events</p>
                  </div>
                </div>
                <div className="p-5 divide-y divide-base-300">
                  <EventListenerComponent />
                </div>
              </div>
            </div>
            <div className="z-10">
              <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
                <div className="h-[5rem] w-[5.5rem] bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-base-300">
                  <div className="flex items-center justify-center space-x-2">
                    <p className="my-0 text-sm">Create Task</p>
                  </div>
                </div>
                <div className="p-5 divide-y divide-base-300">
                  <CreateNewTaskComponent />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TaskProvider>
  );
};

export default EventListenerPage;

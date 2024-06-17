"use client";

import type { NextPage } from "next";
import CommitteeComponent from "./components/CommitteeComponent";
import QuorumComponent from "./components/QuorumComponent";

const CommitteeDashboard: NextPage = () => {
  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <CommitteeComponent />
      <QuorumComponent />
    </div>
  );
};

export default CommitteeDashboard;

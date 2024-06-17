"use client";

import { useState, useEffect } from "react";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface TEEQuorum {
  quorumNumber: number;
  teeType: number;
}

const QuorumComponent = () => {
  const [quorumNumber, setQuorumNumber] = useState<string>("");
  const [teeQuorum, setTeeQuorum] = useState<TEEQuorum | null>(null);
  const [newTEEQuorum, setNewTEEQuorum] = useState<TEEQuorum>({ quorumNumber: 0, teeType: 0 });
  const [removeTEEQuorumNumber, setRemoveTEEQuorumNumber] = useState<string>("");

  const { data: teeQuorumData } = useScaffoldReadContract({
    contractName: "MultiProverServiceManager",
    functionName: "teeQuorums",
    args: [quorumNumber ? Number(quorumNumber) : 0],
  });

  const { writeContractAsync: ServiceManagerAsync } = useScaffoldWriteContract("MultiProverServiceManager");

  useEffect(() => {
    console.log('Fetcing quorum', quorumNumber);
    if (teeQuorumData) {
      const [quorumNumber, teeType] = teeQuorumData;
      setTeeQuorum({
        quorumNumber: Number(quorumNumber),
        teeType: Number(teeType),
      });
    }
  }, [teeQuorumData]);

  const handleAddTEEQuorum = async () => {
    try {
      console.log('Adding quorum...');
      await ServiceManagerAsync({
        functionName: "addTEEQuorum",
        args: [newTEEQuorum],
      });
    } catch (err) {
      console.error("Error adding TEEQuorum", err);
    }
  };

  const handleRemoveTEEQuorum = async () => {
    try {
      await ServiceManagerAsync({
        functionName: "removeTEEQuorum",
        args: [parseInt(removeTEEQuorumNumber)],
      });
    } catch (err) {
      console.error("Error removing TEEQuorum", err);
    }
  };

  return (
    <div className="flex flex-col items-center bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-24 w-full max-w-lg">
      <div className="text-xl">TEEQuorum Dashboard</div>

      {/* View TEEQuorums */}
      <div className="mt-8 w-full">
        <h2 className="text-lg font-bold">View TEEQuorum</h2>
        <input
          type="number"
          placeholder="Quorum Number"
          value={quorumNumber}
          onChange={(e) => setQuorumNumber(e.target.value)}
          className="input input-bordered w-full"
        />

        {quorumNumber && teeQuorum && (
          <div>
            <p>Quorum Number: {teeQuorum.quorumNumber}</p>
            <p>TEE Type: {['NONE', 'INTEL_SGX', 'AWS_NITRO', 'AMD_SEV', 'ARM_TRUSTZONE'][teeQuorum.teeType] || 'UNKNOWN'}</p>            </div>
        )}
      </div>


      {/* Add TEEQuorum */}
      <div className="mt-8 w-full">
        <h2 className="text-lg font-bold">Add</h2>
        <input
          type="text"
          placeholder="Quorum Number"
          value={newTEEQuorum.quorumNumber.toString()}
          onChange={(e) => setNewTEEQuorum({ ...newTEEQuorum, quorumNumber: parseInt(e.target.value) })}
          className="input input-bordered w-full"
        />
        <select
          className="select select-bordered w-full"
          value={newTEEQuorum.teeType}
          onChange={(e) => setNewTEEQuorum({ ...newTEEQuorum, teeType: parseInt(e.target.value) })}
        >
          <option value={0}>NONE</option>
          <option value={1}>INTEL_SGX</option>
          <option value={2}>AWS_NITRO</option>
          <option value={3}>AMD_SEV</option>
          <option value={4}>ARM_TRUSTZONE</option>
        </select>
        <button className="btn btn-secondary mt-2 w-full" onClick={handleAddTEEQuorum}>
          Add TEEQuorum
        </button>
      </div>


      {/* Remove TEEQuorum */}
      <div className="mt-8 w-full">
        <h2 className="text-lg font-bold">Remove</h2>
        <input
          type="text"
          placeholder="Quorum Number"
          value={removeTEEQuorumNumber}
          onChange={(e) => setRemoveTEEQuorumNumber(e.target.value)}
          className="input input-bordered w-full"
        />
        <button className="btn btn-secondary mt-2 w-full" onClick={handleRemoveTEEQuorum}>
          Remove TEEQuorum
        </button>
      </div>
    </div>
  );
};

export default QuorumComponent;

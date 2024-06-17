"use client";

import { useState, useEffect } from "react";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface Committee {
  id: number;
  description: string;
  metadata: string;
  teeQuorumNumbers: string;
}

const CommitteeComponent = () => {
  const [committeeId, setCommitteeId] = useState<string>("");
  const [committee, setCommittee] = useState<Committee | null>(null);
  const [newCommittee, setNewCommittee] = useState<Committee>({ id: 0, description: "", metadata: "", teeQuorumNumbers: "" });
  const [teeQuorumNumber, setTeeQuorumNumber] = useState<string>("");
  const [updateCommitteeId, setUpdateCommitteeId] = useState<string>("");
  const [removeCommitteeId, setRemoveCommitteeId] = useState<string>("");

  const { data: committeeData} = useScaffoldReadContract({
    contractName: "MultiProverServiceManager",
    functionName: "committees",
    args: [committeeId ? BigInt(committeeId) : 0n],
  });

  const { writeContractAsync: ServiceManagerAsync } = useScaffoldWriteContract("MultiProverServiceManager");

  useEffect(() => {
    if (committeeData) {
      const [id, description, metadata, teeQuorumNumbers] = committeeData;
      setCommittee({
        id: Number(id),
        description: description as string,
        metadata: metadata as string,
        teeQuorumNumbers: teeQuorumNumbers as string,
      });
    }
  }, [committeeData]);

  const handleAddCommittee = async () => {
    try {
      await ServiceManagerAsync({
        functionName: "addCommittee",
        args: [{
          id: newCommittee.id,
          description: newCommittee.description,
          metadata: newCommittee.metadata,
          teeQuorumNumbers: newCommittee.teeQuorumNumbers,
        }],
      });
    } catch (err) {
      console.error("Error adding committee", err);
    }
  };

  const handleUpdateCommittee = async () => {
    try {
      await ServiceManagerAsync({
        functionName: "updateCommittee",
        args: [{
          id: parseInt(updateCommitteeId),
          description: "", // Should be filled as needed
          metadata: "", // Should be filled as needed
          teeQuorumNumbers: "", // Should be filled as needed
        }],
      });
    } catch (err) {
      console.error("Error updating committee", err);
    }
  };

  const handleRemoveCommittee = async () => {
    try {
      await ServiceManagerAsync({
        functionName: "removeCommittee",
        args: [parseInt(removeCommitteeId)],
      });
    } catch (err) {
      console.error("Error removing committee", err);
    }
  };

  return (
    <div className="flex flex-col items-center bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 w-full max-w-lg">
      <div className="text-xl">Committee Dashboard</div>

      {/* View Committee */}
      <div className="mt-8 w-full">
        <h2 className="text-lg font-bold">View Committee</h2>
        <input
          type="number"
          placeholder="Committee ID"
          value={committeeId}
          onChange={(e) => setCommitteeId(e.target.value)}
          className="input input-bordered w-full"
        />
        {committeeId && committee && (
          <div>
            <h3>Committee Details:</h3>
            <p>ID: {committee.id}</p>
            <p>Description: {committee.description}</p>
            <p>Metadata: {committee.metadata}</p>
            <p>TEE Quorum Numbers: {committee.teeQuorumNumbers}</p>
          </div>
        )}
      </div>

      {/* Add Committee */}
      <div className="mt-8 w-full">
        <h2 className="text-lg font-bold">Add Committee</h2>
        <input
          type="number"
          placeholder="Committee ID"
          value={newCommittee.id.toString()}
          onChange={(e) => setNewCommittee({ ...newCommittee, id: parseInt(e.target.value) })}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Description"
          value={newCommittee.description}
          onChange={(e) => setNewCommittee({ ...newCommittee, description: e.target.value })}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Metadata"
          value={newCommittee.metadata}
          onChange={(e) => setNewCommittee({ ...newCommittee, metadata: e.target.value })}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="TEE Quorum Numbers"
          value={teeQuorumNumber}
          onChange={(e) => setTeeQuorumNumber(e.target.value)}
          className="input input-bordered w-full"
        />
        <button className="btn btn-secondary mt-2 w-full" onClick={() => {
          setNewCommittee({
            ...newCommittee,
            teeQuorumNumbers: newCommittee.teeQuorumNumbers + teeQuorumNumber
          });
          setTeeQuorumNumber("");
        }}>
          Add TEE Quorum Number to Committee
        </button>
        <button className="btn btn-secondary mt-2 w-full" onClick={handleAddCommittee}>
          Add Committee
        </button>
      </div>

      {/* Update Committee */}
      <div className="mt-8 w-full">
        <h2 className="text-lg font-bold">Update Committee</h2>
        <input
          type="text"
          placeholder="Committee ID"
          value={updateCommitteeId}
          onChange={(e) => setUpdateCommitteeId(e.target.value)}
          className="input input-bordered w-full"
        />
        <button className="btn btn-secondary mt-2 w-full" onClick={handleUpdateCommittee}>
          Update Committee
        </button>
      </div>

      {/* Remove Committee */}
      <div className="mt-8 w-full">
        <h2 className="text-lg font-bold">Remove Committee</h2>
        <input
          type="text"
          placeholder="Committee ID"
          value={removeCommitteeId}
          onChange={(e) => setRemoveCommitteeId(e.target.value)}
          className="input input-bordered w-full"
        />
        <button className="btn btn-secondary mt-2 w-full" onClick={handleRemoveCommittee}>
          Remove Committee
        </button>
      </div>
    </div>
  );
};

export default CommitteeComponent;

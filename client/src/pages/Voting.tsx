import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { state } from '../state';

const Voting = () => {
  const snap = useSnapshot(state);

  const [rankings, setRankings] = useState<string[]>([]);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmVotes, setConfirmVotes] = useState(false);

  return (
    <section className="mx-auto flex flex-col w-full justify between items-center h-full max-w-sm">
      <div className="w-full">
        <h1 className="text-center">Voting page</h1>
      </div>
    </section>
  );
};

export default Voting;

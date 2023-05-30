import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { state } from '../state';

const Results = () => {
  const snap = useSnapshot(state);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isLeavePollOpen, setIsLeavePollOpen] = useState(false);
  return (
    <>
      <section className="mx-auto flex flex-col w-full justify-between items-center h-full max-w-sum">
        <div className="w-full">
          <h1 className="text-center mt-12 mb-4">Results</h1>
        </div>
      </section>
    </>
  );
};

export default Results;

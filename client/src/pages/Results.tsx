import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { actions, state } from '../state';
import ResultCard from '../components/ui/ResultCard';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';

const Results = () => {
  const snap = useSnapshot(state);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isLeavePollOpen, setIsLeavePollOpen] = useState(false);
  return (
    <>
      <section className="mx-auto flex flex-col w-full justify-between items-center h-full max-w-sum">
        <div className="w-full">
          <h1 className="text-center mt-12 mb-4">Results</h1>
          {snap.poll?.results.length ? (
            <ResultCard results={snap.poll?.results} />
          ) : (
            <p className="text-center text-xl">
              <span className="text-orange-600">{snap.rankingsCount}</span> of{' '}
              <span className="text-purple-600">{snap.participantCount}</span>{' '}
              participants has voted
            </p>
          )}
        </div>
        <div className="flex flex-col justify-center">
          {snap.isAdmin && !snap.poll?.results.length && (
            <>
              <button
                className="box btn-orange my-2"
                onClick={() => setIsConfirmationOpen(true)}
              >
                End Poll
              </button>
            </>
          )}
          {!snap.isAdmin && !snap.poll?.results.length && (
            <div className="my-2 italic">
              Waiting for Admin,{' '}
              <span className="font-semibold">
                {snap.poll?.participants[snap.poll?.adminID]}
              </span>
              , to finalize the poll
            </div>
          )}
          {!!snap.poll?.results.length && (
            <button
              className="box btn-purple my-2"
              onClick={() => setIsLeavePollOpen(true)}
            >
              Leave Poll
            </button>
          )}
        </div>
      </section>
      {snap.isAdmin && (
        <ConfirmationDialog
          message="Are you sure you want to close the poll and calculate the results?"
          showDialog={isConfirmationOpen}
          onCancel={() => setIsConfirmationOpen(false)}
          onConfirm={() => {
            actions.closePoll();
            setIsConfirmationOpen(false);
          }}
        />
      )}
      {isLeavePollOpen && (
        <ConfirmationDialog
          message="You'll loose your results"
          showDialog={isLeavePollOpen}
          onCancel={() => setIsLeavePollOpen(false)}
          onConfirm={() => actions.startOver()}
        />
      )}
    </>
  );
};

export default Results;

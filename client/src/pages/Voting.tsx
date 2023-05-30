import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { actions, state } from '../state';
import RankedCheckBox from '../components/ui/RankedCheckBox';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';

const Voting = () => {
  const snap = useSnapshot(state);

  const [rankings, setRankings] = useState<string[]>([]);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmVotes, setConfirmVotes] = useState(false);

  const toggleNomination = (id: string) => {
    const position = rankings.findIndex((ranking) => ranking === id);
    const hasVotesRemaining =
      (snap.poll?.votesPerVoter || 0) - rankings.length > 0;

    if (position < 0 && hasVotesRemaining) {
      setRankings([...rankings, id]);
    } else {
      setRankings([
        ...rankings.slice(0, position),
        ...rankings.slice(position + 1, rankings.length),
      ]);
    }
  };

  const getRank = (id: string) => {
    const position = rankings.findIndex((ranking) => ranking === id);
    return position < 0 ? undefined : position + 1;
  };

  return (
    <section className="mx-auto flex flex-col w-full justify-between items-center h-full max-w-sm">
      <div className="w-full">
        <h1 className="text-center">Voting page</h1>
      </div>
      <header className="w-full">
        {snap.poll && (
          <>
            <div className="text-center text-xl font-semibold mb-6">
              Select your top {snap.poll?.votesPerVoter} choices
            </div>
            <div className="text-center text-lg font-semibold mb-6 text-indigo-700">
              {snap.poll.votesPerVoter - rankings.length} Votes remaining
            </div>
          </>
        )}
      </header>
      <article className="px-2">
        {Object.entries(snap.poll?.nominations || {}).map(
          ([id, nomination]) => (
            <RankedCheckBox
              key={id}
              value={nomination.text}
              rank={getRank(id)}
              onSelect={() => toggleNomination(id)}
            />
          )
        )}
      </article>
      <div className="mx-auto flex flex-col items-center">
        <button
          className="box btn-purple my-2 w-36"
          disabled={rankings.length < (snap.poll?.votesPerVoter ?? 100)}
          onClick={() => setConfirmVotes(true)}
        >
          Submit votes
        </button>
        <ConfirmationDialog
          message="You cannot change your vote after submitting"
          showDialog={confirmVotes}
          onCancel={() => setConfirmVotes(false)}
          onConfirm={() => actions.submitRankings(rankings)}
        />
        {snap.isAdmin && (
          <>
            <button
              className="box btn-orange my-2 w-36"
              onClick={() => setConfirmCancel(true)}
            >
              Cancel Poll
            </button>
            <ConfirmationDialog
              message="This will cancel the poll and remove all users"
              showDialog={confirmCancel}
              onCancel={() => setConfirmCancel(false)}
              onConfirm={() => actions.cancelPoll()}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default Voting;

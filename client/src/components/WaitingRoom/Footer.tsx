import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { actions, state } from '../../state';
import ConfirmationDialog from '../ui/ConfirmationDialog';

const Footer: React.FC = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const snap = useSnapshot(state);
  return (
    <article className="flex flex-col justify-center">
      {snap.isAdmin ? (
        <>
          <div className="my-2 italic">
            {snap.poll?.votesPerVoter} Nominations Required to Start!
          </div>
          <button
            className="box btn-orange my-2"
            disabled={!snap.canStartVote}
            onClick={() => console.log('will add start vote next time')}
          >
            Start Voting
          </button>
        </>
      ) : (
        <div className="my-2 italic">
          Waiting for Admin,{' '}
          <span className="font-semibold">
            {snap.poll?.participants[snap.poll?.adminID]}
          </span>
          , to start the voting
        </div>
      )}
      <button
        className="box btn-purple my-2"
        onClick={() => setShowConfirmation(true)}
      >
        Leave poll
      </button>
      <ConfirmationDialog
        message="You'll be kicked out of the poll"
        showDialog={showConfirmation}
        onCancel={() => setShowConfirmation(false)}
        onConfirm={() => actions.startOver()}
      />
    </article>
  );
};

export default Footer;

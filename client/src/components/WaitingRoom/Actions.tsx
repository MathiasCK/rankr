import React, { useState } from 'react';
import { MdPeopleOutline } from 'react-icons/md';
import { useSnapshot } from 'valtio';
import { actions, state } from '../../state';
import { BsPencilSquare } from 'react-icons/bs';
import NominationForm from '../NominationForm';
import ParticipantList from '../ParticipantList';
import ConfirmationDialog from '../ui/ConfirmationDialog';

const Actions = () => {
  const snap = useSnapshot(state);

  const [isNominationFormOpen, setIsNominationFormOpen] = useState(false);
  const [isParticipantListOpen, setIsParticipantListOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [participantToRemove, setParticipantToRemove] = useState<string>();

  const confirmRemoveParticipant = (id: string) => {
    setConfirmationMessage(`Remove ${snap.poll?.participants[id]} from poll?`);
    setParticipantToRemove(id);
    setIsConfirmationOpen(true);
  };

  const submitRemoveParticipant = () => {
    participantToRemove && actions.removeParticipant(participantToRemove);
    setIsConfirmationOpen(false);
  };
  return (
    <>
      <article className="flex justify-center">
        <button
          className="box btn-orange mx-2 pulsate"
          onClick={() => setIsParticipantListOpen(true)}
        >
          <MdPeopleOutline size={24} />
          <span>{snap.participantCount}</span>
        </button>
        <button
          className="box btn-purple mx-2 pulsate"
          onClick={() => setIsNominationFormOpen(true)}
        >
          <BsPencilSquare size={24} />
          <span>{snap.nominationCount}</span>
        </button>
      </article>
      <NominationForm
        title={snap.poll?.topic}
        isOpen={isNominationFormOpen}
        onClose={() => setIsNominationFormOpen(false)}
        onSubmitNomination={(nominationText: string) =>
          actions.nominate(nominationText)
        }
        nominations={snap.poll?.nominations}
        userID={snap.me?.id}
        onRemoveNomination={(nominationID: string) =>
          actions.removeNomination(nominationID)
        }
        isAdmin={snap.isAdmin || false}
      />
      <ParticipantList
        isOpen={isParticipantListOpen}
        onClose={() => setIsParticipantListOpen(false)}
        participants={snap.poll?.participants}
        onRemoveParticipant={confirmRemoveParticipant}
        isAdmin={snap.isAdmin || false}
        userID={snap.me?.id}
      />
      <ConfirmationDialog
        showDialog={isConfirmationOpen}
        message={confirmationMessage}
        onConfirm={() => submitRemoveParticipant()}
        onCancel={() => setIsConfirmationOpen(false)}
      />
    </>
  );
};

export default Actions;

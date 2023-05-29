import React from 'react';
import { MdPeopleOutline } from 'react-icons/md';
import { useSnapshot } from 'valtio';
import { state } from '../../state';
import { BsPencilSquare } from 'react-icons/bs';

interface Props {
  setIsParticipantListOpen: (value: boolean) => void;
  setIsNominationFormOpen: (value: boolean) => void;
}

const Actions: React.FC<Props> = ({
  setIsParticipantListOpen,
  setIsNominationFormOpen,
}) => {
  const snap = useSnapshot(state);
  return (
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
  );
};

export default Actions;

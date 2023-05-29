import React, { useEffect, useState } from 'react';
import { actions, state } from '../state';
import { useSnapshot } from 'valtio';
import ConfirmationDialog from '@components/ui/ConfirmationDialog';
import ParticipantList from '@components/ParticipantList';
import NominationForm from '@components/NominationForm';
import { Actions, Header, Footer } from '@components/WaitingRoom';

const WaitingRoom: React.FC = () => {
  useEffect(() => {
    actions.initializeSocket();
  }, []);
  return (
    <>
      <section className="flex flex-col w-full justify-between items-center h-full">
        <Header />
        <Actions />
        <Footer />
      </section>
    </>
  );
};

export default WaitingRoom;

import React from 'react';
import { AppPage, actions } from '../state';

const Welcome: React.FC = () => {
  return (
    <header className="flex flex-col justify-center items-center h-full">
      <h1 className="text-center my-12">Welcome to Rankr</h1>
      <section className="my-12 flex flex-col justify-center">
        <button
          className="box btn-orange my-2"
          onClick={() => actions.setPage(AppPage.Create)}
        >
          Create new poll
        </button>
        <button
          className="box btn-purple my-2"
          onClick={() => actions.setPage(AppPage.Join)}
        >
          Join existing poll
        </button>
      </section>
    </header>
  );
};

export default Welcome;

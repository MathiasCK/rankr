import React, { useEffect } from 'react';
import { Welcome, Create, Join, WaitingRoom } from '@pages';
import { AppPage, actions, state } from './state';
import { CSSTransition } from 'react-transition-group';
import { useSnapshot } from 'valtio';

const routeConfig = {
  [AppPage.Welcome]: Welcome,
  [AppPage.Create]: Create,
  [AppPage.Join]: Join,
  [AppPage.WaitingRoom]: WaitingRoom,
};

const Pages: React.FC = () => {
  const snap = useSnapshot(state);

  useEffect(() => {
    // If token is loaded and a poll exists and poll has not started
    if (snap.me?.id && snap.poll && !snap.poll?.hasStarted) {
      actions.setPage(AppPage.WaitingRoom);
    }
  }, [snap.me?.id, snap.poll?.hasStarted]);
  return (
    <>
      {Object.entries(routeConfig).map(([page, Component]) => (
        <CSSTransition
          key={page}
          in={page === snap.currentPage}
          timeout={300}
          classNames="page"
          unmountOnExit
        >
          <div className="page mobile-height max-w-screen-sm mx-auto py-8 px-4 overflow-y-auto">
            <Component />
          </div>
        </CSSTransition>
      ))}
    </>
  );
};

export default Pages;

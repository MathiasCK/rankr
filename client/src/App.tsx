import React, { useEffect } from 'react';
import { devtools } from 'valtio/utils';

import './index.css';
import Pages from './Pages';
import Loader from '@components/ui/Loader';
import SnackBar from '@components/ui/SnackBar';
import { actions, state } from './state';
import { useSnapshot } from 'valtio';
import { getTokenPayload } from './util';

devtools(state, { name: 'app state' });
const App: React.FC = () => {
  const snap = useSnapshot(state);

  useEffect(() => {
    actions.startLoading();

    const accessToken = localStorage.getItem('accessToken');

    // If there is no access token, we'll be shown the default
    // state.currentPage pf AppPage.Welcome
    if (!accessToken) {
      actions.stopLoading();
      return;
    }

    const { exp: tokenExp } = getTokenPayload(accessToken);
    const currentTimeSeconds = Date.now() / 1000;

    // Remove old token
    // If token is within 10 seconds, we'll prevent
    // them from connection (poll will almost be over)
    // since token duration and poll duration are
    // approximately at the same time
    if (tokenExp < currentTimeSeconds - 10) {
      localStorage.removeItem('accessToken');
      actions.stopLoading();
      return;
    }

    // Reconnect to poll
    actions.setAccessToken(accessToken); // Needed for socket.io connection
    // Socket initialization on server sends updated poll to the client
    actions.initializeSocket();
  }, []);

  useEffect(() => {
    const myID = snap.me?.id;

    // If user is connected but not in the participants (kicked from poll)
    if (myID && snap.socket?.connected && !snap.poll?.participants[myID]) {
      actions.startOver();
    }
  }, [snap.poll?.participants]);
  return (
    <>
      <Loader isLoading={snap.isLoading} color="orange" width={120} />
      {snap.wsErrors.map((error) => (
        <SnackBar
          key={error.id}
          type="error"
          title={error.type}
          message={error.message}
          show={true}
          onClose={() => actions.removeWsError(error.id)}
          autoCloseDuration={5000}
        />
      ))}
      <Pages />
    </>
  );
};

export default App;

import React from 'react';
import { devtools } from 'valtio/utils';

import './index.css';
import Pages from './Pages';
import Loader from '@components/ui/Loader';
import { state } from './state';
import { useSnapshot } from 'valtio';

devtools(state, 'App state');
const App: React.FC = () => {
  const snap = useSnapshot(state);

  return (
    <>
      <Loader isLoading={snap.isLoading} color="orange" width={120} />
      <Pages />
    </>
  );
};

export default App;

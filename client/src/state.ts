import { Poll } from 'shared';
import { proxy, ref } from 'valtio';
import { derive, subscribeKey } from 'valtio/utils';
import { getTokenPayload } from './util';
import { socketIOUrl, createSocketWithHandlers } from './socket-io';
import { Socket } from 'socket.io-client';

export enum AppPage {
  Welcome = 'welcome',
  Create = 'create',
  Join = 'join',
  WaitingRoom = 'waitingRoom',
}

type Me = {
  id: string;
  name: string;
};

export type AppState = {
  currentPage: AppPage;
  isLoading: boolean;
  poll?: Poll;
  accessToken?: string;
  me?: Me;
  socket?: Socket;
};

const state: AppState = proxy({
  currentPage: AppPage.Welcome,
  isLoading: false,
});

const stateWithComputed: AppState = derive(
  {
    me: (get) => {
      const accessToken = get(state).accessToken;

      if (!accessToken) {
        return;
      }

      const token = getTokenPayload(accessToken);

      return {
        id: token.sub,
        name: token.name,
      };
    },
    isAdmin: (get) => {
      if (!get(state).me) {
        return false;
      }
      return get(state).me?.id === get(state).poll?.adminID;
    },
  },
  {
    proxy: state,
  }
);

const actions = {
  setPage: (page: AppPage): void => {
    state.currentPage = page;
  },
  startOver: (): void => {
    state.currentPage = AppPage.Welcome;
  },
  startLoading: (): void => {
    state.isLoading = true;
  },
  stopLoading: (): void => {
    state.isLoading = false;
  },
  initializePoll: (poll?: Poll): void => {
    state.poll = poll;
  },
  updatePoll: (poll?: Poll): void => {
    state.poll = poll;
  },
  setAccessToken: (token?: string): void => {
    state.accessToken = token;
  },
  initializeSocket: (): void => {
    if (!state.socket) {
      state.socket = ref(
        createSocketWithHandlers({
          socketIOUrl,
          state,
          actions,
        })
      );
    } else {
      state.socket.connect();
    }
  },
};

subscribeKey(state, 'accessToken', () => {
  if (state.accessToken && state.poll) {
    localStorage.setItem('accessToken', state.accessToken);
  } else {
    localStorage.removeItem('accessToken');
  }
});

export type AppActions = typeof actions;

export { stateWithComputed as state, actions };

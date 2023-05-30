import { Poll } from 'shared';
import { proxy, ref } from 'valtio';
import { subscribeKey } from 'valtio/utils';
import { getTokenPayload } from './util';
import { socketIOUrl, createSocketWithHandlers } from './socket-io';
import { Socket } from 'socket.io-client';
import { nanoid } from 'nanoid';

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

type WSError = {
  type: string;
  message: string;
};

type WSErrorUnique = WSError & { id: string };

export type AppState = {
  currentPage: AppPage;
  isLoading: boolean;
  poll?: Poll;
  accessToken?: string;
  socket?: Socket;
  wsErrors: WSErrorUnique[];
  me?: Me;
  isAdmin: boolean;
  nominationCount: number;
  participantCount: number;
  canStartVote: boolean;
};

const state = proxy<AppState>({
  currentPage: AppPage.Welcome,
  isLoading: false,
  wsErrors: [],
  get me() {
    const accessToken = this.accessToken;

    if (!accessToken) {
      return;
    }

    const token = getTokenPayload(accessToken);

    return { id: token.sub, name: token.name };
  },
  get isAdmin() {
    if (!this.me) {
      return false;
    }

    return this.me?.id === this.poll?.adminID;
  },
  get canStartVote() {
    const votesPerVoter = this.poll?.votesPerVoter ?? 100;
    return this.nominationCount >= votesPerVoter;
  },
  get participantCount() {
    return Object.keys(this.poll?.participants || {}).length;
  },
  get nominationCount() {
    return Object.keys(this.poll?.nominations || {}).length;
  },
});

const actions = {
  setPage: (page: AppPage): void => {
    state.currentPage = page;
  },
  reset: (): void => {
    state.socket?.disconnect();
    state.poll = undefined;
    state.accessToken = undefined;
    state.isLoading = false;
    state.socket = undefined;
    state.wsErrors = [];
  },
  startOver: (): void => {
    actions.reset();
    localStorage.removeItem('accessToken');
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
      return;
    }
    if (!state.socket.connected) {
      state.socket.connect();
      return;
    }
    actions.stopLoading();
  },
  nominate: (text: string): void => {
    state.socket?.emit('nominate', { text });
  },
  removeNomination: (id: string): void => {
    state.socket?.emit('remove_nomination', { id });
  },
  removeParticipant: (id: string): void => {
    state.socket?.emit('remove_participant', { id });
  },
  addWsError: (error: WSError): void => {
    state.wsErrors = [...state.wsErrors, { ...error, id: nanoid(6) }];
  },
  startPoll: (): void => {
    state.socket?.emit('start_poll');
  },
  removeWsError: (id: string): void => {
    state.wsErrors = state.wsErrors.filter((error) => error.id !== id);
  },
};

subscribeKey(state, 'accessToken', () => {
  if (state.accessToken) {
    localStorage.setItem('accessToken', state.accessToken);
  }
});

export type AppActions = typeof actions;

export { state, actions };

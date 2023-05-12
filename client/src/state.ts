import { Poll } from 'shared';
import { proxy } from 'valtio';

export enum AppPage {
  Welcome = 'welcome',
  Create = 'create',
  Join = 'join',
  WaitingRoom = 'waitingRoom',
}

export type AppState = {
  currentPage: AppPage;
  isLoading: boolean;
  poll?: Poll;
  accessToken?: string;
};

const state: AppState = proxy({
  currentPage: AppPage.Welcome,
  isLoading: false,
});

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
  setAccessToken: (token?: string): void => {
    state.accessToken = token;
  },
};

export { state, actions };

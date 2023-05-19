import React, { useState } from 'react';
import { AppPage, actions } from '../state';
import { makeRequest } from '../api';
import { Poll } from 'shared';

const Join: React.FC = () => {
  const [name, setName] = useState('');
  const [pollID, setPollID] = useState('');
  const [apiError, setApiError] = useState('');

  const validateFields = (): boolean => {
    return pollID.length === 6 && name.length > 0 && name.length <= 25;
  };

  const handleJoinPoll = async () => {
    actions.startLoading();
    setApiError('');

    const { data, error } = await makeRequest<{
      poll: Poll;
      accesToken: string;
    }>('/api/polls/join', {
      method: 'POST',
      body: JSON.stringify({
        pollID,
        name,
      }),
    });

    console.log(data, error);

    if (error && error.statusCode == 400) {
      setApiError('Please make sure to include a poll topic');
    } else if (error && !error.statusCode) {
      setApiError('Unknown API error');
    } else {
      actions.initializePoll(data.poll);
      actions.setAccessToken(data.accesToken);
      actions.setPage(AppPage.WaitingRoom);
    }

    actions.stopLoading();
  };

  return (
    <section className="flex flex-col w-full justify-around items-stretch h-full mx-auto max-w-sum">
      <article className="mb-12">
        <div className="my-4">
          <h3 className="text-center">
            Enter code provided by &quot;Friend&quot;
          </h3>
          <div className="text-center w-full">
            <input
              className="box info w-full"
              maxLength={6}
              onChange={(e) => setPollID(e.target.value)}
              autoCapitalize="characters"
              style={{ textTransform: 'uppercase' }}
            />
          </div>
        </div>
        <div className="my-4">
          <div className="text-center">Your name</div>
          <div className="text-center w-full">
            <input
              className="box info w-full"
              maxLength={25}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        {apiError && (
          <p className="text-center text-red-600 font-light mt-8">{apiError}</p>
        )}
      </article>
      <div className="my-12 flex flex-col justify-center items-center">
        <button
          className="box btn-orange w-32 my-2"
          disabled={!validateFields()}
          onClick={handleJoinPoll}
        >
          Join
        </button>
        <button
          className="box btn-purple w-32 my-2"
          onClick={() => actions.startOver()}
        >
          Start Over
        </button>
      </div>
    </section>
  );
};

export default Join;

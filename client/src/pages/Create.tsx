import React, { useState } from 'react';
import CountSelector from '@components/ui/CountSelector';
import { AppPage, actions } from '../state';
import { makeRequest } from '../api';
import { Poll } from 'shared';

const Create: React.FC = () => {
  const [pollTopic, setPollTopic] = useState('');
  const [maxVotes, setMaxVotes] = useState(3);
  const [name, setName] = useState('');
  const [apiError, setApiError] = useState('');

  const validateFields = (): boolean => {
    return (
      pollTopic.length > 0 &&
      pollTopic.length <= 100 &&
      maxVotes > 1 &&
      maxVotes <= 5 &&
      name.length > 0 &&
      name.length <= 25
    );
  };

  const handleCreatePoll = async () => {
    actions.startLoading();
    setApiError('');

    const { data, error } = await makeRequest<{
      poll: Poll;
      accessToken: string;
    }>('/api/polls', {
      method: 'POST',
      body: JSON.stringify({
        topic: pollTopic,
        votesPerVoter: maxVotes,
        name,
      }),
    });

    console.log(data, error);

    if (error && error.statusCode == 400) {
      console.log('400 error', error);
      setApiError('name and poll topic are both required');
    } else if (error && error.statusCode != 400) {
      setApiError(error.messages[0]);
    } else {
      actions.initializePoll(data.poll);
      actions.setAccessToken(data.accessToken);
      actions.setPage(AppPage.WaitingRoom);
    }

    actions.stopLoading();
  };

  return (
    <article className="flex flex-col w-full justify-around items-stretch h-full mx-auto max-w-sum">
      <div className="mb-12">
        <h3 className="text-center">Enter Poll Topic</h3>
        <section className="text-center w-full">
          <input
            maxLength={100}
            onChange={(e) => setPollTopic(e.target.value)}
            className="box info w-full"
          />
        </section>
        <h3 className="text-center mt-4 mb-3">Votes Per Participant</h3>
        <section className="w-48 mx-auto my-4">
          <CountSelector
            min={1}
            max={5}
            initial={maxVotes}
            step={1}
            onChange={(val: number) => setMaxVotes(val)}
          />
        </section>
        <section className="mb-12">
          <h3 className="text-center">Enter Name</h3>
          <div className="text-center w-full">
            <input
              maxLength={25}
              onChange={(e) => setName(e.target.value)}
              className="box info w-full"
            />
          </div>
        </section>
        {apiError && (
          <p className="text-center text-red-600 font-light mt-8">{apiError}</p>
        )}
      </div>
      <div className="flex flex-col justify-center items-cemter">
        <button
          className="box btn-orange w-32 my-2"
          onClick={handleCreatePoll}
          disabled={!validateFields()}
        >
          Create
        </button>
        <button
          className="box btn-purple w-32 my-2"
          onClick={() => actions.startOver()}
          disabled={false}
        >
          Start Over
        </button>
      </div>
    </article>
  );
};

export default Create;

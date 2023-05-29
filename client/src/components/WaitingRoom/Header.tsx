import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { state } from '../../state';
import { useCopyToClipboard } from 'react-use';
import { colorizeText } from '../../util';
import { MdContentCopy } from 'react-icons/md';
import SnackBar from '../ui/SnackBar';

const Header: React.FC = () => {
  const snap = useSnapshot(state);

  const [_copiedText, copyToClipboard] = useCopyToClipboard();
  const [showClipBoardMessage, setShowClipBoardMessage] = useState(false);
  return (
    <>
      {showClipBoardMessage && (
        <SnackBar
          type="message"
          title="Poll ID copied to clipboard!"
          message=""
          show={true}
          autoCloseDuration={1500}
          onClose={() => setShowClipBoardMessage(false)}
        />
      )}
      <header>
        <h2 className="text-center">Poll Topic</h2>
        <p className="italic text-center mb-4">{snap.poll?.topic}</p>
        <h2 className="text-center">Poll ID</h2>
        <h3 className="text-center mb-2">Click to copy!</h3>
        <div
          onClick={() => {
            copyToClipboard(snap.poll?.id || '');
            setShowClipBoardMessage(true);
          }}
          className="mb-4 flex justify-center align-middle cursor-pointer"
        >
          <div className="font-extrabold text-center mr-2">
            {snap.poll && colorizeText(snap.poll?.id)}
          </div>
          <MdContentCopy size={24} />
        </div>
      </header>
    </>
  );
};

export default Header;

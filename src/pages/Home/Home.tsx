import { Button, Chip, Divider, Input, Radio, RadioGroup } from '@nextui-org/react';
import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';
import { mode, Mode, reset } from '../../store/game';
import { connected, connection, error, hosted, peer } from '../../store/peer';
// import styles from './Home.module.scss';

/**
 * original props
 */
interface IProps {}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'main'>;

/**
 * `Home` props
 */
type TProps = IProps & TComponentProps;

const Home: React.FunctionComponent<TProps> = props => {
  useSignals();

  const { className, ...otherProps } = props;

  const navigate = useNavigate();
  const [remotePeerId, setRemotePeerId] = useState('');

  // const handleSizeChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
  //   const { value } = event.target;
  //   size.value = parseInt(value);
  // }, []);

  const handleModeChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(event => {
    const { value } = event.target;
    mode.value = value as Mode;
  }, []);

  const handleRemotePeerIdChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      const { value } = event.target;
      setRemotePeerId(value);
    },
    []
  );

  const handlePlayLocalButtonClick = useCallback(() => {
    navigate(ROUTES.PlayLocal);
  }, [navigate]);

  const handleHostButtonClick = useCallback(() => {
    navigate(ROUTES.Host);
  }, [navigate]);

  const handleJoinButtonClick = useCallback(() => {
    if (remotePeerId) {
      const id = encodeURIComponent(remotePeerId);
      const path = generatePath(ROUTES.PlayOnline, { id });
      navigate(path);
    }
  }, [navigate, remotePeerId]);

  useEffect(() => {
    reset();
    hosted.value = false;
    peer.value = null;
    connection.value = null;
    connected.value = false;
    error.value = null;
  }, []);

  return (
    <main
      className={classNames(className, 'flex flex-col gap-4')}
      {...otherProps}
    >
      <div className='flex justify-center'>
        <h1 className='text-4xl relative'>
          Tic-Tac-Toe
          <Chip
            size='sm'
            color='primary'
            className='text-sm absolute right-0 bottom-0 translate-x-1/2 translate-y-3/4 -rotate-12'
          >
            Advanced
          </Chip>
        </h1>
      </div>
      <section className='flex flex-col gap-4'>
        <RadioGroup
          label='Mode'
          value={mode.value}
        >
          {[Mode.Classic, Mode.Infinite, Mode.CoverUp].map(_mode => (
            <Radio
              key={_mode}
              value={_mode}
              onChange={handleModeChange}
            >
              {_mode}
            </Radio>
          ))}
        </RadioGroup>
        {/*
        <Input
          className="text-black"
          type="number"
          label="Size"
          min={3}
          max={10}
          step={1}
          value={`${size.value}`}
          onChange={handleSizeChange}
        />
        */}
      </section>
      <section className='flex gap-2'>
        <Button onClick={handlePlayLocalButtonClick}>Local play</Button>
        <Button onClick={handleHostButtonClick}>Host a game</Button>
      </section>
      <Divider />
      <section className='flex items-end gap-2'>
        <Input
          value={remotePeerId}
          label='or connect to a host'
          labelPlacement='outside'
          placeholder='Enter the host ID'
          onChange={handleRemotePeerIdChange}
        />
        <Button
          disabled={!remotePeerId}
          onClick={handleJoinButtonClick}
        >
          Join
        </Button>
      </section>
    </main>
  );
};

Home.displayName = 'Home';

export default Home;

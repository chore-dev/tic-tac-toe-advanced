import { Button, Divider, Input, Radio, RadioGroup } from '@nextui-org/react';
import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';
import { mode, Mode } from '../../store/game';
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
      const path = generatePath(ROUTES.PlayOnline, { id: remotePeerId });
      navigate(path);
    }
  }, [navigate, remotePeerId]);

  useEffect(() => {
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
      <section className='flex flex-col gap-4'>
        <RadioGroup
          label='Mode'
          value={mode.value}
        >
          {[Mode.Advanced, Mode.Basic].map(_mode => (
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
      <p className='text-lg'>or connect to a host</p>
      <section className='flex gap-2'>
        <Input
          value={remotePeerId}
          placeholder='Enter the host ID'
          onChange={handleRemotePeerIdChange}
        />
        <Button onClick={handleJoinButtonClick}>Join</Button>
      </section>
    </main>
  );
};

Home.displayName = 'Home';

export default Home;

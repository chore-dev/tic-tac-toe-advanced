import { useLocalStorage } from '@gtomato-web/react-hooks';
import { Button, Chip, Input, Radio, RadioGroup } from '@nextui-org/react';
import { useSignals } from '@preact/signals-react/runtime';
import classNames from 'classnames';
import React, { useCallback, useEffect, useRef } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import Divider from '../../components/Divider/Divider';
import Typography from '../../components/Typography/Typography';
import { ROUTES } from '../../constants/routes';
import { MODES } from '../../constants/texts';
import { getDefaultMode } from '../../helpers/game';
import * as gameState from '../../store/game';
import { mode, Mode } from '../../store/game';
import * as peerState from '../../store/peer';
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
  const peerIdInputRef = useRef<HTMLInputElement>(null);
  const [_mode, , setMode] = useLocalStorage<Mode>('mode');

  // const handleSizeChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
  //   const { value } = event.target;
  //   size.value = parseInt(value);
  // }, []);

  const handleModeChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      const { value } = event.target;
      const _mode = parseInt(value) as Mode;
      setMode(_mode);
    },
    [setMode]
  );

  const handlePeerIdClear: Required<React.ComponentProps<typeof Input>>['onClear'] =
    useCallback(() => {
      const input = peerIdInputRef.current;
      if (input) {
        input.value = '';
      }
    }, []);

  const handlePlayLocalButtonClick = useCallback(() => {
    navigate(ROUTES.PlayLocal);
  }, [navigate]);

  const handleHostButtonClick = useCallback(() => {
    navigate(ROUTES.Host);
  }, [navigate]);

  const handleJoinFormSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    event => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);
      const peerId = formData.get('peerId');
      if (peerId) {
        const id = encodeURIComponent(peerId as string);
        const path = generatePath(ROUTES.PlayOnline, { id });
        navigate(path);
      } else {
        peerIdInputRef.current?.focus();
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (_mode !== null && typeof Mode[_mode] !== 'undefined') {
      // sync the value with the store
      mode.value = _mode;
    } else {
      // reset default value
      setMode(getDefaultMode());
    }
  }, [_mode, setMode]);

  useEffect(() => {
    gameState.reset();
    peerState.reset();
  }, []);

  return (
    <main
      className={classNames(className, 'flex flex-col gap-8')}
      {...otherProps}
    >
      <div className='flex justify-center'>
        <Typography
          as='h1'
          className='relative'
          variant='title1'
        >
          Tic-Tac-Toe
          <Chip
            size='sm'
            color='primary'
            className='text-sm absolute right-0 bottom-0 translate-x-1/2 translate-y-3/4 -rotate-12'
          >
            Advanced
          </Chip>
        </Typography>
      </div>
      <section className='flex flex-col gap-4'>
        <RadioGroup
          label={<Typography variant='title5'>Mode</Typography>}
          value={`${mode.value}`}
        >
          {[Mode.Classic, Mode.Infinite, Mode.CoverUp].map(_mode => (
            <Radio
              key={_mode}
              value={`${_mode}`}
              onChange={handleModeChange}
            >
              <Typography variant='title5'>{MODES[_mode]}</Typography>
            </Radio>
          ))}
        </RadioGroup>
        {/*
        <Input
          type="number"
          label="Size"
          labelPlacement='outside'
          min={3}
          max={10}
          step={1}
          // value={`${size.value}`}
          // onChange={handleSizeChange}
        />
        */}
      </section>
      <section className='flex gap-4'>
        <Button
          color='secondary'
          onClick={handlePlayLocalButtonClick}
        >
          Local play
        </Button>
        <Button
          color='primary'
          onClick={handleHostButtonClick}
        >
          Host a game
        </Button>
      </section>
      <Divider>
        <Typography variant='title5'>or</Typography>
      </Divider>
      <form
        action=''
        onSubmit={handleJoinFormSubmit}
      >
        <section className='flex items-end gap-4'>
          {/* FIXME cannot show native form validation error message */}
          <Input
            ref={peerIdInputRef}
            className='w-60'
            type='text'
            required
            label={
              <Typography
                as='h2'
                variant='title4'
              >
                connect to a host
              </Typography>
            }
            labelPlacement='outside'
            placeholder='Enter the host ID'
            name='peerId'
            isClearable
            onClear={handlePeerIdClear}
          />
          <Button
            type='submit'
            color='primary'
          >
            Join
          </Button>
        </section>
      </form>
    </main>
  );
};

Home.displayName = 'Home';

export default Home;

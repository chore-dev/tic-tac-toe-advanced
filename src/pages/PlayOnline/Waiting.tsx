import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useClipboard from '@gtomato-web/react-hooks/lib/web/useClipboard';
import {
  Button,
  CircularProgress,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@nextui-org/react';
import classNames from 'classnames';
import React, { useCallback } from 'react';

// import styles from './Waiting.module.scss';

/**
 * original props
 */
interface IProps {
  /** the host peer ID */
  id: string;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'section'>;

/**
 * `Waiting` props
 */
type TProps = IProps & TComponentProps;

const Waiting: React.FunctionComponent<TProps> = props => {
  const { className, id, ...otherProps } = props;

  const [copy] = useClipboard();

  const handleCopyButtonClick = useCallback(() => {
    copy(id);
  }, [id, copy]);

  return (
    <section
      className={classNames(className, 'flex flex-col items-center gap-4')}
      {...otherProps}
    >
      <div className='flex items-center justify-center gap-4 text-2xl'>
        Waiting for connection... <CircularProgress size='sm' />
      </div>
      <div className='flex items-center gap-2'>
        {id}
        <Popover placement='right'>
          <PopoverTrigger>
            <Button
              isIconOnly
              size='sm'
              onClick={handleCopyButtonClick}
              aria-label='Copy'
            >
              <FontAwesomeIcon icon={faCopy} />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <span>Copied</span>
          </PopoverContent>
        </Popover>
      </div>
    </section>
  );
};

Waiting.displayName = 'Waiting';

export default Waiting;

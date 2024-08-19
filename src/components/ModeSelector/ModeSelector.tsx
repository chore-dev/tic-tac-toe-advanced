import useMounted from '@gtomato-web/react-hooks/lib/core/useMounted';
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import ModeCard from './ModeCard';
import styles from './ModeSelector.module.scss';

type TOption<V> = {
  label: string;
  value: V;
};

/**
 * original props
 */
interface IProps<V> {
  options: TOption<V>[];
  defaultValue?: V;
  onChange?: (option: TOption<V>) => void;
}

/**
 * component props
 */
type TComponentProps = React.ComponentPropsWithoutRef<'div'>;
type TOmittedProps = 'onChange' | 'defaultValue';

/**
 * `ModeSelector` props
 */
type TProps<V> = IProps<V> & Omit<TComponentProps, TOmittedProps>;

function ModeSelector<Value = unknown>(props: TProps<Value>) {
  const { className, options, defaultValue, onChange, ...otherProps } = props;

  const mounted = useMounted();
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const handleSwiperInit = useCallback(
    (swiper: SwiperClass) => {
      const index =
        typeof defaultValue !== 'undefined'
          ? options.findIndex(({ value }) => value === defaultValue)
          : 0;
      swiper.slideTo(index, 0);
    },
    [options, defaultValue]
  );

  const handleSlideChange = useCallback(
    (swiper: SwiperClass) => {
      const option = options[swiper.realIndex]!;
      onChange?.(option);
    },
    [options, onChange]
  );

  const handleSlideClick: Required<React.ComponentProps<typeof SwiperSlide>>['onClick'] =
    useCallback(
      event => {
        const { index } = event.currentTarget.dataset;
        const _index = parseInt(index!);
        swiper?.slideTo(_index);
      },
      [swiper]
    );

  return (
    <div
      className={classNames(className, styles.swiper, { [styles.mounted!]: mounted })}
      {...otherProps}
    >
      <Swiper
        centeredSlides
        slidesPerView={2}
        spaceBetween={16}
        onInit={handleSwiperInit}
        onSlideChange={handleSlideChange}
        onSwiper={setSwiper}
      >
        {options.map((option, index) => (
          <SwiperSlide
            key={index}
            onClick={handleSlideClick}
            data-index={index}
          >
            <ModeCard
              className={classNames('cursor-pointer', styles.modeCard)}
              name={option.label}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

ModeSelector.displayName = 'ModeSelector';

export default ModeSelector;

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select/Select';
import { Separator } from 'src/ui/separator';
import { RadioGroup } from 'src/ui/radio-group';

import {
  fontFamilyOptions,
  fontSizeOptions,
  fontColors,
  backgroundColors,
  contentWidthArr,
  ArticleStateType,
  defaultArticleState,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';


type Props = {
  onApply: (v: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ onApply }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<ArticleStateType>(defaultArticleState);
  const asideRef = useRef<HTMLElement | null>(null);

  const handleToggle = () => setIsOpen((v) => !v);
  const handleClose = () => setIsOpen(false);

  // закрытие панели по клику вне её области
  useEffect(() => {
    if (!isOpen) return;

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (asideRef.current?.contains(target)) return;
      handleClose();
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isOpen]);

  // универсальный апдейт: подставляем целый OptionType (как в defaultArticleState)
  const updateField = <K extends keyof ArticleStateType>(key: K, newValue: ArticleStateType[K]) => {
    setDraft((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleReset = () => {
    setDraft(defaultArticleState);
  };

  return (
    <>
      <ArrowButton isOpen={isOpen} onClick={handleToggle} />

      <aside
        ref={asideRef}
        className={clsx(styles.container, isOpen && styles.container_open)}
        aria-hidden={!isOpen}>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            onApply(draft);
            // draft уже содержит примененные значения, оставляем его как есть
          }}
        >
          {/* Заголовок панели */}
          <div className={styles.header}>
            <Text as="h3" size={22} weight={800} uppercase>
              ЗАДАЙТЕ ПАРАМЕТРЫ
            </Text>
          </div>

          {/* 1) Шрифт — Select (список) */}
          <div className={styles.block}>
            <Select
              title="Шрифт"
              options={fontFamilyOptions}
              selected={draft.fontFamilyOption}
              onChange={(opt) => updateField('fontFamilyOption', opt)}
            />
          </div>

          {/* 2) Размер текста — RadioGroup */}
          <div className={styles.block}>
            <RadioGroup
              name="fontSize"
              title="Размер текста"
              options={fontSizeOptions}
              selected={draft.fontSizeOption}
              onChange={(opt) => updateField('fontSizeOption', opt)}
            />
          </div>

          {/* 3) Цвет текста — Select (список) */}
          <div className={styles.block}>
            <Select
              title="Цвет текста"
              options={fontColors}
              selected={draft.fontColor}
              onChange={(opt) => updateField('fontColor', opt)}
            />
          </div>

          <Separator />

          {/* 4) Цвет фона — Select (список) */}
          <div className={clsx(styles.block, styles.blockAfterSeparator)}>
            <Select
              title="Цвет фона"
              options={backgroundColors}
              selected={draft.backgroundColor}
              onChange={(opt) => updateField('backgroundColor', opt)}
            />
          </div>

          {/* 5) Ширина контента — Select (список) */}
          <div className={styles.block}>
            <Select
              title="Ширина контента"
              options={contentWidthArr}
              selected={draft.contentWidth}
              onChange={(opt) => updateField('contentWidth', opt)}
            />
          </div>

          <div className={styles.bottomContainer}>
            <Button
              title="Сбросить"
              htmlType="button"
              type="clear"
              onClick={handleReset}
            />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </>
  );
};

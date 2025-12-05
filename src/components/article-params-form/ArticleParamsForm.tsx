import { useEffect, useRef, useState } from 'react';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select/Select';
import { Separator } from 'src/ui/separator';

import {
  fontFamilyOptions,
  fontSizeOptions,
  fontColors,
  backgroundColors,
  contentWidthArr,
  ArticleStateType,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';


type Props = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  value: ArticleStateType;
  onApply: (v: ArticleStateType) => void;
  onReset: () => void;
};

export const ArticleParamsForm = ({
  isOpen,
  onToggle,
  onClose,
  value,
  onApply,
  onReset,
}: Props) => {
  // локальный черновик — для редактирования в панели
  const [draft, setDraft] = useState<ArticleStateType>(value);
  const asideRef = useRef<HTMLElement | null>(null);

  // синхроним черновик с внешним value (например, после сброса в parent)
  useEffect(() => {
    setDraft(value);
  }, [value]);

  // закрытие панели по клику вне её области
  useEffect(() => {
    if (!isOpen) return;

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (asideRef.current?.contains(target)) return;
      onClose();
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isOpen, onClose]);

  // универсальный апдейт: подставляем целый OptionType (как в defaultArticleState)
  const updateField = <K extends keyof ArticleStateType>(key: K, newValue: ArticleStateType[K]) => {
    setDraft((prev) => ({ ...prev, [key]: newValue }));
  };

  return (
    <>
      <ArrowButton isOpen={isOpen} onClick={onToggle} />

      <aside
        ref={asideRef}
        className={`${styles.container} ${isOpen ? styles.container_open : ''}`}
        aria-hidden={!isOpen}>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            onApply(draft);
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

          {/* 2) Размер текста — три кнопки */}
          <div className={styles.block}>
            <Text weight={800} size={12} uppercase>
              Размер текста
            </Text>
            <div className={styles.fontSizeButtons}>
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.fontSizeButton} ${
                    draft.fontSizeOption.value === option.value ? styles.fontSizeButton_active : ''
                  }`}
                  onClick={() => updateField('fontSizeOption', option)}>
                  <Text weight={800} uppercase>
                    {option.title}
                  </Text>
                </button>
              ))}
            </div>
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
          <div className={`${styles.block} ${styles.blockAfterSeparator}`}>
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
              onClick={() => {
                onReset();
                // синхронизация произойдёт из useEffect, когда parent обновит value
              }}
            />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </>
  );
};

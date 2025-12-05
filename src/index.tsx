import { createRoot } from 'react-dom/client';
import { StrictMode, CSSProperties, useState } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import { defaultArticleState } from './constants/articleProps';

import './styles/index.scss';
import styles from './styles/index.module.scss';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

const App = () => {
	const [ isOpen, setIsOpen] = useState(false);

	const [params, setParams] = useState(defaultArticleState);

	const handleToggle = () => setIsOpen((v) => !v);
	const handleClose = () => setIsOpen(false);

	const handleApply = (newParams: typeof params) => {
		setParams(newParams);
	};

	const handleReset = () => {
		setParams(defaultArticleState);
	};

	return (
		<main
			className={clsx(styles.main)}
			style={
				{
					'--font-family': params.fontFamilyOption.value,
					'--font-size': params.fontSizeOption.value,
					'--font-color': params.fontColor.value,
					'--container-width': params.contentWidth.value,
					'--bg-color': params.backgroundColor.value,
				} as CSSProperties
			}>
			<ArticleParamsForm
				isOpen={isOpen}
				onToggle={handleToggle}
				onClose={handleClose}
				value={params}
				onApply={handleApply}
				onReset={handleReset}
			/>
			<Article />
		</main>
	);
};

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);

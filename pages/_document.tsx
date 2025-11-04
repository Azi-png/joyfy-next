import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/favicon.png" />

				{/* SEO */}
				<meta name="keyword" content={'joyfy, joyfy.uz, devex mern, mern nestjs fullstack'} />
				<meta
					name={'description'}
					content={
						'Learn and explore courses anytime, anywhere in South Korea. Best courses at best prices on Joyfy.uz | ' +
						'Изучайте и открывайте для себя курсы в любой точке Южной Кореи в любое время. Лучшие курсы по лучшим ценам на Joyfy.uz | ' +
						'대한민국 언제 어디서나 강좌를 배우고 찾아보세요. Joyfy.uz에서 최적의 가격으로 최고의 강좌를 만나보세요'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

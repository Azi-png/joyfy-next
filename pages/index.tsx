import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularCourses from '../libs/components/homepage/PopularCourses';
import TopTeachers from '../libs/components/homepage/TopTeachers';
// import Events from '../libs/components/homepage/Events';
import TrendCourses from '../libs/components/homepage/TrendCourses';

import { Stack } from '@mui/material';
import Advertisement from '../libs/components/homepage/Advertisement';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TopCourses from '../libs/components/homepage/TopCourses';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<TrendCourses />
				<PopularCourses />
				<Advertisement />
				<TopCourses />
				<TopTeachers />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<TrendCourses />
				<PopularCourses />
				<Advertisement />
				<TopCourses />
				<TopTeachers />
				{/* <Events /> */}
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);

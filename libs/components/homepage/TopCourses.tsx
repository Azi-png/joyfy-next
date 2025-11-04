import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopCourseCard from './TopCourseCard';
import { CoursesInquiry } from '../../types/course/course.input';
import { Course } from '../../types/course/course';
import { GET_COURSES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_COURSE } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface TopCoursesProps {
	initialInput: CoursesInquiry;
}

const TopCourses = (props: TopCoursesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topCourses, setTopCourses] = useState<Course[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetCourse] = useMutation(LIKE_TARGET_COURSE);

	const {
		loading: getCoursesLoading,
		data: getCoursesData,
		error: getCoursesError,
		refetch: getCoursesRefetch,
	} = useQuery(GET_COURSES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopCourses(data?.getCourses?.list);
		},
	});

	/** HANDLERS **/
	const likeCourseHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetCourse({
				variables: { input: id },
			});
			await getCoursesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeCourseHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'top-courses'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top courses</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-course-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{topCourses.map((course: Course) => {
								return (
									<SwiperSlide className={'top-course-slide'} key={course?._id}>
										<TopCourseCard course={course} likeCourseHandler={likeCourseHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-courses'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<Box component="span" sx={{ color: '#2e7acb !important' }}>
								Top courses
							</Box>
							<p>Check out our Top Courses</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-top-prev'} />
								<div className={'swiper-top-pagination'}></div>
								<EastIcon className={'swiper-top-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-course-swiper'}
							slidesPerView={'auto'}
							spaceBetween={15}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-top-next',
								prevEl: '.swiper-top-prev',
							}}
							pagination={{
								el: '.swiper-top-pagination',
							}}
						>
							{topCourses.map((course: Course) => {
								return (
									<SwiperSlide className={'top-course-slide'} key={course?._id}>
										<TopCourseCard course={course} likeCourseHandler={likeCourseHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopCourses.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'courseRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopCourses;

import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Course } from '../../types/course/course';
import { CoursesInquiry } from '../../types/course/course.input';
import TrendCourseCard from './TrendCourseCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_COURSES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_COURSE } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

interface TrendCoursesProps {
	initialInput: CoursesInquiry;
}

const TrendCourses = (props: TrendCoursesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendCourses, setTrendCourses] = useState<Course[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetCourse] = useMutation(LIKE_TARGET_COURSE);

	const {
		loading: getCoursesLoading,
		data: getCoursesData,
		error: getCoursesError,
		refetch: getCoursesRefetch,
	} = useQuery(GET_COURSES, {
		fetchPolicy: 'no-cache',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendCourses(data?.getCourses?.list);
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

	if (trendCourses) console.log('trendCourses:', trendCourses);
	if (!trendCourses) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'trend-courses'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Trend Courses</span>
					</Stack>
					<Stack className={'card-box'}>
						{trendCourses.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Courses Empty
							</Box>
						) : (
							// <Swiper
							// 	className={'trend-course-swiper'}
							// 	slidesPerView={'auto'}
							// 	centeredSlides={true}
							// 	spaceBetween={15}
							// 	modules={[Autoplay]}
							// >
							// 	{trendCourses.map((course: Course) => {
							// 		return (
							// 			<SwiperSlide key={course._id} className={'trend-course-slide'}>
							// 				<TrendCourseCard course={course} likeCourseHandler={likeCourseHandler} />
							// 			</SwiperSlide>
							// 		);
							// 	})}
							// </Swiper>
							<Stack className="trend-course-list">
								{trendCourses.map((course: Course) => {
									return (
										<Box key={course._id} className="trend-course-item">
											<TrendCourseCard course={course} likeCourseHandler={likeCourseHandler} />
										</Box>
									);
								})}
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-courses'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<Box component="span" sx={{ color: '#2e7acb !important' }}>
								Trend courses
							</Box>

							<p>Trend is based on likes</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-trend-prev'} />
								<div className={'swiper-trend-pagination'}></div>
								<EastIcon className={'swiper-trend-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendCourses.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Courses Empty
							</Box>
						) : (
							// <Swiper
							// 	className={'trend-course-swiper'}
							// 	slidesPerView={'auto'}
							// 	spaceBetween={15}
							// 	modules={[Autoplay, Navigation, Pagination]}
							// 	navigation={{
							// 		nextEl: '.swiper-trend-next',
							// 		prevEl: '.swiper-trend-prev',
							// 	}}
							// 	pagination={{
							// 		el: '.swiper-trend-pagination',
							// 	}}
							// >
							// 	{trendCourses.map((course: Course) => {
							// 		return (
							// 			<SwiperSlide key={course._id} className={'trend-course-slide'}>
							// 				<TrendCourseCard course={course} likeCourseHandler={likeCourseHandler} />
							// 			</SwiperSlide>
							// 		);
							// 	})}
							// </Swiper>
							<Stack
								className="trend-course-list"
								sx={{
									display: 'grid',
									gridTemplateColumns: 'repeat(3, 1fr)', // 3 ta ustun
									gap: '20px', // orasidagi bo‘shliq
								}}
							>
								{trendCourses.map((course: Course) => {
									return (
										<Box key={course._id} className="trend-course-item">
											<TrendCourseCard course={course} likeCourseHandler={likeCourseHandler} />
										</Box>
									);
								})}
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendCourses.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'courseLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendCourses;

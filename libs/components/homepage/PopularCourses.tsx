import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularCourseCard from './PopularCourseCard';
import { Course } from '../../types/course/course';
import Link from 'next/link';
import { CoursesInquiry } from '../../types/course/course.input';
import { useQuery } from '@apollo/client';
import { GET_COURSES } from '../../../apollo/user/query';
import { T } from '../../types/common';

interface PopularCoursesProps {
	initialInput: CoursesInquiry;
}

const PopularCourses = (props: PopularCoursesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularCourses, setPopularCourses] = useState<Course[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getCoursesLoading,
		data: getCoursesData,
		error: getCoursesError,
		refetch: getCoursesRefetch,
	} = useQuery(GET_COURSES, {
		fetchPolicy: 'network-only',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setPopularCourses(data?.getCourses?.list);
		},
	});

	/** HANDLERS **/

	if (!popularCourses) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-courses'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Popular courses</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-course-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularCourses.map((course: Course) => {
								return (
									<SwiperSlide key={course._id} className={'popular-course-slide'}>
										<PopularCourseCard course={course} />
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
			<Stack className={'popular-courses'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<Box component="span" sx={{ color: '#2e7acb !important' }}>
								Popular courses
							</Box>
							<p>Popularity is based on views</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/course'}>
									<span>See All Categories</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-course-swiper'}
							slidesPerView={'auto'}
							spaceBetween={25}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
							}}
						>
							{popularCourses.map((course: Course) => {
								return (
									<SwiperSlide key={course._id} className={'popular-course-slide'}>
										<PopularCourseCard course={course} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularCourses.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'courseViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularCourses;

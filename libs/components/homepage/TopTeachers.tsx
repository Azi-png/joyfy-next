import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopTeacherCard from './TopTeacherCard';
import { Member } from '../../types/member/member';
import { TeachersInquiry } from '../../types/member/member.input';
import { T } from '../../types/common';
import { GET_TEACHERS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';

interface TopTeachersProps {
	initialInput: TeachersInquiry;
}

const TopTeachers = (props: TopTeachersProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [topTeachers, setTopTeachers] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getTeachersLoading,
		data: getTeachersData,
		error: getTeachersError,
		refetch: getTeachersRefetch,
	} = useQuery(GET_TEACHERS, {
		fetchPolicy: 'no-cache',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopTeachers(data?.getTeachers?.list);
		},
	});

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className={'top-teachers'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component="span" sx={{ color: '#2e7acb !important' }}>
							Top Teachers
						</Box>
					</Stack>
					<Stack className={'wrapper'}>
						<Swiper
							className={'top-teachers-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={29}
							modules={[Autoplay]}
						>
							{topTeachers.map((teacher: Member) => {
								return (
									<SwiperSlide className={'top-teachers-slide'} key={teacher?._id}>
										<TopTeacherCard teacher={teacher} key={teacher?.memberNick} />
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
			<Stack className={'top-teachers'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<Box component="span" sx={{ color: '#2e7acb !important' }}>
								The best instructors for your child!
							</Box>
							<p>Our Top Teachers always ready to serve you</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<span>See All Teachers</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'wrapper'}>
						<Box component={'div'} className={'switch-btn swiper-teachers-prev'}>
							<ArrowBackIosNewIcon />
						</Box>
						<Box component={'div'} className={'card-wrapper'}>
							<Swiper
								className={'top-teachers-swiper'}
								slidesPerView={'auto'}
								spaceBetween={29}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-teachers-next',
									prevEl: '.swiper-teachers-prev',
								}}
							>
								{topTeachers.map((teacher: Member) => {
									return (
										<SwiperSlide className={'top-teachers-slide'} key={teacher?._id}>
											<TopTeacherCard teacher={teacher} key={teacher?.memberNick} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						</Box>
						<Box component={'div'} className={'switch-btn swiper-teachers-next'}>
							<ArrowBackIosNewIcon />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopTeachers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopTeachers;

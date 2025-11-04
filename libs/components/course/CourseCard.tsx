import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Course } from '../../types/course/course';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topCourseRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface CourseCardType {
	course: Course;
	likeCourseHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const CourseCard = (props: CourseCardType) => {
	const { course, likeCourseHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = course?.courseImages[0]
		? `${REACT_APP_API_URL}/${course?.courseImages[0]}`
		: '/img/banner/header1.svg';

	// Format display helper
	const formatCourseFormat = (format: string | undefined): string => {
		if (!format) return '';

		const formatMap: { [key: string]: string } = {
			GROUP_CLASS: 'Group Class',
			ONE_ON_ONE_TUTORING: '1 0n 1 tutoring',
		};

		return formatMap[format] || format;
	};

	if (device === 'mobile') {
		return <div>COURSE CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<Link
						href={{
							pathname: '/course/detail',
							query: { id: course?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>
					{course && course?.courseRank > topCourseRank && (
						<Box component={'div'} className={'top-badge'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography>TOP</Typography>
						</Box>
					)}
					<Box component={'div'} className={'price-box'}>
						<Typography>${formatterStr(course?.coursePrice)}</Typography>
					</Box>
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/course/detail',
									query: { id: course?._id },
								}}
							>
								<Typography>{course.courseTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>
								{course.courseAddress}, {course.courseLocation}
							</Typography>
						</Stack>
					</Stack>
					<Stack className="options">
						<Stack className="option">
							{/* <img src="/img/icons/bed.svg" alt="" style={{ width: '16px', height: '16px' }} /> */}
							<Typography>age: {course.courseAge}</Typography>
						</Stack>
						<Stack className="option">
							<img src="/img/icons/clock.png" alt="" style={{ width: '16px', height: '16px' }} />{' '}
							<Typography>{course.courseDuration}min</Typography>
						</Stack>
						<Stack className="option">
							<img src="/img/icons/expand.svg" alt="" />{' '}
							<Typography>{formatCourseFormat(course?.courseFormat)}</Typography>
						</Stack>
					</Stack>
					<Stack className="divider"></Stack>
					<Stack className="type-buttons">
						<Stack direction="row" spacing={1}>
							<Typography
								sx={{
									fontWeight: 500,
									fontSize: '13px',
									px: 1.5,
									py: 0.5,
									borderRadius: '6px',
									backgroundColor: course.isOffline ? '#e6f4ff' : '#f5f5f5', // juda och havorang yoki kulrang
									color: course.isOffline ? '#1a73e8' : '#888', // havorang yoki kulrang
									cursor: 'default',
								}}
							>
								Offline
							</Typography>

							<Typography
								sx={{
									fontWeight: 500,
									fontSize: '13px',
									px: 1.5,
									py: 0.5,
									borderRadius: '6px',
									backgroundColor: course.isOnline ? '#e6f4ff' : '#f5f5f5',
									color: course.isOnline ? '#1a73e8' : '#888',
									cursor: 'default',
								}}
							>
								Online
							</Typography>
						</Stack>

						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{course?.courseViews}</Typography>
								<IconButton color={'default'} onClick={() => likeCourseHandler(user, course?._id)}>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : course?.meLiked && course?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{course?.courseLikes}</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CourseCard;

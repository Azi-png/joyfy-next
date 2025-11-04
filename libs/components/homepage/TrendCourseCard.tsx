import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Course } from '../../types/course/course';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TrendCourseCardProps {
	course: Course;
	likeCourseHandler: any;
}

const TrendCourseCard = (props: TrendCourseCardProps) => {
	const { course, likeCourseHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/

	// Format display helper
	const formatCourseFormat = (format: string | undefined): string => {
		if (!format) return '';

		const formatMap: { [key: string]: string } = {
			GROUP_CLASS: 'Group',
			ONE_ON_ONE_TUTORING: '1 0n 1',
		};

		return formatMap[format] || format;
	};

	const pushDetailHandler = async (courseId: string) => {
		console.log('courseId:', courseId);
		await router.push({ pathname: '/course/detail', query: { id: courseId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="trend-card-box" key={course._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${course?.courseImages[0]})` }}
					onClick={() => pushDetailHandler(course._id)}
				>
					<div>${course.coursePrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(course._id)}>
						{course.courseTitle}
					</strong>
					<p className={'desc'}>{course.courseDesc ?? 'no description'}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>age: {course.courseAge}</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{course.courseDuration}min</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{formatCourseFormat(course?.courseFormat)}</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{course.isOffline ? 'Rent' : ''} {course.isOffline && course.isOnline && '/'}{' '}
							{course.isOnline ? 'Barter' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{course?.courseViews}</Typography>
							<IconButton color={'default'} onClick={() => likeCourseHandler(user, course?._id)}>
								{course?.meLiked && course?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{course?.courseLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="trend-card-box" key={course._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${course?.courseImages[0]})` }}
					onClick={() => {
						pushDetailHandler(course._id);
					}}
				>
					<div>${course.coursePrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(course._id);
						}}
					>
						{course.courseTitle}{' '}
					</strong>
					<p className={'desc'}>{course.courseDesc ?? 'no description'}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/age.png" alt="" />
							<span>age: {course.courseAge}</span>
						</div>
						<div>
							<img src="/img/icons/clock.png" alt="" />
							<span>{course.courseDuration}min</span>
						</div>
						<div>
							<img src="/img/icons/teacher.png" alt="" />
							<span>{formatCourseFormat(course?.courseFormat)}</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p className="course-status">{course?.isOffline ? 'Offline Available' : 'Online Only'}</p>

						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{course?.courseViews}</Typography>
							<IconButton color={'default'} onClick={() => likeCourseHandler(user, course?._id)}>
								{course?.meLiked && course?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{course?.courseLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default TrendCourseCard;

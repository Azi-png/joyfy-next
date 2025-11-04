import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Course } from '../../types/course/course';
import { REACT_APP_API_URL, topCourseRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface CourseBigCardProps {
	course: Course;
	likeCourseHandler?: any;
}

const CourseBigCard = (props: CourseBigCardProps) => {
	const { course, likeCourseHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	// Format display helper
	const formatCourseFormat = (format: string | undefined): string => {
		if (!format) return '';

		const formatMap: { [key: string]: string } = {
			GROUP_CLASS: 'Group Class',
			ONE_ON_ONE_TUTORING: '1 0n 1 tutoring',
		};

		return formatMap[format] || format;
	};

	const goCourseDetatilPage = (courseId: string) => {
		router.push(`/course/detail?id=${courseId}`);
	};

	if (device === 'mobile') {
		return <div>APARTMEND BIG CARD</div>;
	} else {
		return (
			<Stack className="course-big-card-box" onClick={() => goCourseDetatilPage(course?._id)}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${course?.courseImages?.[0]})` }}
				>
					{course && course?.courseRank >= topCourseRank && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					)}

					<div className={'price'}>${formatterStr(course?.coursePrice)}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{course?.courseTitle}</strong>
					<p className={'desc'}>{course?.courseAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/age.png" alt="" />
							<span>age: {course?.courseAge} </span>
						</div>
						<div>
							<img src="/img/icons/clock.png" alt="" />
							<span>duration: {course?.courseDuration}min</span>
						</div>
						<div>
							<img src="/img/icons/teacher.png" alt="" />
							<Stack className="option">{formatCourseFormat(course?.courseFormat)}</Stack>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div>
							{course?.isOffline ? <p>Offline</p> : <span>Offline</span>}
							{course?.isOnline ? <p>Online</p> : <span>Online</span>}
						</div>
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{course?.courseViews}</Typography>
							<IconButton
								color={'default'}
								onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
									e.stopPropagation();
									console.log('LIKE CLICKED', course?._id, user);
									likeCourseHandler(user, course?._id);
								}}
							>
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

export default CourseBigCard;

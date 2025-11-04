import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Course } from '../../types/course/course';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL, topCourseRank } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface PopularCourseCardProps {
	course: Course;
}

const PopularCourseCard = (props: PopularCourseCardProps) => {
	const { course } = props; // Tuzatildi: course: course o'rniga
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/

	const pushDetailHandler = async (courseId: string) => {
		console.log('courseId:', courseId);
		await router.push({ pathname: '/course/detail', query: { id: courseId } });
	};

	// Format display helper
	const formatCourseFormat = (format: string | undefined): string => {
		if (!format) return '';

		const formatMap: { [key: string]: string } = {
			GROUP_CLASS: 'Group',
			ONE_ON_ONE_TUTORING: '1 0n 1',
		};

		return formatMap[format] || format;
	};

	// Rasm URL yaratish
	const getImageUrl = () => {
		if (course?.courseImages && course.courseImages.length > 0 && course.courseImages[0]) {
			return `${REACT_APP_API_URL}/${course.courseImages[0]}`;
		}
		return '/img/default-course.jpg';
	};

	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{
						backgroundImage: `url("${getImageUrl()}")`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						minHeight: '200px',
					}}
					onClick={() => pushDetailHandler(course._id)}
				>
					{course && course?.courseRank >= topCourseRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${course.coursePrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(course._id)}>
						{course.courseTitle}
					</strong>
					<p className={'desc'}>{course.courseAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/age.png" alt="" />
							<span>{course?.courseAge} age</span>
						</div>
						<div>
							<img src="/img/icons/clock.png" alt="" />
							<span>{course?.courseDuration} min</span>
						</div>
						<div>
							<img src="/img/icons/teacher.png" alt="" />
							<span>{formatCourseFormat(course?.courseFormat)}</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>{course?.isOffline ? 'Offline' : 'Online'}</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{course?.courseViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{
						backgroundImage: `url("${getImageUrl()}")`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						minHeight: '250px',
					}}
					onClick={() => pushDetailHandler(course._id)}
				>
					{course && course?.courseRank >= topCourseRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${course.coursePrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(course._id)}>
						{course.courseTitle}
					</strong>
					<p className={'desc'}>{course.courseAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/age.png" alt="" />
							<span>Age: {course?.courseAge}</span>
						</div>
						<div>
							<img src="/img/icons/clock.png" alt="" />
							<span>{course?.courseDuration} min</span>
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
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularCourseCard;

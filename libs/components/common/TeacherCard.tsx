import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TeacherCardProps {
	teacher: any;
	likeMemberHandler: any;
}

const TeacherCard = (props: TeacherCardProps) => {
	const { teacher, likeMemberHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = teacher?.memberImage
		? `${REACT_APP_API_URL}/${teacher?.memberImage}`
		: '/img/profile/defaultUser.svg';

	if (device === 'mobile') {
		return <div>TEACHER CARD</div>;
	} else {
		return (
			<Stack className="teacher-general-card">
				<Link
					href={{
						pathname: '/teacher/detail',
						query: { teacherId: teacher?._id },
					}}
				>
					<Box
						component={'div'}
						className={'teacher-img'}
						style={{
							backgroundImage: `url(${imagePath})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}}
					>
						<div
							style={{
								backgroundColor: '#5ba3e0', // och havorang (light blue)
							}}
						>
							{teacher?.memberCourses} courses
						</div>
					</Box>
				</Link>

				<Stack className={'teacher-desc'}>
					<Box component={'div'} className={'teacher-info'}>
						<Link
							href={{
								pathname: '/teacher/detail',
								query: { teacherId: 'id' },
							}}
						>
							<strong>{teacher?.memberFullName ?? teacher?.memberNick}</strong>
						</Link>
						<span>Teacher</span>
					</Box>
					<Box component={'div'} className={'buttons'}>
						<IconButton color={'default'}>
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography className="view-cnt">{teacher?.memberViews}</Typography>
						<IconButton color={'default'} onClick={() => likeMemberHandler(user, teacher?._id)}>
							{teacher?.meLiked && teacher?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon color={'primary'} />
							) : (
								<FavoriteBorderIcon />
							)}
						</IconButton>
						<Typography className="view-cnt">{teacher?.memberLikes}</Typography>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default TeacherCard;

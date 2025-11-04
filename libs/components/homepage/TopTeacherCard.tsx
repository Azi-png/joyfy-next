import React from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';

interface TopTeacherProps {
	teacher: Member;
}
const TopTeacherCard = (props: TopTeacherProps) => {
	const { teacher } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const teacherImage = teacher?.memberImage
		? `${process.env.REACT_APP_API_URL}/${teacher?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-teacher-card">
				<img src={teacherImage} alt="" />

				<strong>{teacher?.memberNick}</strong>
				<span>Teacher</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-teacher-card">
				<img src={teacherImage} alt="" />

				<strong>{teacher?.memberNick}</strong>
				{/* <span>{agent?.memberType}</span> */}
				<span>TEACHER</span>
			</Stack>
		);
	}
};

export default TopTeacherCard;

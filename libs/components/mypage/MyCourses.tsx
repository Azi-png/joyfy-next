import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CourseCard } from './CourseCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Course } from '../../types/course/course';
import { TeacherCoursesInquiry } from '../../types/course/course.input';
import { T } from '../../types/common';
import { CourseStatus } from '../../enums/course.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { GET_TEACHER_COURSES } from '../../../apollo/user/query';
import { UPDATE_COURSE } from '../../../apollo/user/mutation';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';

const MyCourses: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<TeacherCoursesInquiry>(initialInput);
	const [teacherCourses, setTeacherCourses] = useState<Course[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/

	const [updateCourse] = useMutation(UPDATE_COURSE);

	const {
		loading: getTeacherCoursesLoading,
		data: getTeacherCoursesData,
		error: getTeacherCoursesError,
		refetch: getTeacherCoursesRefetch,
	} = useQuery(GET_TEACHER_COURSES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTeacherCourses(data?.getTeacherCourses?.list);
			setTotal(data?.getTeacherCourses?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: CourseStatus) => {
		setSearchFilter({ ...searchFilter, search: { courseStatus: value } });
	};

	const deleteCourseHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('are you sure to delete this course?')) {
				await updateCourse({
					variables: {
						input: {
							_id: id,
							courseStatus: 'DELETE',
						},
					},
				});
			}

			await getTeacherCoursesRefetch({ input: searchFilter });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const updateCourseHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`are you sure to change to ${status} status?`)) {
				await updateCourse({
					variables: {
						input: {
							_id: id,
							courseStatus: status,
						},
					},
				});
			}

			await getTeacherCoursesRefetch({ input: searchFilter });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'TEACHER') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>JOYFY COURSES MOBILE</div>;
	} else {
		return (
			<div id="my-course-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Courses</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="course-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(CourseStatus.ACTIVE)}
							className={searchFilter.search.courseStatus === 'ACTIVE' ? 'active-tab-name' : 'tab-name'}
						>
							Active
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(CourseStatus.CANCELLED)}
							className={searchFilter.search.courseStatus === 'CANCELLED' ? 'active-tab-name' : 'tab-name'}
						>
							Cancelled
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Listing title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							{searchFilter.search.courseStatus === 'ACTIVE' && <Typography className="title-text">Action</Typography>}
						</Stack>

						{teacherCourses?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No course found!</p>
							</div>
						) : (
							teacherCourses.map((course: Course) => {
								return (
									<CourseCard
										course={course}
										deleteCourseHandler={deleteCourseHandler}
										updateCourseHandler={updateCourseHandler}
									/>
								);
							})
						)}

						{teacherCourses.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} course available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyCourses.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			courseStatus: 'ACTIVE',
		},
	},
};

export default MyCourses;

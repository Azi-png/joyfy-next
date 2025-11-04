import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CourseFormat, CourseLocation, CourseType } from '../../enums/course.enum';
import { CoursesInquiry } from '../../types/course/course.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { courseFormat } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: CoursesInquiry;
	setSearchFilter: any;
	initialInput: CoursesInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [courseLocation, setCourseLocation] = useState<CourseLocation[]>(Object.values(CourseLocation));
	const [courseType, setCourseType] = useState<CourseType[]>(Object.values(CourseType));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
			router
				.push(
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router
				.push(
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		// Add formatList lifecycle check
		if (searchFilter?.search?.formatList?.length == 0) {
			delete searchFilter.search.formatList;
			router
				.push(
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.options?.length == 0) {
			delete searchFilter.search.options;
			router
				.push(
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.agesList?.length == 0) {
			delete searchFilter.search.agesList;
			router
				.push(
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/
	const courseLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					await router.push(
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('courseLocationSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, courseLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const courseTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('courseTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, courseTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	// Add Course Format Select Handler
	const courseFormatSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, formatList: [...(searchFilter?.search?.formatList || []), value] },
						})}`,
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, formatList: [...(searchFilter?.search?.formatList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.formatList?.includes(value)) {
					await router.push(
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								formatList: searchFilter?.search?.formatList?.filter((item: string) => item !== value),
							},
						})}`,
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								formatList: searchFilter?.search?.formatList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('courseFormatSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, courseFormatSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const courseOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.options?.includes(value)) {
					await router.push(
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('courseOptionSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, courseOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const courseAgeSelectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number != 0) {
					if (searchFilter?.search?.agesList?.includes(number)) {
						await router.push(
							`/course?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									agesList: searchFilter?.search?.agesList?.filter((item: Number) => item !== number),
								},
							})}`,
							`/course?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									agesList: searchFilter?.search?.agesList?.filter((item: Number) => item !== number),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/course?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, agesList: [...(searchFilter?.search?.agesList || []), number] },
							})}`,
							`/course?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, agesList: [...(searchFilter?.search?.agesList || []), number] },
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.agesList;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/course?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('courseSelectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, courseBedSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const coursePriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/course?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/course?input=${JSON.stringify(initialInput)}`,
				`/course?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>COURSES FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Course</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Location
					</p>
					<Stack
						className={`course-location`}
						style={{ height: showMore ? '253px' : '115px' }}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.locationList) {
								setShowMore(false);
							}
						}}
					>
						{courseLocation.map((location: string) => {
							return (
								<Stack className={'input-box'} key={location}>
									<Checkbox
										id={location}
										className="course-checkbox"
										color="default"
										size="small"
										value={location}
										checked={(searchFilter?.search?.locationList || []).includes(location as CourseLocation)}
										onChange={courseLocationSelectHandler}
									/>
									<label htmlFor={location} style={{ cursor: 'pointer' }}>
										<Typography className="course-type">{location}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}> Course type</Typography>
					{courseType.map((type: string) => (
						<Stack className={'input-box'} key={type}>
							<Checkbox
								id={type}
								className="course-checkbox"
								color="default"
								size="small"
								value={type}
								onChange={courseTypeSelectHandler}
								checked={(searchFilter?.search?.typeList || []).includes(type as CourseType)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="course">{type}</Typography>
							</label>
						</Stack>
					))}
				</Stack>

				{/* Add Course Format Filter Section */}
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Course Format</Typography>
					{Object.values(CourseFormat).map((format: CourseFormat) => (
						<Stack className={'input-box'} key={format}>
							<Checkbox
								id={format}
								className="course-checkbox"
								color="default"
								size="small"
								value={format}
								onChange={courseFormatSelectHandler}
								checked={(searchFilter?.search?.formatList || []).includes(format)}
							/>
							<label htmlFor={format} style={{ cursor: 'pointer' }}>
								<Typography className="course_type">
									{format === CourseFormat.GROUP_CLASS ? 'Group Class' : 'One-on-One Tutoring'}
								</Typography>
							</label>
						</Stack>
					))}
				</Stack>

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Ages</Typography>
					<Stack className="button-group">
						<Button
							sx={{
								borderRadius: '12px 0 0 12px',
								border: !searchFilter?.search?.agesList ? '2px solid #181A20' : '1px solid #b9b9b9',
							}}
							onClick={() => courseAgeSelectHandler(0)}
						>
							Any
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.agesList?.includes(1) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.agesList?.includes(1) ? undefined : 'none',
							}}
							onClick={() => courseAgeSelectHandler(1)}
						>
							3
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.agesList?.includes(2) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.agesList?.includes(2) ? undefined : 'none',
							}}
							onClick={() => courseAgeSelectHandler(2)}
						>
							4
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.agesList?.includes(3) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.agesList?.includes(3) ? undefined : 'none',
							}}
							onClick={() => courseAgeSelectHandler(3)}
						>
							5
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.agesList?.includes(4) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.agesList?.includes(4) ? undefined : 'none',
							}}
							onClick={() => courseAgeSelectHandler(4)}
						>
							6
						</Button>
						<Button
							sx={{
								borderRadius: '0 12px 12px 0',
								border: searchFilter?.search?.agesList?.includes(5) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.agesList?.includes(5) ? undefined : 'none',
							}}
							onClick={() => courseAgeSelectHandler(5)}
						>
							7+
						</Button>
					</Stack>
				</Stack>

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Options</Typography>
					<Stack className={'input-box'}>
						<Checkbox
							id={'Online'}
							className="course-checkbox"
							color="default"
							size="small"
							value={'isOnline'}
							checked={(searchFilter?.search?.options || []).includes('isOnline')}
							onChange={courseOptionSelectHandler}
						/>
						<label htmlFor={'Online'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">Online</Typography>
						</label>
					</Stack>
					<Stack className={'input-box'}>
						<Checkbox
							id={'Offline'}
							className="course-checkbox"
							color="default"
							size="small"
							value={'isOffline'}
							checked={(searchFilter?.search?.options || []).includes('isOffline')}
							onChange={courseOptionSelectHandler}
						/>
						<label htmlFor={'Offline'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">Offline</Typography>
						</label>
					</Stack>
				</Stack>

				<Stack className={'find-your-home'}>
					<Typography className={'title'}>Price Range</Typography>
					<Stack className="square-year-input">
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									coursePriceHandler(e.target.value, 'start');
								}
							}}
						/>
						<div className="central-divider"></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									coursePriceHandler(e.target.value, 'end');
								}
							}}
						/>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;

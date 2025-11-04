import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { availableOptions, courseAges } from '../../config';
import { CourseLocation, CourseType, CourseFormat, DaysOfWeek } from '../../enums/course.enum';
import { CoursesInquiry } from '../../types/course/course.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: 24,
};

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface HeaderFilterProps {
	initialInput: CoursesInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<CoursesInquiry>(initialInput);
	const locationRef: any = useRef();
	const typeRef: any = useRef();
	const formatRef: any = useRef();
	const router = useRouter();
	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openLocation, setOpenLocation] = useState(false);
	const [openType, setOpenType] = useState(false);
	const [openFormat, setOpenFormat] = useState(false);
	const [courseLocation, setCourseLocation] = useState<CourseLocation[]>(Object.values(CourseLocation));
	const [courseType, setCourseType] = useState<CourseType[]>(Object.values(CourseType));
	const [courseFormat, setCourseFormat] = useState<CourseFormat[]>(Object.values(CourseFormat));
	const [daysOfWeek] = useState<DaysOfWeek[]>(Object.values(DaysOfWeek));
	const [selectedDays, setSelectedDays] = useState<DaysOfWeek[]>([]);
	const [optionCheck, setOptionCheck] = useState('all');

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!locationRef?.current?.contains(event.target)) {
				setOpenLocation(false);
			}

			if (!typeRef?.current?.contains(event.target)) {
				setOpenType(false);
			}

			if (!formatRef?.current?.contains(event.target)) {
				setOpenFormat(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	/** HANDLERS **/
	const advancedFilterHandler = (status: boolean) => {
		setOpenLocation(false);
		setOpenFormat(false);
		setOpenType(false);
		setOpenAdvancedFilter(status);
	};

	const locationStateChangeHandler = () => {
		setOpenLocation((prev) => !prev);
		setOpenFormat(false);
		setOpenType(false);
	};

	const typeStateChangeHandler = () => {
		setOpenType((prev) => !prev);
		setOpenLocation(false);
		setOpenFormat(false);
	};

	const formatStateChangeHandler = () => {
		setOpenFormat((prev) => !prev);
		setOpenType(false);
		setOpenLocation(false);
	};

	const disableAllStateHandler = () => {
		setOpenFormat(false);
		setOpenType(false);
		setOpenLocation(false);
	};

	const courseLocationSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						locationList: [value],
					},
				});
				typeStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, courseLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const courseTypeSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						typeList: [value],
					},
				});
				formatStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, courseTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const courseFormatSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						formatList: [value],
					},
				});
				disableAllStateHandler();
			} catch (err: any) {
				console.log('ERROR, courseFormatSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const courseAgeSelectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number != 0) {
					if (searchFilter?.search?.agesList?.includes(number)) {
						setSearchFilter({
							...searchFilter,
							search: {
								...searchFilter.search,
								agesList: searchFilter?.search?.agesList?.filter((item: Number) => item !== number),
							},
						});
					} else {
						setSearchFilter({
							...searchFilter,
							search: { ...searchFilter.search, agesList: [...(searchFilter?.search?.agesList || []), number] },
						});
					}
				} else {
					delete searchFilter?.search.agesList;
					setSearchFilter({ ...searchFilter });
				}

				console.log('courseAgeSelectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, courseAgeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const courseOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const value = e.target.value;
				setOptionCheck(value);

				if (value !== 'all') {
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
							options: [value],
						},
					});
				} else {
					delete searchFilter.search.options;
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					});
				}
			} catch (err: any) {
				console.log('ERROR, courseOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const daysOfWeekHandler = useCallback(
		async (day: DaysOfWeek) => {
			try {
				let updatedDays: DaysOfWeek[];

				if (selectedDays.includes(day)) {
					updatedDays = selectedDays.filter((d) => d !== day);
				} else {
					updatedDays = [...selectedDays, day];
				}

				setSelectedDays(updatedDays);

				if (updatedDays.length > 0) {
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
							daysOfWeekList: updatedDays,
						},
					});
				} else {
					delete searchFilter.search.daysOfWeekList;
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					});
				}
			} catch (err: any) {
				console.log('ERROR, daysOfWeekHandler:', err);
			}
		},
		[searchFilter, selectedDays],
	);

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setOptionCheck('all');
		setSelectedDays([]);
	};

	const pushSearchHandler = async () => {
		try {
			if (searchFilter?.search?.locationList?.length == 0) {
				delete searchFilter.search.locationList;
			}

			if (searchFilter?.search?.typeList?.length == 0) {
				delete searchFilter.search.typeList;
			}

			if (searchFilter?.search?.formatList?.length == 0) {
				delete searchFilter.search.formatList;
			}

			if (searchFilter?.search?.options?.length == 0) {
				delete searchFilter.search.options;
			}

			if (searchFilter?.search?.agesList?.length == 0) {
				delete searchFilter.search.agesList;
			}

			if (searchFilter?.search?.daysOfWeekList?.length == 0) {
				delete searchFilter.search.daysOfWeekList;
			}

			await router.push(
				`/course?input=${JSON.stringify(searchFilter)}`,
				`/course?input=${JSON.stringify(searchFilter)}`,
			);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	const getFormatDisplayName = (format: CourseFormat) => {
		switch (format) {
			case CourseFormat.GROUP_CLASS:
				return 'Group Class';
			case CourseFormat.ONE_ON_ONE_TUTORING:
				return '1-on-1 Tutoring';
			default:
				return format;
		}
	};

	const getDayDisplayName = (day: DaysOfWeek) => {
		return day.charAt(0) + day.slice(1).toLowerCase();
	};

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						<Box component={'div'} className={`box ${openLocation ? 'on' : ''}`} onClick={locationStateChangeHandler}>
							<span>{searchFilter?.search?.locationList ? searchFilter?.search?.locationList[0] : t('Location')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openType ? 'on' : ''}`} onClick={typeStateChangeHandler}>
							<span> {searchFilter?.search?.typeList ? searchFilter?.search?.typeList[0] : t('Course type')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openFormat ? 'on' : ''}`} onClick={formatStateChangeHandler}>
							<span>
								{searchFilter?.search?.formatList
									? getFormatDisplayName(searchFilter?.search?.formatList[0])
									: t('Course Format')}
							</span>
							<ExpandMoreIcon />
						</Box>
					</Stack>
					<Stack className={'search-box-other'}>
						<Box className={'advanced-filter'} onClick={() => advancedFilterHandler(true)}>
							<img src="/img/icons/tune.svg" alt="" />
							<span>{t('Advanced')}</span>
						</Box>
						<Box className={'search-btn'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="" />
						</Box>
					</Stack>

					{/*MENU */}
					<div className={`filter-location ${openLocation ? 'on' : ''}`} ref={locationRef}>
						{courseLocation.map((location: string) => {
							return (
								<div onClick={() => courseLocationSelectHandler(location)} key={location}>
									<img src={`img/banner/cities/${location}.webp`} alt="" />
									<span>{location}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-type ${openType ? 'on' : ''}`} ref={typeRef}>
						{courseType.map((type: string) => {
							return (
								<div
									style={{ backgroundImage: `url(/img/banner/types/${type.toLowerCase()}.webp)` }}
									onClick={() => courseTypeSelectHandler(type)}
									key={type}
								>
									<span>{type}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-rooms ${openFormat ? 'on' : ''}`} ref={formatRef}>
						{courseFormat.map((format: CourseFormat) => {
							return (
								<span onClick={() => courseFormatSelectHandler(format)} key={format}>
									{getFormatDisplayName(format)}
								</span>
							);
						})}
					</div>
				</Stack>

				{/* ADVANCED FILTER MODAL */}
				<Modal
					open={openAdvancedFilter}
					onClose={() => advancedFilterHandler(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					{/* @ts-ignore */}
					<Box sx={style}>
						<Box className={'advanced-filter-modal'}>
							<div className={'close'} onClick={() => advancedFilterHandler(false)}>
								<CloseIcon />
							</div>
							<div className={'top'}>
								<span>Find your course</span>
								<div className={'search-input-box'}>
									<img src="/img/icons/search.svg" alt="" />
									<input
										value={searchFilter?.search?.text ?? ''}
										type="text"
										placeholder={'What are you looking for?'}
										onChange={(e: any) => {
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: e.target.value },
											});
										}}
									/>
								</div>
							</div>
							<Divider sx={{ mt: '30px', mb: '35px' }} />
							<div className={'middle'}>
								<div className={'row-box'}>
									<div className={'box'}>
										<span>Course Ages</span>
										<div className={'inside'}>
											<div
												className={`room ${!searchFilter?.search?.agesList ? 'active' : ''}`}
												onClick={() => courseAgeSelectHandler(0)}
											>
												Any
											</div>
											{courseAges?.map((age: number) => (
												<div
													className={`room ${searchFilter?.search?.agesList?.includes(age) ? 'active' : ''}`}
													onClick={() => courseAgeSelectHandler(age)}
													key={age}
												>
													{age}
												</div>
											))}
										</div>
									</div>
									<div className={'box'}>
										<span>Options</span>
										<div className={'inside'}>
											<FormControl>
												<Select
													value={optionCheck}
													onChange={courseOptionSelectHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
												>
													<MenuItem value={'all'}>All Options</MenuItem>
													<MenuItem value={'isOnline'}>Online</MenuItem>
													<MenuItem value={'isOffline'}>Offline</MenuItem>
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
								<div className={'row-box'} style={{ marginTop: '44px' }}>
									<div className={'box'}>
										<span>Days of Week</span>
										<div className={'inside'} style={{ flexWrap: 'wrap', gap: '8px' }}>
											{daysOfWeek.map((day: DaysOfWeek) => (
												<div
													key={day}
													className={`day-item ${selectedDays.includes(day) ? 'active' : ''}`}
													onClick={() => daysOfWeekHandler(day)}
													style={{
														padding: '8px 12px',
														border: '1px solid #ccc',
														borderRadius: '4px',
														cursor: 'pointer',
														backgroundColor: selectedDays.includes(day) ? '#1976d2' : 'transparent',
														color: selectedDays.includes(day) ? 'white' : 'black',
													}}
												>
													{getDayDisplayName(day)}
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
							<Divider sx={{ mt: '60px', mb: '18px' }} />
							<div className={'bottom'}>
								<div onClick={resetFilterHandler}>
									<img src="/img/icons/reset.svg" alt="" />
									<span>Reset all filters</span>
								</div>
								<Button
									startIcon={<img src={'/img/icons/search.svg'} />}
									className={'search-btn'}
									onClick={pushSearchHandler}
								>
									Search
								</Button>
							</div>
						</Box>
					</Box>
				</Modal>
			</>
		);
	}
};

HeaderFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {},
	},
};

export default HeaderFilter;

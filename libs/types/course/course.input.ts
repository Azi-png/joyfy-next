import { CourseFormat, CourseLocation, CourseStatus, CourseType, DaysOfWeek } from '../../enums/course.enum';
import { Direction } from '../../enums/common.enum';
import { CourseTime } from './coursetime';

export interface CourseInput {
	courseType: CourseType;
	courseLocation: CourseLocation;
	courseAddress: string;
	courseTitle: string;
	coursePrice: number;
	courseFormat: CourseFormat;
	courseAge: number;
	courseDuration: number;
	courseImages: string[];
	courseDesc?: string;
	isOnline?: boolean;
	isOffline?: boolean;
	memberId?: string;
	startDate?: Date;
	courseTimes: CourseTime[];
	courseDurationWeeks: number;
	coursesPerWeek: number;
}

interface PISearch {
	memberId?: string;
	locationList?: CourseLocation[];
	typeList?: CourseType[];
	// durationList?: Number[];
	formatList?: CourseFormat[]; // Bu qator qo'shildi
	options?: string[];
	agesList?: Number[];
	pricesRange?: Range;
	periodsRange?: PeriodsRange;
	agesRange?: Range;
	text?: string;
	daysOfWeekList?: DaysOfWeek[]; // Bu qator qo'shildi
}

export interface CoursesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	courseStatus?: CourseStatus;
}

export interface TeacherCoursesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	courseStatus?: CourseStatus;
	courseLocationList?: CourseLocation[];
}

export interface AllCoursesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}

import { CourseFormat, CourseLocation, CourseStatus, CourseType } from '../../enums/course.enum';
import { CourseTime } from './coursetime';

export interface CourseUpdate {
	_id: string;
	courseType?: CourseType;
	courseStatus?: CourseStatus;
	courseLocation?: CourseLocation;
	courseAddress?: string;
	courseTitle?: string;
	coursePrice?: number;
	courseFormat?: CourseFormat;
	courseAge?: number;
	courseDuration?: number;
	courseImages?: string[];
	courseDesc?: string;
	isOnline?: boolean;
	isOffline?: boolean;
	cancelledAt?: Date;
	deletedAt?: Date;
	startDate?: Date;
	courseTimes: CourseTime[];
	courseDurationWeeks: number;
	coursesPerWeek: number;
}

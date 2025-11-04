import { DaysOfWeek } from '../../enums/course.enum';

export interface CourseTime {
	day: DaysOfWeek;
	time: string; // "17:00" formatida
}

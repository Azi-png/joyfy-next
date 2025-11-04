import { CourseFormat, CourseLocation, CourseStatus, CourseType } from '../../enums/course.enum';
import { Member } from '../member/member';
import { CourseTime } from './coursetime';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Course {
	_id: string;
	courseType: CourseType;
	courseStatus: CourseStatus;
	courseLocation: CourseLocation;
	courseAddress: string;
	courseTitle: string;
	coursePrice: number;
	courseFormat: CourseFormat;
	courseAge: number;
	courseDuration: number;
	courseViews: number;
	courseLikes: number;
	courseComments: number;
	courseRank: number;
	courseImages: string[];
	courseDesc?: string;
	isOnline: boolean;
	isOffline: boolean;
	memberId: string;
	cancelledAt?: Date;
	deletedAt?: Date;
	startDate?: Date;
	courseTimes: CourseTime[];
	courseDurationWeeks: number;
	coursesPerWeek: number;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Courses {
	list: Course[];
	metaCounter: TotalCounter[];
}

export enum CourseType {
	ENGLISH = 'ENGLISH',
	MATH = 'MATH',
	OTHER = 'OTHER',
	// SCIENCE = 'SCIENCE',
	// JUST_FOR_FUN = 'JUST_FOR_FUN',
	// MUSIC = 'MUSIC',
	// CODING = 'CODING',
	// LANGUAGES = 'LANGUAGES',
	// WORLD_LANGUAGES = 'WORLD_LANGUAGES',
	// SPORT = 'SPORT',
}

export enum CourseStatus {
	ACTIVE = 'ACTIVE',
	CANCELLED = 'CANCELLED',
	DELETE = 'DELETE',
}

export enum CourseLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	GYEONGJU = 'GYEONGJU',
	GWANGJU = 'GWANGJU',
	CHONJU = 'CHONJU',
	DAEJON = 'DAEJON',
	JEJU = 'JEJU',
}

export enum CourseFormat {
	GROUP_CLASS = 'GROUP_CLASS',
	ONE_ON_ONE_TUTORING = 'ONE_ON_ONE_TUTORING',
}

export enum DaysOfWeek {
	MONDAY = 'MONDAY',
	TUESDAY = 'TUESDAY',
	WEDNESDAY = 'WEDNESDAY',
	THURSDAY = 'THURSDAY',
	FRIDAY = 'FRIDAY',
	SATURDAY = 'SATURDAY',
	SUNDAY = 'SUNDAY',
}

export interface CourseTime {
	day: DaysOfWeek;
	time: string;
}

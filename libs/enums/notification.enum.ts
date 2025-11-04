export enum NotificationType {
	LIKE = 'LIKE',
	COMMENT = 'COMMENT',
	NOTICE = 'NOTICE',
}

export enum NotificationStatus {
	WAIT = 'WAIT',
	READ = 'READ',
}

export enum NotificationGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	COURSE = 'COURSE',
	COMMENT = 'COMMENT',
	NOTICE = 'NOTICE', // ✅ add (admin site notice)
}

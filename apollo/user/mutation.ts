import { gql } from '@apollo/client';
import {
	CreateNotificationInput,
	Notifications,
	NotificationsInquiry,
} from '../../libs/types/notification/notification';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberCourses
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberCourses
			memberRank
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberCourses
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberCourses
			memberRank
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

/**************************
 *        COURSE       *
 *************************/

export const CREATE_COURSE = gql`
	mutation CreateCourse($input: CourseInput!) {
		createCourse(input: $input) {
			_id
			courseType
			courseStatus
			courseLocation
			courseAddress
			courseTitle
			coursePrice
			courseFormat
			courseAge
			courseDuration
			courseViews
			courseLikes
			courseImages
			courseDesc
			isOnline
			isOffline
			memberId
			cancelledAt
			deletedAt
			startDate
			courseTimes {
				day
				time
			}
			courseDurationWeeks
			coursesPerWeek
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_COURSE = gql`
	mutation UpdateCourse($input: CourseUpdate!) {
		updateCourse(input: $input) {
			_id
			courseType
			courseStatus
			courseLocation
			courseAddress
			courseTitle
			coursePrice
			courseFormat
			courseAge
			courseDuration
			courseViews
			courseLikes
			courseImages
			courseDesc
			isOnline
			isOffline
			memberId
			cancelledAt
			deletedAt
			startDate
			courseTimes {
				day
				time
			}
			courseDurationWeeks
			coursesPerWeek
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_COURSE = gql`
	mutation LikeTargetCourse($input: String!) {
		likeTargetCourse(courseId: $input) {
			_id
			courseType
			courseStatus
			courseLocation
			courseAddress
			courseTitle
			coursePrice
			courseFormat
			courseAge
			courseDuration
			courseViews
			courseLikes
			courseImages
			courseDesc
			isOnline
			isOffline
			memberId
			cancelledAt
			deletedAt
			startDate
			courseTimes {
				day
				time
			}
			courseDurationWeeks
			coursesPerWeek
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const CREATE_BOARD_ARTICLE = gql`
	mutation CreateBoardArticle($input: BoardArticleInput!) {
		createBoardArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_BOARD_ARTICLE = gql`
	mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_BOARD_ARTICLE = gql`
	mutation LikeTargetBoardArticle($input: String!) {
		likeTargetBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

// ---------- Fragments ----------
export const NOTIFICATION_FIELDS = gql`
	fragment NotificationFields on Notification {
		_id
		notificationType
		notificationGroup
		notificationStatus
		notificationTitle
		notificationDesc
		authorId
		courseId
		articleId
		commentId
		refId
		createdAt
		updatedAt
	}
`;

// ---------- Queries ----------
export const GET_NOTIFICATIONS = gql`
	${NOTIFICATION_FIELDS}
	query GetNotifications($input: NotificationsInquiry!) {
		getNotifications(input: $input) {
			total
			list {
				...NotificationFields
			}
		}
	}
`;

// ---------- Mutations ----------
export const CREATE_NOTIFICATION = gql`
	mutation CreateNotification($input: CreateNotificationInput!) {
		createNotification(input: $input) {
			_id
		}
	}
`;

export const MARK_NOTIFICATION_READ = gql`
	${NOTIFICATION_FIELDS}
	mutation MarkNotificationRead($notificationId: String!) {
		markNotificationRead(notificationId: $notificationId) {
			...NotificationFields
		}
	}
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
	mutation MarkAllNotificationsRead {
		markAllNotificationsRead
	}
`;

export const DELETE_NOTIFICATION = gql`
	mutation DeleteNotificationById($id: String!) {
		deleteNotificationById(id: $id) {
			success
			message
		}
	}
`;

export type DeleteNotificationVars = { id: string };
export type DeleteNotificationData = { deleteNotificationById: { success: boolean; message: string } };

// ---------- TS helper types ----------
export type GetNotificationsData = { getNotifications: Notifications };
export type GetNotificationsVars = { input: NotificationsInquiry };

export type CreateNotificationData = { createNotification: { _id: string } };
export type CreateNotificationVars = { input: CreateNotificationInput };

export type MarkNotificationReadData = { markNotificationRead: Notification };
export type MarkNotificationReadVars = { notificationId: string };

export type MarkAllNotificationsReadData = { markAllNotificationsRead: boolean };
export type MarkAllNotificationsReadVars = Record<string, never>;

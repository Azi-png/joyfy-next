import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
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

/**************************
 *        COURSE        *
 *************************/

export const UPDATE_COURSE_BY_ADMIN = gql`
	mutation UpdateCourseByAdmin($input: CourseUpdate!) {
		updateCourseByAdmin(input: $input) {
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

export const REMOVE_COURSE_BY_ADMIN = gql`
	mutation RemoveCourseByAdmin($input: String!) {
		removeCourseByAdmin(courseId: $input) {
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

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
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

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
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

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
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
 *         FAQ        *
 *************************/

export const CREATE_FAQ = gql`
	mutation CreateFaq($input: FaqInput!) {
		createFaq(input: $input) {
			_id
			question
			answer
			status
			category
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_FAQ = gql`
	mutation UpdateFaq($input: UpdateFaqInput!) {
		updateFaq(input: $input) {
			_id
			question
			answer
			status
			category
			createdAt
			updatedAt
		}
	}
`;

export const DELETE_FAQ = gql`
	mutation DeleteFaq($id: String!) {
		deleteFaq(id: $id)
	}
`;
/**************************
 *        NOTICE        *
 *************************/

export const CREATE_NOTICE = gql`
	mutation CreateNotice($input: NoticeInput!) {
		createNotice(input: $input) {
			_id
			noticeTitle
			noticeContent
			noticeStatus
			memberId
		}
	}
`;

export const UPDATE_NOTICE = gql`
	mutation UpdateNotice($input: UpdateNoticeInput!) {
		updateNotice(input: $input) {
			_id
			noticeTitle
			noticeContent
			noticeStatus
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const DELETE_NOTICE = gql`
	mutation DeleteNotice($input: String!) {
		deleteNotice(input: $input) {
			_id
			noticeStatus
			noticeTitle
			noticeContent
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_NOTICE_PERMANENTLY = gql`
	mutation RemoveNoticePermanently($input: String!) {
		removeNoticePermanently(input: $input) {
			_id
			noticeStatus
			noticeTitle
			noticeContent
			memberId
			createdAt
			updatedAt
		}
	}
`;

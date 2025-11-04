// // types/notice.update.types.ts

// import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

// export interface NoticeUpdate {
// 	_id: string;
// 	noticeCategory?: NoticeCategory;
// 	noticeStatus?: NoticeStatus;
// 	noticeTitle?: string;
// 	noticeContent?: string;
// }
import { NoticeStatus } from '../../enums/notice.enum';

export interface UpdateNoticeInput {
	_id: string;
	noticeStatus?: NoticeStatus;
	noticeTitle?: string;
	noticeContent?: string;
}

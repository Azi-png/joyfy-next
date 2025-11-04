import React, { UIEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
	Badge,
	Box,
	Button,
	CircularProgress,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Menu,
	Stack,
	Tooltip,
	Typography,
	Chip,
} from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import moment from 'moment';
import { useApolloClient, useMutation, useQuery, useReactiveVar } from '@apollo/client';

import { useNotificationWS } from '../../hooks/useNotificationWS';
import { REACT_APP_API_URL } from '../../config';
import { userVar } from '../../../apollo/store';

import {
	MARK_ALL_NOTIFICATIONS_READ,
	MARK_NOTIFICATION_READ,
	GET_NOTIFICATIONS,
	type GetNotificationsData,
	type GetNotificationsVars,
	type MarkNotificationReadData,
	type MarkNotificationReadVars,
	type MarkAllNotificationsReadData,
} from '../../../apollo/user/mutation';

import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';

const PAGE_LIMIT = 5;
const SOFT_DELETE_ONLY = true;

const buildImgSrc = (img?: string | null) => {
	if (!img) return '/img/profile/defaultUser3.svg';
	if (/^https?:\/\//i.test(img)) return img;
	return `${REACT_APP_API_URL}/${String(img)}`.replace(/([^:]\/)\/+/g, '$1');
};

// Action icon va style konfiguratsiyasi - faqat LIKE va COMMENT uchun
const getActionConfig = (type: NotificationType | string, group?: string) => {
	const configs: Partial<
		Record<
			NotificationType,
			{
				icon: React.ReactElement;
				bgColor: string;
				borderColor: string;
				iconBg: string;
			}
		>
	> = {
		[NotificationType.LIKE]: {
			icon: <FavoriteRoundedIcon sx={{ fontSize: 14, color: '#e91e63' }} />,
			bgColor: 'rgba(233, 30, 99, 0.08)',
			borderColor: 'rgba(233, 30, 99, 0.3)',
			iconBg: '#fce4ec',
		},
		[NotificationType.COMMENT]: {
			icon: <CommentRoundedIcon sx={{ fontSize: 14, color: '#2196f3' }} />,
			bgColor: 'rgba(33, 150, 243, 0.08)',
			borderColor: 'rgba(33, 150, 243, 0.3)',
			iconBg: '#e3f2fd',
		},
	};

	// Faqat LIKE va COMMENT turlarini qo'llab-quvvatlaydi
	if (configs[type as NotificationType]) {
		return configs[type as NotificationType]!;
	}

	// Boshqa turlar uchun default (lekin bu holatda kerak emas)
	return {
		icon: <NotificationsOutlinedIcon sx={{ fontSize: 14, color: '#757575' }} />,
		bgColor: 'rgba(117, 117, 117, 0.05)',
		borderColor: 'rgba(117, 117, 117, 0.2)',
		iconBg: '#f5f5f5',
	};
};

const actionText = (n: any) => {
	switch (n.notificationType as NotificationType) {
		case NotificationType.LIKE:
			if (n.notificationGroup === NotificationGroup.COURSE) return 'liked your course';
			if (n.notificationGroup === NotificationGroup.ARTICLE) return 'liked your article';
			if (n.notificationGroup === NotificationGroup.COMMENT) return 'liked your comment';
			return 'liked your post';
		case NotificationType.COMMENT:
			if (n.notificationGroup === NotificationGroup.COURSE) return 'commented on your course';
			if (n.notificationGroup === NotificationGroup.ARTICLE) return 'commented on your article';
			return 'commented on your post';
		default:
			return 'interacted with your content';
	}
};

const secondaryText = (n: any) => {
	const desc = (n.notificationDesc || '').trim();
	return desc ? desc : null;
};

// Vaqt formatini yaxshilash
const formatTime = (createdAt: string) => {
	const now = new Date();
	const time = new Date(createdAt);
	const diff = now.getTime() - time.getTime();

	if (diff < 60000) return 'now';
	if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
	if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
	if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
	return moment(createdAt).format('MMM D');
};

const hiddenStoreKey = (uid?: string) => (uid ? `veloura:hidden_notifs:${uid}` : 'veloura:hidden_notifs');

const mergeUniqueSorted = (prevList: any[], nextList: any[]) => {
	const map = new Map<string, any>();
	prevList.forEach((n) => map.set(n._id, n));
	nextList.forEach((n) => {
		const prev = map.get(n._id) || {};
		map.set(n._id, { ...prev, ...n });
	});
	return Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const NotificationBell: React.FC = () => {
	const user = useReactiveVar(userVar);
	const client = useApolloClient();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const [currentPage, setCurrentPage] = useState(1);
	const [items, setItems] = useState<any[]>([]);
	const [total, setTotal] = useState(0);
	const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const listBoxRef = useRef<HTMLDivElement | null>(null);

	/** APOLLO REQUESTS **/
	const { loading, fetchMore, refetch } = useQuery<GetNotificationsData, GetNotificationsVars>(GET_NOTIFICATIONS, {
		variables: { input: { page: 1, limit: PAGE_LIMIT } },
		skip: !user?._id,
		fetchPolicy: 'cache-and-network',
		notifyOnNetworkStatusChange: true,
		onCompleted: (d) => {
			if (!d?.getNotifications) return;
			setCurrentPage(1);
			setItems(d.getNotifications.list || []);
			setTotal(d.getNotifications.total ?? 0);
			setHasMore((d.getNotifications.list?.length || 0) < (d.getNotifications.total ?? 0));
		},
	});

	const [markOne, { loading: markingOne }] = useMutation<MarkNotificationReadData, MarkNotificationReadVars>(
		MARK_NOTIFICATION_READ,
	);

	const [markAll, { loading: markingAll }] = useMutation<MarkAllNotificationsReadData>(MARK_ALL_NOTIFICATIONS_READ);

	/**LIFECYCLES **/
	useEffect(() => {
		if (!user?._id) return;
		try {
			const raw = localStorage.getItem(hiddenStoreKey(user._id));
			if (raw) {
				const arr: string[] = JSON.parse(raw);
				setHiddenIds(new Set(arr));
			} else {
				setHiddenIds(new Set());
			}
		} catch {
			// ignore
		}
	}, [user?._id]);

	useEffect(() => {
		if (!user?._id) return;
		try {
			localStorage.setItem(hiddenStoreKey(user._id), JSON.stringify(Array.from(hiddenIds)));
		} catch {
			// ignore
		}
	}, [hiddenIds, user?._id]);

	const handleSoftRemove = (id: string) => {
		setHiddenIds((prev) => {
			const next = new Set(prev);
			next.add(id);
			return next;
		});
	};

	// WebSocket connection for real-time updates
	useNotificationWS({
		userId: user?._id,
		client,
		onPing: async () => {
			const res = await refetch({ input: { page: 1, limit: PAGE_LIMIT } });
			setCurrentPage(1);
			const newItems = res.data?.getNotifications?.list || [];
			const newTotal = res.data?.getNotifications?.total ?? 0;
			setItems(newItems);
			setTotal(newTotal);
			setHasMore(newItems.length < newTotal);
		},
	});

	const visibleItems = useMemo(() => items.filter((n) => !hiddenIds.has(n._id)), [items, hiddenIds]);
	const unreadCount = useMemo(
		() => items.filter((n) => n.notificationStatus === NotificationStatus.WAIT && !hiddenIds.has(n._id)).length,
		[items, hiddenIds],
	);

	/** HANDLERS **/
	const loadMore = async () => {
		if (!hasMore || loading || loadingMore) return;

		setLoadingMore(true);
		const nextPage = currentPage + 1;

		try {
			const result = await fetchMore({
				variables: {
					input: {
						page: nextPage,
						limit: PAGE_LIMIT,
					},
				},
			});

			const newItems = result.data?.getNotifications?.list || [];
			const newTotal = result.data?.getNotifications?.total ?? total;

			if (newItems.length > 0) {
				// Yangi ma'lumotlarni mavjud ro'yxatga qo'shamiz
				setItems((prevItems) => {
					const mergedItems = mergeUniqueSorted(prevItems, newItems);
					return mergedItems;
				});
				setCurrentPage(nextPage);
				setTotal(newTotal);

				// Keyingi sahifa mavjudligini tekshiramiz
				const totalLoaded = items.length + newItems.length;
				setHasMore(totalLoaded < newTotal);
			} else {
				// Agar yangi ma'lumotlar bo'lmasa, hasMore ni false qilamiz
				setHasMore(false);
			}
		} catch (error) {
			console.error('Error loading more notifications:', error);
		} finally {
			setLoadingMore(false);
		}
	};

	const onScroll = (e: UIEvent<HTMLDivElement>) => {
		if (!hasMore || loading || loadingMore) return;

		const el = e.currentTarget;
		// Scroll 80px gacha yetganida yuklash boshlaydi
		const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;

		if (nearBottom) {
			loadMore();
		}
	};

	// Auto-load logic - agar konteyner to'lmagan bo'lsa
	useEffect(() => {
		const box = listBoxRef.current;
		if (!box || loading || loadingMore || !hasMore) return;

		// Agar scroll bar ko'rinmasa va yana ma'lumot olish mumkin bo'lsa
		const needMore = box.scrollHeight <= box.clientHeight + 100;
		if (needMore && visibleItems.length > 0 && visibleItems.length < 3) {
			// Faqat kam element bo'lganda avtomatik yuklash
			setTimeout(() => loadMore(), 500); // Biroz kechikish bilan
		}
	}, [visibleItems.length, hasMore, loading, loadingMore]);

	const handleMarkOne = async (id: string) => {
		// Optimistic update
		setItems((prev) => prev.map((n) => (n._id === id ? { ...n, notificationStatus: NotificationStatus.READ } : n)));

		try {
			await markOne({ variables: { notificationId: id } });
		} catch (error) {
			// Xatolik bo'lsa, asl holatga qaytaramiz
			setItems((prev) => prev.map((n) => (n._id === id ? { ...n, notificationStatus: NotificationStatus.WAIT } : n)));
			console.error('Error marking notification as read:', error);
		}
	};

	const handleMarkAll = async () => {
		try {
			await markAll({
				optimisticResponse: { markAllNotificationsRead: true },
			});

			// Barcha bildirishnomalarni o'qilgan deb belgilaymiz
			setItems((prev) => prev.map((n) => ({ ...n, notificationStatus: NotificationStatus.READ })));

			// Ma'lumotlarni yangilaymiz
			const res = await refetch({ input: { page: 1, limit: PAGE_LIMIT } });
			setCurrentPage(1);
			const refreshedItems = res.data?.getNotifications?.list || [];
			const refreshedTotal = res.data?.getNotifications?.total ?? 0;
			setItems(refreshedItems);
			setTotal(refreshedTotal);
			setHasMore(refreshedItems.length < refreshedTotal);
		} catch (error) {
			console.error('Error marking all notifications as read:', error);
		}
	};

	return (
		<>
			<Badge color="error" badgeContent={unreadCount} max={9} overlap="circular">
				<IconButton
					onClick={(e: any) => setAnchorEl(e.currentTarget)}
					sx={{
						borderRadius: '16px',
						bgcolor: 'transparent',
						border: unreadCount ? '2px solid rgba(33,150,243,0.3)' : 'none',
						'&:hover': {
							bgcolor: 'rgba(33,150,243,0.08)',
							transform: 'scale(1.05)',
						},
						transition: 'all 0.2s ease',
					}}
				>
					<NotificationsOutlinedIcon className="notification-icon" />
				</IconButton>
			</Badge>

			<Menu
				open={open}
				onClose={() => setAnchorEl(null)}
				anchorEl={anchorEl}
				PaperProps={{
					elevation: 0,
					sx: {
						width: 550,
						maxWidth: '92vw',
						maxHeight: 540,
						overflow: 'hidden',
						borderRadius: 4,
						border: '1px solid rgba(212,180,131,0.25)',
						boxShadow: '0 20px 40px rgba(24,26,32,0.15)',
						background: 'linear-gradient(135deg, #fffdf8 0%, #faf8f1 100%)',
						color: '#2e2424',
					},
				}}
			>
				<Stack direction="row" alignItems="center" justifyContent="space-between" px={3} py={2}>
					<Typography sx={{ fontWeight: 800, letterSpacing: 0.3, fontSize: 18 }}>Notifications</Typography>
					<Button
						size="small"
						startIcon={<DoneAllIcon />}
						onClick={handleMarkAll}
						disabled={!unreadCount || markingAll}
						sx={{
							textTransform: 'none',
							fontWeight: 600,
							borderRadius: 20,
							px: 2,
							py: 0.5,
							color: '#2b241c',
							bgcolor: unreadCount ? '#5ba3e0' : 'rgba(173, 216, 230, 0.4)',
							'&:hover': { bgcolor: '#FF91A4' },
							transition: 'all 0.2s ease',
						}}
					>
						Mark all read
					</Button>
				</Stack>

				<Divider sx={{ borderColor: 'rgba(212,180,131,0.2)' }} />

				{/* Scroll container */}
				<Box ref={listBoxRef} onScroll={onScroll} sx={{ overflowY: 'auto', maxHeight: 420, py: 1 }}>
					{loading && items.length === 0 ? (
						<Stack alignItems="center" py={4}>
							<CircularProgress size={24} sx={{ color: '#d4b483' }} />
							<Typography sx={{ mt: 1, color: '#8a8071', fontSize: 12 }}>Loading notifications...</Typography>
						</Stack>
					) : (
						<>
							<List dense disablePadding>
								{visibleItems.map((n) => {
									const getNameFromDesc = (desc: string) => {
										if (!desc) return 'Someone';
										const firstWord = desc.split(' ')[0];
										return firstWord || 'Someone';
									};

									const actor = {
										_id: n.authorId,
										memberNick: n.memberData?.[0]?.memberNick || getNameFromDesc(n.notificationDesc),
										memberImage: n.memberData?.[0]?.memberImage,
									};

									const isUnread = n.notificationStatus === NotificationStatus.WAIT;
									const action = actionText(n);
									const secondary = secondaryText(n);
									const config = getActionConfig(n.notificationType, n.notificationGroup);

									return (
										<Box
											key={n._id}
											sx={{
												mx: 2,
												mb: 1,
												borderRadius: 3,
												border: isUnread ? `1px solid ${config.borderColor}` : '1px solid rgba(24,26,32,0.06)',
												background: isUnread ? config.bgColor : '#ffffff',
												transition: 'all 0.2s ease',
												'&:hover': {
													transform: 'translateY(-2px)',
													background: isUnread ? config.bgColor : '#fffdfa',
													border: `1px solid ${config.borderColor}`,
													boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
													'& .notification-avatar': {
														transform: 'scale(1.05)',
													},
												},
												...(isUnread ? {} : { opacity: 0.75 }),
											}}
										>
											<ListItem
												alignItems="flex-start"
												disableGutters
												sx={{ px: 2, py: 1.5, cursor: 'pointer' }}
												onClick={async (e: any) => {
													e.stopPropagation();
													if (isUnread && !markingOne) {
														await handleMarkOne(n._id);
													}
												}}
												secondaryAction={
													<Stack direction="row" alignItems="center" spacing={0.5}>
														{isUnread ? (
															<Tooltip title="Unread">
																<FiberManualRecordRoundedIcon
																	sx={{
																		fontSize: 10,
																		color: config.borderColor?.replace('0.3', '1') || '#d4b483',
																		mr: 0.5,
																	}}
																/>
															</Tooltip>
														) : (
															<Tooltip title="Read">
																<CheckCircleOutlineRoundedIcon sx={{ fontSize: 16, color: '#8a8071', mr: 0.5 }} />
															</Tooltip>
														)}
														<Tooltip title="Remove notification">
															<IconButton
																edge="end"
																size="small"
																onClick={(e: any) => {
																	e.stopPropagation();
																	handleSoftRemove(n._id);
																}}
																sx={{
																	color: '#999',
																	'&:hover': {
																		color: '#666',
																		bgcolor: 'rgba(0,0,0,0.05)',
																	},
																}}
															>
																<DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
															</IconButton>
														</Tooltip>
													</Stack>
												}
											>
												<ListItemAvatar sx={{ minWidth: 50, mr: 2 }}>
													<Box
														sx={{
															width: 40,
															height: 40,
															borderRadius: '50%',
															bgcolor: config.iconBg,
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															border: '2px solid white',
															boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
														}}
													>
														{config.icon}
													</Box>
												</ListItemAvatar>

												<ListItemText
													primary={
														<Stack direction="row" alignItems="baseline" gap={1} flexWrap="wrap">
															<Typography sx={{ fontWeight: 700, color: '#2e2424', fontSize: 14 }}>
																{n.notificationTitle}
															</Typography>
															<Typography
																sx={{
																	ml: 'auto',
																	fontSize: 11,
																	color: '#999',
																	fontWeight: 500,
																	minWidth: 'fit-content',
																}}
															>
																{formatTime(n.createdAt)}
															</Typography>
														</Stack>
													}
													secondary={
														secondary && (
															<Box sx={{ mt: 1 }}>
																<Chip
																	label={`"${secondary}"`}
																	size="small"
																	sx={{
																		fontSize: 11,
																		height: 'auto',
																		bgcolor: 'rgba(255,255,255,0.8)',
																		color: '#666',
																		border: '1px solid rgba(0,0,0,0.08)',
																		'& .MuiChip-label': {
																			px: 1,
																			py: 0.5,
																			whiteSpace: 'normal',
																			wordBreak: 'break-word',
																		},
																		maxWidth: '100%',
																	}}
																/>
															</Box>
														)
													}
													primaryTypographyProps={{ component: 'div' }}
												/>
											</ListItem>
										</Box>
									);
								})}
							</List>

							{/* Loading indicator at bottom */}
							<Stack alignItems="center" py={1}>
								{loadingMore && hasMore && (
									<>
										<CircularProgress size={20} sx={{ color: '#5ba3e0', mb: 1 }} />
										<Typography sx={{ color: '#8a8071', fontSize: 11 }}>Loading more...</Typography>
									</>
								)}
								{!hasMore && items.length > 0 && (
									<Typography sx={{ color: '#8a8071', fontSize: 12, py: 1 }}>No more notifications!</Typography>
								)}
								{!loading && items.length === 0 && (
									<Typography sx={{ color: '#8a8071', fontSize: 12, py: 2 }}>No notifications yet</Typography>
								)}
							</Stack>
						</>
					)}
				</Box>
			</Menu>
		</>
	);
};

export default NotificationBell;

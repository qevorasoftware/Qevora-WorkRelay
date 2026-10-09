import type { Conversation } from '../types'

export const conversations: Conversation[] = [
  {
    id: 'cv1', type: 'group', name: 'Qevora Studio — Team', visibility: 'internal',
    participantIds: ['u1', 'u2', 'u3', 'u4'], unread: 2,
    messages: [
      { id: 'ms1', senderId: 'u2', body: 'Morning team! Shakti homepage v2 went to Rita for approval yesterday.', createdAt: '2026-10-09T08:05:00', reactions: [{ emoji: '👍', userIds: ['u1', 'u3'] }] },
      { id: 'ms2', senderId: 'u3', body: 'Yes — hero visual is now textile-focused. Fingers crossed 🤞', createdAt: '2026-10-09T08:12:00', reactions: [] },
      { id: 'ms3', senderId: 'u2', body: 'FitZone is still blocked on brand assets. Vendor confirms Oct 15.', createdAt: '2026-10-09T09:01:00', reactions: [] },
      { id: 'ms4', senderId: 'u1', body: 'Let\'s keep the client-facing note simple: "brand kit arriving this week". Procurement detail stays internal.', createdAt: '2026-10-09T09:15:00', replyToId: 'ms3', reactions: [{ emoji: '👌', userIds: ['u2'] }] },
      { id: 'ms5', senderId: 'u4', body: 'Staging deploy for Café Meraki menu page is done — ready for Dev\'s design QA.', createdAt: '2026-10-09T10:22:00', reactions: [{ emoji: '🚀', userIds: ['u1'] }] },
      { id: 'ms6', senderId: 'u3', body: 'On it after lunch.', createdAt: '2026-10-09T10:31:00', reactions: [] },
    ],
  },
  {
    id: 'cv2', type: 'project', projectId: 'p1', visibility: 'client',
    name: 'Shakti Textiles — Project chat', participantIds: ['u1', 'u2', 'u5'], unread: 0,
    messages: [
      { id: 'ms1', senderId: 'u5', body: 'Hi! Where are we on the homepage redesign timeline?', createdAt: '2026-10-08T10:02:00', reactions: [] },
      { id: 'ms2', senderId: 'u2', body: 'Hi Rita! Homepage v2 is with you for approval, and content collection closes Oct 14. We\'re on track for Nov 6 launch.', createdAt: '2026-10-08T10:20:00', reactions: [{ emoji: '❤️', userIds: ['u5'] }] },
      { id: 'ms3', senderId: 'u5', body: 'The new hero looks much better. I\'ll send the logo source files by Friday.', createdAt: '2026-10-09T09:40:00', reactions: [{ emoji: '🎉', userIds: ['u2', 'u1'] }] },
    ],
  },
  {
    id: 'cv3', type: 'dm', visibility: 'internal', name: undefined,
    participantIds: ['u1', 'u2'], unread: 0,
    messages: [
      { id: 'ms1', senderId: 'u2', body: 'Pilot interview #6 done — the owner in Surat said follow-ups dropped ~40% with a shared request board.', createdAt: '2026-10-08T16:44:00', reactions: [{ emoji: '🔥', userIds: ['u1'] }] },
      { id: 'ms2', senderId: 'u1', body: 'Great signal. Log it in the validation sheet — that\'s two strong willingness-to-pay hints this week.', createdAt: '2026-10-08T16:52:00', reactions: [] },
    ],
  },
  {
    id: 'cv4', type: 'project', projectId: 'p2', visibility: 'client',
    name: 'Café Meraki — Project chat', participantIds: ['u2', 'u6'], unread: 1,
    messages: [
      { id: 'ms1', senderId: 'u6', body: 'Menu PDF is final now. Sending dish photos tonight.', createdAt: '2026-10-09T07:55:00', reactions: [] },
      { id: 'ms2', senderId: 'u2', body: 'Perfect — once we have those, the menu page approval is the last big step before launch prep.', createdAt: '2026-10-09T08:30:00', reactions: [{ emoji: '👍', userIds: ['u6'] }] },
    ],
  },
  {
    id: 'cv5', type: 'dm', visibility: 'internal', name: undefined,
    participantIds: ['u1', 'u4'], unread: 0,
    messages: [
      { id: 'ms1', senderId: 'u4', body: 'SEO keyword confirmation is complete for Shakti catalogue pages.', createdAt: '2026-10-06T15:10:00', reactions: [] },
      { id: 'ms2', senderId: 'u1', body: 'Nice. Keep the clusters documented for the launch checklist.', createdAt: '2026-10-06T15:25:00', reactions: [] },
    ],
  },
]

export const conversationById = (id: string) => conversations.find((c) => c.id === id)

import Bounty, { parseBountyList, RelatedItem } from "~/config/types/bounty";
import { parsePurchase, Purchase } from "~/config/types/purchase";
import {
  RHUser,
  parseUser,
  ID,
  Review,
  parseReview,
} from "~/config/types/root_types";
import { parseVote, Vote } from "~/config/types/vote";
import { formatDateStandard, timeSince } from "~/config/utils/dates";
import { isEmpty } from "~/config/utils/nullchecks";

export enum COMMENT_TYPES {
  DISCUSSION = "DISCUSSION",
  SUMMARY = "SUMMARY",
  REVIEW = "REVIEW",
  ANSWER = "ANSWER",
  INLINE_DISCUSSION = "INLINE_DISCUSSION",
}

type SerializedPosition = {
  startContainerPath: string;
  startOffset: number;
  endContainerPath: string;
  endOffset: number;
  collapsed: boolean;
  textContent: string;
  page?: number;
};

export type PositionAnchor = {
  type: "text";
  position: SerializedPosition;
};

export type Comment = {
  id: ID;
  threadId: ID;
  createdDate: string;
  updatedDate: string;
  awardedBountyAmount: number;
  bounties: Bounty[];
  timeAgo: string;
  createdBy: RHUser;
  content: object;
  score: number;
  userVote: Vote | null;
  isEdited: boolean;
  commentType: COMMENT_TYPES;
  parent?: Comment;
  children: Comment[];
  childrenCount: number;
  tips: Purchase[];
  isAcceptedAnswer: boolean;
  review?: Review;
  anchor?: PositionAnchor;
};

export type UnrenderedAnnotation = {
  comment?: Comment;
  xrange: any | null;
  isNew?: boolean;
};

export type RenderedAnnotation = {
  comment?: Comment;
  isNew?: boolean;
  xrange: any;
  anchorCoordinates: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  commentCoordinates: { x: number; y: number };
};

type parseCommentArgs = {
  raw: any;
  parent?: Comment;
};

export const parseAnchor = (raw: any): PositionAnchor => {
  return {
    type: "text",
    position: {
      startContainerPath: raw.startContainerPath,
      startOffset: raw.startOffset,
      endContainerPath: raw.endContainerPath,
      endOffset: raw.endOffset,
      collapsed: raw.collapsed,
      textContent: raw.textContent,
      page: raw.page || null,
    },
  };
};

export const parseComment = ({ raw, parent }: parseCommentArgs): Comment => {
  const parsed: Comment = {
    id: raw.id,
    threadId: raw.thread,
    createdDate: formatDateStandard(raw.created_date),
    updatedDate: formatDateStandard(raw.updated_date),
    timeAgo: timeSince(raw.created_date),
    createdBy: parseUser(raw.created_by),
    isEdited: raw.is_edited,
    content: raw.comment_content_json || {},
    score: raw.score,
    userVote: raw.user_vote ? parseVote(raw.user_vote) : null,
    awardedBountyAmount: raw.awarded_bounty_amount || 0,
    commentType: raw.thread?.thread_type || COMMENT_TYPES.DISCUSSION,
    bounties: [] as Bounty[],
    children: [] as Comment[],
    childrenCount: raw.children_count || 0,
    ...(parent && { parent }),
    tips: (raw.purchases || []).map((p: any) => parsePurchase(p)),
    isAcceptedAnswer: Boolean(raw.is_accepted_answer),
    ...(raw.review && { review: parseReview(raw.review) }),
  };

  if (raw.anchor) {
    parsed.anchor = parseAnchor(raw.anchor);
  }

  const relatedItem: RelatedItem = {
    type: "comment",
    object: parsed,
  };

  parsed.children = (raw.children ?? [])
    .filter((child: any) => !isEmpty(child))
    .map((child: any) => parseComment({ raw: child, parent: parsed }));
  parsed.bounties = parseBountyList(raw.bounties || [], relatedItem);

  return parsed;
};

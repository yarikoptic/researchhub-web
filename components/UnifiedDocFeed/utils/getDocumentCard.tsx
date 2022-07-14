import FeedCard from "~/components/Author/Tabs/FeedCard";
import { ReactElement } from "react";
import { filterNull } from "~/config/utils/nullchecks";
import { getUnifiedDocType } from "~/config/utils/getUnifiedDocType";

export type UnifiedCard = ReactElement<typeof FeedCard> | null;

export function getDocumentCard({
  hasSubscribed,
  isLoggedIn,
  isOnMyHubsTab,
  setUnifiedDocuments,
  unifiedDocumentData,
  onBadgeClick,
}): UnifiedCard[] {
  return filterNull(unifiedDocumentData).map(
    (uniDoc: any, arrIndex: number): UnifiedCard => {
      const beDocType = getUnifiedDocType(uniDoc?.document_type ?? null);
      const docTypeLabel = (uniDoc?.document_type ?? "").toLowerCase() ?? null;
      const targetDoc =
        beDocType !== "post" ? uniDoc.documents : uniDoc.documents[0];
      const docID = targetDoc.id;
      const shouldBlurMobile =
        arrIndex > 1 && (!hasSubscribed || !isLoggedIn) && isOnMyHubsTab;
      const shouldBlurDesktop =
        arrIndex > 1 && (!hasSubscribed || !isLoggedIn) && isOnMyHubsTab;

      return (
        <FeedCard
          {...targetDoc}
          formattedDocType={docTypeLabel}
          index={arrIndex}
          key={`${beDocType}-${docID}-${arrIndex}`}
          onBadgeClick={onBadgeClick}
          paper={uniDoc.documents}
          vote={uniDoc.user_vote}
          featured={uniDoc.featured}
          reviews={uniDoc.reviews}
          voteCallback={(arrIndex: number, currPaper: any): void => {
            const [currUniDoc, newUniDocs] = [
              { ...uniDoc },
              [...unifiedDocumentData],
            ];
            currUniDoc.documents.user_vote = currPaper.user_vote;
            currUniDoc.documents.score = currPaper.score;
            newUniDocs[arrIndex] = currUniDoc;
            setUnifiedDocuments(newUniDocs);
          }}
        />
      );
    }
  );
}

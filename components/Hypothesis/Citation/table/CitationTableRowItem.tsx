import { css, StyleSheet } from "aphrodite";
import React, { ReactElement, ReactNode } from "react";
import colors from "../../../../config/themes/colors";
import { ID } from "../../../../config/types/root_types";
import AuthorFacePile from "../../../shared/AuthorFacePile";
import CitationConsensusItem, { ConsensusMeta } from "./CitationConsensusItem";
import { tableWidths } from "./constants/tableWidths";

export type CitationTableRowItemProps = {
  citationID: ID;
  citedBy: Object[];
  consensusMeta: ConsensusMeta;
  source: string;
  type: string;
  year: string;
};

type ItemColumnProps = {
  bold?: boolean;
  value: ReactNode;
  width: string;
};

function ItemColumn({ bold, value, width }: ItemColumnProps) {
  return (
    <div
      className={css(styles.itemColumn, Boolean(bold) && styles.bold)}
      style={{ maxWidth: width, minWidth: width, width }}
    >
      {value}
    </div>
  );
}

export default function CitationTableRowItem({
  citedBy,
  consensusMeta,
  source,
  type,
  year,
}: CitationTableRowItemProps): ReactElement<"div"> {
  const formattedSource =
    source.length > 80 ? source.slice(0, 80) + " ..." : source;
  return (
    <div className={css(styles.tableRowItem)}>
      <ItemColumn bold value={formattedSource} width={tableWidths.SOURCE} />
      <ItemColumn value={type} width={tableWidths.TYPE} />
      <ItemColumn value={year} width={tableWidths.YEAR} />
      <ItemColumn
        value={<CitationConsensusItem consensusMeta={consensusMeta} />}
        width={tableWidths.CONSENSUS}
      />
      <ItemColumn
        value={<AuthorFacePile authorProfiles={citedBy} imgSize={24} />}
        width={tableWidths.CITED_BY}
      />
    </div>
  );
}

const styles = StyleSheet.create({
  itemColumn: {
    // NOTE: this needs to match headerItem of CitationTableHeaderItem
    alignItems: "center",
    display: "flex",
    fontSize: 14,
    height: 80,
    justifyContent: "flex-start",
    padding: "0 8px",
    fontFamily: "Roboto",
    size: 16,
    fontStyle: "normal",
    fontWeight: 400,
  },
  bold: {
    size: 16,
    fontStyle: "normal",
    fontWeight: 500,
  },
  tableRowItem: {
    borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    display: "flex",
    width: "100%",
  },
});

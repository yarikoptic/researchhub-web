import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import { get } from "lodash";
import { useRouter } from "next/router";

import colors from "~/config/themes/colors";
import ComponentWrapper from "~/components/ComponentWrapper";
import EmptyFeedScreen from "~/components/Home/EmptyFeedScreen";
import { fetchUserVote } from "~/components/UnifiedDocFeed/api/unifiedDocFetch";
import { breakpoints } from "~/config/themes/screen";
import HubCard from "~/components/Hubs/HubCard";
import LeaderboardUser from "~/components/Leaderboard/LeaderboardUser";
import HorizontalTabBar from "~/components/HorizontalTabBar";
import SearchResultsForDocs from "~/components/Search/SearchResultsForDocs";

const SearchResults = ({ apiResponse }) => {
  const router = useRouter();
  const currentSearchType = get(router, "query.type");

  const handleTabClick = (tab) => {
    const updatedQuery = {
      ...router.query,
      type: tab.type,
    };

    router.push({
      pathname: "/search/[type]",
      query: updatedQuery,
    });
  };

  const renderEntityTabs = () => {
    let tabs = [
      { type: "paper", label: "Papers" },
      { type: "post", label: "Posts" },
      { type: "hub", label: "Hubs" },
      { type: "person", label: "People" },
    ];

    tabs = tabs.map((t) => {
      t.isSelected = t.type === router.query.type ? true : false;
      return t;
    });

    return (
      <HorizontalTabBar
        tabs={tabs}
        onClick={handleTabClick}
        containerStyle={styles.tabContainer}
      />
    );
  };

  return (
    <ComponentWrapper overrideStyle={styles.componentWrapper}>
      {renderEntityTabs()}
      {currentSearchType === "paper" || currentSearchType === "post" ? (
        <SearchResultsForDocs apiResponse={apiResponse} />
      ) : currentSearchType === "hub" ? (
        <div className={css(styles.grid)}>
          {results.map((hub, index) => {
            return <HubCard key={hub.id} hub={hub} />;
          })}
        </div>
      ) : currentSearchType === "person" ? (
        ""
      ) : null}
    </ComponentWrapper>
  );
};

const styles = StyleSheet.create({
  componentWrapper: {
    marginTop: 40,
    marginBottom: 20,
  },
  tabContainer: {
    marginBottom: 40,
  },

  grid: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "left",
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 30,
    "@media only screen and (max-width: 767px)": {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },

  user: {
    display: "flex",
    width: "100%",
    boxSizing: "border-box",
    padding: "7px 20px",
    borderLeft: "3px solid #FFF",
    transition: "all ease-out 0.1s",
    ":hover": {
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
      backgroundColor: "#FAFAFA",
    },
  },
});

SearchResults.propTypes = {
  apiResponse: PropTypes.object,
};

export default SearchResults;

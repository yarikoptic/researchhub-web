import React from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

// Component
import Button from "../../components/Form/Button";
import AddHubModal from "../../components/modal/AddHubModal";
import Message from "../../components/Loader/Message";
import PermissionNotificationWrapper from "../../components/PermissionNotificationWrapper";
import Head from "~/components/Head";
import CategoryList from "~/components/Hubs/CategoryList";
import HubCard from "../../components/Hubs/HubCard";

// Config
import colors from "../../config/themes/colors";
import icons from "~/config/themes/icons";

// Redux
import { HubActions } from "~/redux/hub";
import { ModalActions } from "../../redux/modals";
import { MessageActions } from "../../redux/message";
import { finished } from "stream";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      width: null,
      categories: [],
      hubsByCategory: {},
      finishedLoading: false,
    };
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount = async () => {
    const { getCategories, getHubs, showMessage, hubs } = this.props;
    showMessage({ show: true, load: true });
    if (!hubs.fetchedHubs) {
      getCategories().then((payload) => {
        this.setState({ categories: payload.payload.categories });
      });
      getHubs().then((action) => {
        this.setState({ hubsByCategory: action.payload.hubsByCategory });
      });
    } else {
      setTimeout(() => {
        this.setState({
          categories: JSON.parse(JSON.stringify(hubs.categories)),
          hubsByCategory: JSON.parse(JSON.stringify(hubs.hubsByCategory)),
          finishedLoading: true,
        });
        showMessage({ show: false });
      }, 400);
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.hubs.hubsByCategory !== this.props.hubs.hubsByCategory) {
      const { showMessage, hubs } = this.props;
      showMessage({ show: true, load: true });
      setTimeout(() => {
        this.setState(
          {
            hubsByCategory: JSON.parse(JSON.stringify(hubs.hubsByCategory)),
            finishedLoading: true,
          },
          () => {
            showMessage({ show: false });
          }
        );
      }, 400);
    }
  }

  openAddHubModal = () => {
    this.props.openAddHubModal(true);
  };

  addNewHubToState = (newHub) => {
    let hubsByCategory = { ...this.state.hubsByCategory };
    let key = newHub.category;
    if (hubsByCategory[key]) {
      hubsByCategory[key].push(newHub);
      hubsByCategory[key].sort((a, b) => a.name - b.name);
    } else {
      hubsByCategory[key] = [newHub];
    }
    this.setState({ hubsByCategory });
  };

  renderColumn = (width) => {
    const { categories } = this.state;

    return categories.map((category, i) => {
      let categoryID = category.id;
      let categoryName = category.category_name;
      return (
        <>
          <div
            name={categoryName}
            className={css(styles.label)}
          >{`${categoryName}`}</div>
          <div key={`${categoryName}_${i}`} className={css(styles.grid)}>
            {this.renderList(categoryID)}
          </div>
        </>
      );
    });
  };

  renderList = (key) => {
    const { hubsByCategory } = this.state;

    if (!hubsByCategory[key]) {
      return null;
    } else {
      return hubsByCategory[key].map((hub) => {
        return <HubCard hub={hub} />;
      });
    }
  };

  render() {
    let { finishedLoading, categories } = this.state;

    return (
      <div className={css(styles.row, styles.body)}>
        <div className={css(styles.sidebar)}>
          <CategoryList
            current={this.props.home ? null : this.props.hub}
            initialHubList={this.props.initialHubList}
            categories={categories}
          />
        </div>
        <div className={css(styles.content)}>
          <AddHubModal addHub={this.addNewHubToState} />
          <Message />
          <Head
            title={"Hubs on Researchhub"}
            description={"View all of the communities on Researchhub"}
          />
          <div className={css(styles.container)}>
            <div className={css(styles.titleContainer)}>
              <span className={css(styles.title)}>Hubs</span>
              <PermissionNotificationWrapper
                modalMessage="suggest a hub"
                loginRequired={true}
                onClick={this.openAddHubModal}
              >
                <Button
                  isWhite={true}
                  label={"Suggest a Hub"}
                  buttonStyle={styles.button}
                  hideRipples={true}
                />
              </PermissionNotificationWrapper>
            </div>
            <div
              className={css(
                styles.hubsContainer,
                finishedLoading && styles.reveal
              )}
            >
              {this.renderColumn(this.state.width)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#FCFCFC",
    alignItems: "flex-start",
  },
  container: {
    width: "90%",
    margin: "auto",
  },
  titleContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },
  hubsContainer: {
    opacity: 0,
    transition: "all ease-in-out 0.3s",
  },
  reveal: {
    opacity: 1,
  },
  title: {
    fontSize: 33,
    fontWeight: 500,
    marginRight: 30,
    color: "#241F3A",
    cursor: "default",
    userSelect: "none",
  },
  sidebar: {
    minWidth: 220,
    "@media only screen and (max-width: 769px)": {
      display: "none",
    },
  },
  content: {
    borderLeft: "1px solid #ededed",
    "@media only screen and (min-width: 900px)": {
      width: "90%",
    },
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    borderBottom: "1px solid #ededed",
    fontSize: 22,
    fontWeight: 500,
    color: "#241F3A",
    paddingBottom: 10,
    marginBottom: 15,
    cursor: "default",
    userSelect: "none",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "left",
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 40,
  },
});

const mapStateToProps = (state) => ({
  hubs: state.hubs,
});

const mapDispatchToProps = {
  getCategories: HubActions.getCategories,
  getHubs: HubActions.getHubs,
  openAddHubModal: ModalActions.openAddHubModal,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

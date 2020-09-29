const bindAll = require('lodash.bindall');
const classNames = require('classnames');
const FormattedHTMLMessage = require('react-intl').FormattedHTMLMessage;
const FormattedMessage = require('react-intl').FormattedMessage;
const injectIntl = require('react-intl').injectIntl;
const intlShape = require('react-intl').intlShape;
const React = require('react');

const Button = require('../../components/forms/button.jsx');
const FlexRow = require('../../components/flex-row/flex-row.jsx');
const Comment = require('../../components/comment/comment.jsx');
const People = require('./people.json');
const PeopleGrid = require('../../components/people-grid/people-grid.jsx');
const WorldMap = require('../../components/world-map/world-map.jsx');
const CountryUsage = require('./country-usage.json');

const Page = require('../../components/page/www/page.jsx');
const render = require('../../lib/render.jsx');

const MediaQuery = require('react-responsive').default;
const frameless = require('../../lib/frameless');

require('./annual-report.scss');

const SECTIONS = {
    message: 'message',
    mission: 'mission',
    reach: 'reach',
    milestones: 'milestones',
    initiatives: 'initiatives',
    financials: 'financials',
    supporters: 'supporters',
    leadership: 'leadership',
    donate: 'donate'
};

const SECTION_NAMES = {
    message: <FormattedMessage id="annualReport.subnavMessage" />,
    mission: <FormattedMessage id="annualReport.subnavMission" />,
    reach: <FormattedMessage id="annualReport.subnavReach" />,
    milestones: <FormattedMessage id="annualReport.subnavMilestones" />,
    initiatives: <FormattedMessage id="annualReport.subnavInitiatives" />,
    financials: <FormattedMessage id="annualReport.subnavFinancials" />,
    supporters: <FormattedMessage id="annualReport.subnavSupporters" />,
    leadership: <FormattedMessage id="annualReport.subnavLeadership" />,
    donate: <FormattedMessage id="annualReport.subnavDonate" />
};

const countryNames = Object.keys(CountryUsage);
const countryData = countryNames.map(key => CountryUsage[key].count);
const colorIndex = countryNames.map(key => CountryUsage[key]['log count']);

class AnnualReport extends React.Component {
    constructor (props) {
        super(props);

        // Storage for each of the section refs when we need to refer
        // to them in the scroll handling code
        // These will be stored with a short lowercase key representing
        // the specific section (e.g. 'mission')
        this.sectionRefs = {};

        this.subnavRef = null;

        this.state = {
            currentlyVisible: SECTIONS.message,
            dropdownVisible: false
        };

        bindAll(this, [
            'scrollTo',
            'setRef',
            'setSubnavRef',
            'handleSubnavItemClick',
            'getDimensionsOfSection',
            'handleScroll',
            'handleDropDownClick'
        ]);
    }

    componentDidMount () {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnMount () {
        window.removeEventListener('scroll', this.handleScroll);
    }

    // A generic handler for a subnav item that takes the name of the
    // section to scroll to (all lowercase)
    handleSubnavItemClick (sectionName) {
        // Return a button click handler that scrolls to the
        // correct section
        return () => {
            this.setState({dropdownVisible: false});
            this.scrollTo(this.sectionRefs[sectionName]);
        };
    }

    scrollTo (element) {
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    setRef (sectionName) {
        return ref => (this.sectionRefs[sectionName] = ref);
    }

    setSubnavRef (ref) {
        this.subnavRef = ref;
    }

    getDimensionsOfSection (sectionRef) {
        const {height} = sectionRef.getBoundingClientRect();
        const offsetTop = sectionRef.offsetTop;
        const offsetBottom = offsetTop + height;

        return {
            height,
            offsetTop,
            offsetBottom
        };
    }

    handleScroll () {
        const subnavHeight = this.getDimensionsOfSection(this.subnavRef).height;
        // The additional 50 is to account for the main site nav height
        const currentScrollPosition = window.scrollY + subnavHeight + 50;

        // Find which section is currently visible based on our scroll position
        for (const key in this.sectionRefs) {
            if (!this.sectionRefs.hasOwnProperty(key)) continue;
            const currentRef = this.sectionRefs[key];
            const {offsetBottom, offsetTop} = this.getDimensionsOfSection(currentRef);
            if (currentScrollPosition > offsetTop && currentScrollPosition < offsetBottom) {
                if (this.state.currentlyVisible !== key) {
                    this.setState({currentlyVisible: key});
                    return;
                }
            }
        }
    }

    handleDropDownClick () {
        this.setState({dropdownVisible: !this.state.dropdownVisible});
    }

    render () {
        const subnav = (<FlexRow className="inner">
            <a
                className={classNames(
                    {selectedItem: this.state.currentlyVisible === SECTIONS.message}
                )}
                onClick={this.handleSubnavItemClick(SECTIONS.message)}
            >
                {SECTION_NAMES.message}
            </a>
            <a
                className={classNames(
                    {selectedItem: this.state.currentlyVisible === SECTIONS.mission}
                )}
                onClick={this.handleSubnavItemClick(SECTIONS.mission)}
            >
                <FormattedMessage id="annualReport.subnavMission" />
            </a>
            <a
                className={classNames(
                    {selectedItem: this.state.currentlyVisible === SECTIONS.milestones}
                )}
                onClick={this.handleSubnavItemClick(SECTIONS.milestones)}
            >
                <FormattedMessage id="annualReport.subnavMilestones" />
            </a>
            <a
                className={classNames(
                    {selectedItem: this.state.currentlyVisible === SECTIONS.reach}
                )}
                onClick={this.handleSubnavItemClick(SECTIONS.reach)}
            >
                <FormattedMessage id="annualReport.subnavReach" />
            </a>
            <a
                className={classNames(
                    {selectedItem: this.state.currentlyVisible === SECTIONS.initiatives}
                )}
                onClick={this.handleSubnavItemClick(SECTIONS.initiatives)}
            >
                <FormattedMessage id="annualReport.subnavInitiatives" />
            </a>
            <a
                className={classNames(
                    {selectedItem: this.state.currentlyVisible === SECTIONS.financials}
                )}
                onClick={this.handleSubnavItemClick(SECTIONS.financials)}
            >
                <FormattedMessage id="annualReport.subnavFinancials" />
            </a>
            <a
                className={classNames(
                    {selectedItem: this.state.currentlyVisible === SECTIONS.supporters}
                )}
                onClick={this.handleSubnavItemClick(SECTIONS.supporters)}
            >
                <FormattedMessage id="annualReport.subnavSupporters" />
            </a>
            <a
                className={classNames(
                    {selectedItem: this.state.currentlyVisible === SECTIONS.leadership}
                )}
                onClick={this.handleSubnavItemClick(SECTIONS.leadership)}
            >
                <FormattedMessage id="annualReport.subnavLeadership" />
            </a>
            <a
                className={classNames(
                    {selectedItem: this.state.currentlyVisible === SECTIONS.donate}
                )}
                onClick={this.handleSubnavItemClick(SECTIONS.donate)}
            >
                <FormattedMessage id="annualReport.subnavDonate" />
            </a>
        </FlexRow>);


        return (
            <div>
                <div
                    className="subnavigation"
                    ref={this.setSubnavRef}
                >
                    {/* Top Bar */}
                    <MediaQuery maxWidth={frameless.tabletPortrait - 1}>
                        <div className="sectionIndicator inner" >
                            {SECTION_NAMES[this.state.currentlyVisible]}
                            <Button
                                className="dropdown-button"
                                onClick={this.handleDropDownClick}
                            >
                                <img
                                    className={classNames({rotated: this.state.dropdownVisible})}
                                    src="/images/annual-report/dropdown-arrow.svg"
                                />
                            </Button>
                        </div>
                        {this.state.dropdownVisible ?
                            /* Bottom Bar */
                            <div className="inner">
                                <hr />
                                {subnav}
                            </div> :
                            null
                        }
                    </MediaQuery>
                    {/* Bottom Bar */}
                    <MediaQuery minWidth={frameless.tabletPortrait}>
                        {subnav}
                    </MediaQuery>
                </div>
                <div className="annual-report-content">
                    <div
                        className="message-section section"
                        ref={this.setRef(SECTIONS.message)}
                    >
                        <FlexRow className="masthead">
                            <div className="masthead-content">
                                <p className="message-year">
                                    <FormattedMessage id="annualReport.mastheadYear" />
                                </p>
                                <h1>
                                    <FormattedMessage id="annualReport.mastheadTitle" />
                                </h1>
                            </div>
                            <img src="/images/annual-report/message/hero-image.svg" />
                        </FlexRow>
                        <MediaQuery minWidth={frameless.desktop}>
                            <img
                                className="wave-icon-desktop"
                                src="/images/annual-report/message/wave-icon.svg"
                            />
                        </MediaQuery>
                        <div className="inner">
                            <FlexRow className="message-content">
                                <MediaQuery maxWidth={frameless.desktop - 1}>
                                    {/* Show the wave icon inside this div in smaller screens */}
                                    <div className="wave-icon-and-title">
                                        <img src="/images/annual-report/message/wave-icon.svg" />
                                        <h2>
                                            <FormattedMessage id="annualReport.messageTitle" />
                                        </h2>
                                    </div>
                                </MediaQuery>
                                <MediaQuery minWidth={frameless.desktop}>
                                    <h2>
                                        <FormattedMessage id="annualReport.messageTitle" />
                                    </h2>
                                </MediaQuery>
                                <div className="message-from-team">
                                    <p>
                                        <FormattedMessage id="annualReport.messageP1" />
                                    </p>
                                    <p>
                                        <FormattedMessage id="annualReport.messageP2" />
                                    </p>
                                    <p>
                                        <FormattedMessage id="annualReport.messageP3" />
                                    </p>
                                    <p>
                                        <FormattedMessage id="annualReport.messageP4" />
                                    </p>
                                    <p>
                                        <FormattedMessage id="annualReport.messageP5" />
                                    </p>
                                    <p className="message-signature">
                                        <FormattedMessage id="annualReport.messageSignature" />
                                    </p>
                                    <img
                                        className="team-photo"
                                        src="/images/annual-report/message/team-photo.svg"
                                    />
                                </div>
                            </FlexRow>
                        </div>
                        <div className="transition-images">
                            <img src="/images/annual-report/message/blocks.svg" />
                            <img src="/images/annual-report/message/banana.svg" />
                        </div>
                    </div>
                    <div className="covid-response-section inner">
                        <h2>
                            <FormattedMessage id="annualReport.covidResponseTitle" />
                        </h2>
                        <p>
                            <FormattedMessage id="annualReport.covidResponseP1" />
                        </p>
                        <p>
                            <FormattedMessage
                                id="annualReport.covidResponseP2"
                                values={{
                                    scratchAtHomeLink: (
                                        <a href="#">
                                            <FormattedMessage id="annualReport.covidResponseScratchAtHomePage" />
                                        </a>
                                    )
                                }}
                            />
                        </p>
                        <p>
                            <FormattedMessage
                                id="annualReport.covidResponseP3"
                                values={{
                                    scratchCommunityLink: (
                                        <a href="#">
                                            <FormattedMessage id="annualReport.covidResponseScratchCommunity" />
                                        </a>
                                    )
                                }}
                            />
                        </p>
                    </div>
                    <div
                        className="mission section"
                        id="mission"
                        ref={this.setRef(SECTIONS.mission)}
                    >
                        <div className="inner">
                        </div>
                    </div>
                    <div
                        className="milestones-section section"
                        id="milestones"
                        ref={this.setRef(SECTIONS.milestones)}
                    >
                        <div className="inner">
                            <div className="milestones-wrapper">
                                <div className="milestones-column left">
                                    <h2>
                                        <FormattedMessage id="annualReport.milestonesTitle" />
                                    </h2>
                                    <p className="milestones-description">
                                        <FormattedMessage id="annualReport.milestonesDescription" />
                                    </p>
                                    <MediaQuery minWidth={frameless.desktop}>
                                        <img
                                            className="single-image"
                                            src="/images/annual-report/milestones/timeline1.svg"
                                        />
                                    </MediaQuery>
                                </div>
                                <div className="milestones-column right">
                                    <div className="milestone-box first">
                                        <h4>
                                            2003
                                            {/* TODO should this be localized? */}
                                        </h4>
                                        <p>
                                            <FormattedMessage id="annualReport.milestones2003Message" />
                                        </p>
                                    </div>
                                    <div className="milestone-box">
                                        <h4>
                                            2004
                                            {/* TODO should this be localized? */}
                                        </h4>
                                        <p>
                                            <FormattedMessage id="annualReport.milestones2004Message" />
                                        </p>
                                        <img src="/images/annual-report/milestones/2004_Clubhouse.jpg" />
                                    </div>
                                    <div className="milestone-box last">
                                        <h4>
                                            2007
                                            {/* TODO should this be localized? */}
                                        </h4>
                                        <p>
                                            <FormattedMessage id="annualReport.milestones2007Message" />
                                        </p>
                                        <img src="/images/annual-report/milestones/2007_EarlyScratch.png" />
                                    </div>
                                </div>
                            </div>
                            <MediaQuery minWidth={frameless.desktop}>
                                <img src="/images/annual-report/milestones/timeline_line_right.svg" />
                            </MediaQuery>
                            <div className="milestones-wrapper">
                                <div className="milestones-column left">
                                    <div className="milestone-box">
                                        <h4>
                                            2008
                                            {/* TODO should this be localized? */}
                                        </h4>
                                        <p>
                                            <FormattedMessage id="annualReport.milestones2008Message" />
                                        </p>
                                        <img src="/images/annual-report/milestones/2008_Conference.jpg" />
                                    </div>
                                    <div className="milestone-box">
                                        <h4>
                                            2009
                                            {/* TODO should this be localized? */}
                                        </h4>
                                        <p>
                                            <FormattedMessage id="annualReport.milestones2009Message1.4" />
                                        </p>
                                        <img src="/images/annual-report/milestones/2009_Scratch1_4.png" />
                                    </div>
                                    <div className="milestone-box">
                                        <h4>
                                            2009
                                            {/* TODO should this be localized? */}
                                        </h4>
                                        <p>
                                            <FormattedMessage id="annualReport.milestones2009MessageScratchDay" />
                                        </p>
                                    </div>
                                    <div className="milestone-box">
                                        <h4>
                                            2010
                                            {/* TODO should this be localized? */}
                                        </h4>
                                        <p>
                                            <FormattedMessage id="annualReport.milestones2010Message" />
                                        </p>
                                    </div>
                                </div>
                                <div className="milestones-column right">
                                    <MediaQuery minWidth={frameless.desktop}>
                                        <img
                                            className="single-image"
                                            src="/images/annual-report/milestones/timeline2.svg"
                                        />
                                    </MediaQuery>
                                </div>
                            </div>
                            <MediaQuery minWidth={frameless.desktop}>
                                <img src="/images/annual-report/milestones/timeline_line_left.svg" />
                            </MediaQuery>
                            <div className="milestones-wrapper">
                                <div className="milestones-column left">
                                    <MediaQuery minWidth={frameless.desktop}>
                                        <img
                                            className="single-image"
                                            src="/images/annual-report/milestones/timeline3.svg"
                                        />
                                    </MediaQuery>
                                </div>
                                <div className="milestones-column right">
                                    <div className="milestone-box">
                                        <h4>
                                            2013
                                            {/* TODO should this be localized? */}
                                        </h4>
                                        <p>
                                            <FormattedMessage id="annualReport.milestones2013MessageFoundation" />
                                        </p>
                                    </div>
                                    <div className="milestone-box">
                                        <h4>
                                            2013
                                            {/* TODO should this be localized? */}
                                        </h4>
                                        <p>
                                            <FormattedMessage id="annualReport.milestones2013MessageScratch2" />
                                        </p>
                                        <img src="/images/annual-report/milestones/2013_Scratch2.png" />
                                    </div>
                                    <div className="milestone-box">
                                        <h4>
                                            2014
                                            {/* TODO should this be localized? */}
                                        </h4>
                                        <p>
                                            <FormattedMessage id="annualReport.milestones2014Message" />
                                        </p>
                                        <img src="/images/annual-report/milestones/2014_ScratchJr.jpg" />
                                    </div>
                                    <div className="milestone-box">
                                        <h4>
                                            2016
                                            {/* TODO should this be localized? */}
                                        </h4>
                                        <p>
                                            <FormattedMessage id="annualReport.milestones2016Message" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <MediaQuery minWidth={frameless.desktop}>
                                <img src="/images/annual-report/milestones/timeline_line_right.svg" />
                            </MediaQuery>
                            <div className="milestones-wrapper">
                                <div className="milestones-column left">
                                    <div className="milestone-box">
                                        <h4>
                                            2017
                                            {/* TODO should this be localized? */}
                                        </h4>
                                        <p>
                                            <FormattedMessage id="annualReport.milestones2017Message" />
                                        </p>
                                    </div>
                                    <div className="milestone-box">
                                        <h4>
                                            2019
                                            {/* TODO should this be localized? */}
                                        </h4>
                                        <p>
                                            <FormattedMessage id="annualReport.milestones2019MessageScratch3" />
                                        </p>
                                        <img src="/images/annual-report/milestones/2019_Scratch3.jpg" />
                                    </div>
                                    <div className="milestone-box">
                                        <h4>
                                            2019
                                            {/* TODO should this be localized? */}
                                        </h4>
                                        <p>
                                            <FormattedMessage id="annualReport.milestones2019MessageMove" />
                                        </p>
                                    </div>
                                </div>
                                <div className="milestones-column right">
                                    <MediaQuery minWidth={frameless.desktop}>
                                        <img
                                            className="single-image"
                                            src="/images/annual-report/milestones/timeline4.svg"
                                        />
                                    </MediaQuery>
                                </div>
                            </div>
                        </div>
                        <div className="transition-images">
                            <img src="/images/annual-report/milestones/vertical-loop.svg" />
                            <img src="/images/annual-report/milestones/painting-hand.svg" />
                        </div>
                    </div>
                    <div
                        className="reach-section section"
                        id="reach"
                        ref={this.setRef(SECTIONS.reach)}
                    >
                        <div className="inner">
                            <div className="reach-intro">
                                <h2>
                                    <FormattedMessage id="annualReport.reachTitle" />
                                </h2>
                                <p>
                                    <FormattedMessage id="annualReport.reachSubtitle" />
                                </p>
                                <div className="reach-numbers">
                                    <div className="reach-datapoint">
                                        <FormattedMessage
                                            id="annualReport.reach170million"
                                            values={{
                                                million: (
                                                    <div className="million">
                                                        <FormattedMessage id="annualReport.reachMillion" />
                                                    </div>
                                                )
                                            }}
                                        />
                                        <h4>
                                            <FormattedMessage id="annualReport.reachUniqueVisitors" />
                                        </h4>
                                    </div>
                                    <div className="reach-datapoint">
                                        <FormattedMessage
                                            id="annualReport.reach170million"
                                            values={{
                                                million: (
                                                    <div className="million">
                                                        <FormattedMessage id="annualReport.reachMillion" />
                                                    </div>
                                                )
                                            }}
                                        />
                                        <h4>
                                            <FormattedMessage id="annualReport.reachUniqueVisitors" />
                                        </h4>
                                    </div>
                                    <div className="reach-datapoint">
                                        <FormattedMessage
                                            id="annualReport.reach170million"
                                            values={{
                                                million: (
                                                    <div className="million">
                                                        <FormattedMessage id="annualReport.reachMillion" />
                                                    </div>
                                                )
                                            }}
                                        />
                                        <h4>
                                            <FormattedMessage id="annualReport.reachUniqueVisitors" />
                                        </h4>
                                    </div>
                                    <div className="reach-datapoint">
                                        <FormattedMessage
                                            id="annualReport.reach170million"
                                            values={{
                                                million: (
                                                    <div className="million">
                                                        <FormattedMessage id="annualReport.reachMillion" />
                                                    </div>
                                                )
                                            }}
                                        />
                                        <h4>
                                            <FormattedMessage id="annualReport.reachUniqueVisitors" />
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="reach-growth">
                                <div className="growth-blurb">
                                    <h3>
                                        <FormattedMessage id="annualReport.reachGrowthTitle" />
                                    </h3>
                                    <p>
                                        <FormattedMessage id="annualReport.reachGrowthBlurb" />
                                    </p>
                                </div>
                                <img src="/images/annual-report/milestones/community-growth-graph.svg" />
                            </div>
                            <div className="reach-map">
                                <h3>
                                    <FormattedMessage id="annualReport.reachGlobalCommunity" />
                                </h3>
                                <p>
                                    <FormattedMessage id="annualReport.reachMapBlurb" />
                                </p>
                                <WorldMap
                                    colorIndex={colorIndex}
                                    countryData={countryData}
                                    countryNames={countryNames}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="reach-scratch-jr section">
                        <div className="inner">
                            <div className="scratch-jr-intro">
                                <img src="/images/annual-report/ScratchJr-Logo.svg" />
                                <p>
                                    <FormattedMessage id="annualReport.reachScratchJrBlurb" />
                                </p>
                            </div>
                            <div className="reach-datapoint">
                                <FormattedMessage
                                    id="annualReport.reach170million"
                                    values={{
                                        million: (
                                            <div className="million">
                                                <FormattedMessage id="annualReport.reachMillion" />
                                            </div>
                                        )
                                    }}
                                />
                                <h4>
                                    <FormattedMessage id="annualReport.reachUniqueVisitors" />
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div
                        className="initiatives section"
                        id="initiatives"
                        ref={this.setRef(SECTIONS.initiatives)}
                    >
                        <div className="inner">
                        </div>
                    </div>
                    <div
                        className="financials-section section"
                        id="financials"
                        ref={this.setRef(SECTIONS.financials)}
                    >
                        <div className="inner">
                            <h2 className="financials-h2">
                                <FormattedMessage id="annualReport.financialsTitle" />
                            </h2>
                            <h3>
                                <FormattedMessage id="annualReport.financialsRevenue" />
                            </h3>
                            <hr />
                            <div className="financials-content">
                                <div className="financials-table">
                                    <div className="circle-and-words">
                                        <img src="/images/annual-report/blue-circle.svg" />
                                        <div className="key-and-money">
                                            <p className="key">
                                                <FormattedMessage id="annualReport.financialsGrants" />
                                            </p>
                                            <p>
                                                $3,898,078
                                                <span className="percentage"> (82.7%)</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="circle-and-words">
                                        <img src="/images/annual-report/yellow-circle.svg" />
                                        <div className="key-and-money">
                                            <p className="key">
                                                <FormattedMessage id="annualReport.financialsEvents" />
                                            </p>
                                            <p>
                                                $700,000
                                                <span className="percentage"> (14.8%)</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="circle-and-words">
                                        <img src="/images/annual-report/green-circle.svg" />
                                        <div className="key-and-money">
                                            <p className="key">
                                                <FormattedMessage id="annualReport.financialsOther" />
                                            </p>
                                            <p>
                                                $114,982
                                                <span className="percentage"> (2.4%)</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="circle-and-words">
                                        <div className="key-and-money total">
                                            <p className="key">
                                                <FormattedMessage id="annualReport.financialsTotal" />
                                            </p>
                                            <p>
                                                $4,713,060
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <img
                                    className="graph"
                                    src="/images/annual-report/revenue-graph.svg"
                                />
                            </div>
                            <h3>
                                <FormattedMessage id="annualReport.financialsExpenses" />
                            </h3>
                            <hr />
                            <div className="financials-content">
                                <div className="financials-table">
                                    <div className="circle-and-words">
                                        <img src="/images/annual-report/blue-circle.svg" />
                                        <div className="key-and-money">
                                            <p className="key">
                                                <FormattedMessage id="annualReport.financialsProgram" />
                                            </p>
                                            <p>
                                                $1,135,767
                                                <span className="percentage"> (48.8%)</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="circle-and-words">
                                        <img src="/images/annual-report/yellow-circle.svg" />
                                        <div className="key-and-money">
                                            <p className="key">
                                                <FormattedMessage id="annualReport.financialsGeneral" />
                                            </p>
                                            <p>
                                                $224,104
                                                <span className="percentage"> (9.6%)</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="circle-and-words">
                                        <img src="/images/annual-report/green-circle.svg" />
                                        <div className="key-and-money">
                                            <p className="key">
                                                <FormattedMessage id="annualReport.financialsFundraising" />
                                            </p>
                                            <p>
                                                $962,958
                                                <span className="percentage"> (41.4%)</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="circle-and-words">
                                        <div className="key-and-money total">
                                            <p className="key">
                                                <FormattedMessage id="annualReport.financialsTotal" />
                                            </p>
                                            <p>
                                                $2,322,829
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <img
                                    className="graph"
                                    src="/images/annual-report/expenses-graph.svg"
                                />
                            </div>
                            <div className="financials-button-wrapper">
                                <a href="https://secure.donationpay.org/scratchfoundation/">
                                    <Button className="financials-button">
                                        <FormattedMessage id="annualReport.financialsButton" />
                                        <img
                                            className="download-icon"
                                            src="/images/annual-report/download-icon.svg"
                                        />
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div
                        className="supporters-section section"
                        id="supporters"
                        ref={this.setRef(SECTIONS.supporters)}
                    >
                        <div className="inner">
                            <div className="supporters-heading">
                                <h2>
                                    <FormattedMessage id="annualReport.supportersTitle" />
                                </h2>
                                <p>
                                    <FormattedHTMLMessage id="annualReport.supportersIntro" />
                                </p>
                            </div>
                            <div className="subsection-tag">
                                <FormattedHTMLMessage id="annualReport.supportersSpotlightTitle" />
                            </div>
                            <div className="supporters-subsection">
                                <div className="supporters-blurb">
                                    <h4>
                                        <FormattedMessage id="annualReport.supportersSFETitle" />
                                    </h4>
                                    <p>
                                        <FormattedMessage id="annualReport.supportersSFEDescription1" />
                                    </p>
                                    <p>
                                        <FormattedMessage id="annualReport.supportersSFEDescription2" />
                                    </p>
                                    <p>
                                        <FormattedMessage id="annualReport.supportersSFEDescription3" />
                                    </p>
                                </div>
                            </div>
                            <div className="david-siegel">
                                <div className="ds-info">
                                    <img src="/images/annual-report/david-siegel-photo.svg" />
                                    <div className="ds-text">
                                        <h4>David Siegel</h4>
                                        <FormattedMessage id="annualReport.supportersCoFounder" />
                                        <br />Two Sigma
                                    </div>
                                </div>
                                <div className="ds-quote">
                                    {/* eslint-disable-next-line */}
                                    <Comment comment={this.props.intl.formatMessage({id: 'annualReport.supportersQuote'})} />
                                </div>
                            </div>
                            <div className="supporters-subsection supporters-lists">
                                <div className="supporters-blurb">
                                    <h4>
                                        <FormattedHTMLMessage id="annualReport.supportersThankYou" />
                                    </h4>
                                    <p>
                                        <FormattedHTMLMessage id="annualReport.supportersAllDescription" />
                                    </p>
                                    <p className="founding-partners-blurb">
                                        <FormattedHTMLMessage id="annualReport.supportersFoundingDescription" />
                                    </p>
                                </div>
                                <div className="supporters-level">
                                    <h5>
                                        <FormattedHTMLMessage id="annualReport.supportersFoundingTitle" />
                                    </h5>
                                    <hr />
                                    <div className="supporters-list">
                                        <ul className="supporters-list-side">
                                            <li>Massachusetts Institute of Technology</li>
                                            <li>National Science Foundation</li>
                                        </ul>
                                        <ul className="supporters-list-side">
                                            <li>Siegel Family Endowment</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="supporters-level">
                                    <h5>
                                        <FormattedHTMLMessage id="annualReport.supportersCreativityTitle" />
                                    </h5>
                                    <hr />
                                    <div className="supporters-list">
                                        <ul className="supporters-list-side">
                                            <li>Google</li>
                                            <li>LEGO Foundation</li>
                                            <li>Little Bluebridge Foundation</li>
                                        </ul>
                                        <ul className="supporters-list-side">
                                            <li>Smilegate Foundation</li>
                                            <li>TAL Education</li>
                                            <li>Warner Media</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="supporters-level">
                                    <h5>
                                        <FormattedHTMLMessage id="annualReport.supportersCollaborationTitle" />
                                    </h5>
                                    <hr />
                                    <div className="supporters-list">
                                        <ul className="supporters-list-side">
                                            <li>Mark Dalton</li>
                                            <li>Cindy and Evan Goldberg</li>
                                            <li>Paul T. Jones</li>
                                            <li>BrainPOP</li>
                                        </ul>
                                        <ul className="supporters-list-side">
                                            <li>Kahn-Rowe Family Fund</li>
                                            <li>LEGO Education</li>
                                            <li>Morgan Stanley</li>
                                            <li>Two Sigma</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="supporters-level">
                                    <h5>
                                        <FormattedHTMLMessage id="annualReport.supportersImaginationTitle" />
                                    </h5>
                                    <hr />
                                    <div className="supporters-list">
                                        <ul className="supporters-list-side">
                                            <li>Alex Ginsburg</li>
                                            <li>James Tomilson Hill</li>
                                            <li>John Overdeck</li>
                                            <li>Mitchel Resnick</li>
                                            <li>David Shaw</li>
                                            <li>David Siegel</li>
                                            <li>Tao Ye</li>
                                            <li>Christos Zoulas</li>
                                            <li>AT&T Aspire</li>
                                            <li>Big Hen Group</li>
                                            <li>Bloomberg Philanthropies</li>
                                            <li>Citibank</li>
                                            <li>Credit Suisse</li>
                                            <li>EPAM</li>
                                        </ul>
                                        <ul className="supporters-list-side">
                                            <li>Facebook</li>
                                            <li>Goldman Sachs</li>
                                            <li>Huron Foundation</li>
                                            <li>Intel One-to-One Institute</li>
                                            <li>Piantino Family Foundation</li>
                                            <li>Playmates Toys</li>
                                            <li>Skadden Arps</li>
                                            <li>Societe Generale</li>
                                            <li>Solomon Wilson Family Foundation</li>
                                            <li>Tudor Investments</li>
                                            <li>UBS</li>
                                            <li>Vista Equity Partners</li>
                                            <li>Weill Family Foundation</li>
                                            <li>WestRiver Group</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="supporters-level">
                                    <h5>
                                        <FormattedHTMLMessage id="annualReport.supportersInspirationTitle" />
                                    </h5>
                                    <hr />
                                    <div className="supporters-list">
                                        <ul className="supporters-list-side">
                                            <li>Erik Anderson</li>
                                            <li>Jon Claerbout</li>
                                            <li>Jonathan Dinu</li>
                                            <li>John Doerr</li>
                                            <li>Dan Huttenlocher</li>
                                            <li>Justin Nadler</li>
                                            <li>Ali-Milan Nekmouche</li>
                                            <li>Edward Schmidt</li>
                                            <li>Hope Smith</li>
                                            <li>Alfred Spector</li>
                                            <li>Ben Stein</li>
                                            <li>Donald Sussman</li>
                                            <li>Glen Whitney</li>
                                            <li>AIG</li>
                                            <li>Amazon</li>
                                        </ul>
                                        <ul className="supporters-list-side">
                                            <li>Bank of America</li>
                                            <li>Certified Moving & Storage</li>
                                            <li>Dalio Foundation, Inc.</li>
                                            <li>Dalton Family Foundation</li>
                                            <li>Deutsche Bank</li>
                                            <li>Ernst & Young</li>
                                            <li>Hearst Corporation</li>
                                            <li>HedgeServ</li>
                                            <li>Humble Bundle</li>
                                            <li>Intel Corporation</li>
                                            <li>Jenner & Block LLP</li>
                                            <li>La Vida Feliz Foundation</li>
                                            <li>Silicon Valley Bank</li>
                                            <li>Spin Master</li>
                                            <li>Union Square Ventures</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="supporters-level">
                                    <h5>
                                        <FormattedHTMLMessage id="annualReport.supportersExplorationTitle" />
                                    </h5>
                                    <hr />
                                    <div className="supporters-list">
                                        <ul className="supporters-list-side">
                                            <li>Michael Ball</li>
                                            <li>Ken Baron</li>
                                            <li>Craig Barrett</li>
                                            <li>Adam Beder</li>
                                            <li>Mark Bezos</li>
                                            <li>Eric Chen</li>
                                            <li>Michael Cirillo</li>
                                            <li>Eric Dahm</li>
                                            <li>Peter Desmond</li>
                                            <li>Jeremy Deutsch</li>
                                            <li>John Doyle</li>
                                            <li>Kenneth Ehlert</li>
                                            <li>Tim Ettenheim </li>
                                            <li>Alan Eustace</li>
                                            <li>Steve Evans</li>
                                            <li>Catherine Greenspon</li>
                                            <li>Jonathan W. Hitchon</li>
                                            <li>Margaret Honey</li>
                                            <li>Andrew Janian</li>
                                            <li>David Joerg</li>
                                            <li>Mark Loughridge</li>
                                            <li>Carter Lyons</li>
                                            <li>Adam Messinger</li>
                                            <li>Robert and Bethany Millard </li>
                                            <li>Stephen M. Ross</li>
                                            <li>Wray Thorn</li>
                                        </ul>
                                        <ul className="supporters-list-side">
                                            <li>Jessica Traynor</li>
                                            <li>Adobe</li>
                                            <li>Anchor Point Foundation</li>
                                            <li>Barclays</li>
                                            <li>Blackstone Charitable Foundation</li>
                                            <li>Blackstone Group</li>
                                            <li>Cisco/Meraki</li>
                                            <li>Citco</li>
                                            <li>Deloitte</li>
                                            <li>Eclipse Contracting</li>
                                            <li>Funny or Die</li>
                                            <li>Hasbro</li>
                                            <li>J.P. Morgan</li>
                                            <li>Mattel</li>
                                            <li>McGraw Hill Education</li>
                                            <li>NHK</li>
                                            <li>Pearson</li>
                                            <li>Pershing Square Foundation</li>
                                            <li>SAP</li>
                                            <li>Scholastic</li>
                                            <li>The Ramsey Family Fund</li>
                                            <li>Thelonious Monk Institute of Jazz</li>
                                            <li>Via Technologies</li>
                                            <li>WilmerHale</li>
                                            <li>Zoshinkai Holdings</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="supporters-subsection supporters-lists">
                                <div className="supporters-level">
                                    <h3>
                                        <FormattedHTMLMessage id="annualReport.supportersInKindTitle" />
                                    </h3>
                                    <div className="supporters-list">
                                        <ul className="supporters-list-side">
                                            <li>Amazon Web Services</li>
                                            <li>Fastly</li>
                                            <li>New Relic</li>
                                        </ul>
                                        <ul className="supporters-list-side">
                                            <li>DK</li>
                                            <li>No Starch Press</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="leadership-section section"
                        id="donate"
                        ref={this.setRef(SECTIONS.leadership)}
                    >
                        <div className="inner">
                            <h2>
                                <FormattedMessage id="annualReport.leadershipTitle" />
                            </h2>
                            <h3>
                                <FormattedMessage id="annualReport.leadershipBoard" />
                            </h3>
                            <FlexRow className="leadership-board">
                                <div className="board-member">
                                    <b className="board-title">
                                        <FormattedMessage id="annualReport.leadershipChair" />
                                    </b>
                                    <h4>Mitch Resnick</h4>
                                    <FormattedMessage id="annualReport.leadershipProfessor" />
                                    <br />MIT Media Lab
                                </div>
                                <div className="board-member">
                                    <b className="board-title">
                                        <FormattedMessage id="annualReport.leadershipViceChair" />
                                    </b>
                                    <h4>David Siegel</h4>
                                    <FormattedMessage id="annualReport.supportersCoFounder" />
                                    <br />Two Sigma
                                </div>
                                <div className="board-member">
                                    <b className="board-title">
                                        <FormattedMessage id="annualReport.leadershipBoardMember" />
                                    </b>
                                    <h4>Margaret Honey</h4>
                                    <FormattedMessage id="annualReport.leadershipPresidentCEO" />
                                    <br />Two Sigma
                                </div>
                                <div className="board-member">
                                    <b className="board-title">
                                        <FormattedMessage id="annualReport.leadershipBoardMember" />
                                    </b>
                                    <h4>Christina Miller</h4>
                                    <FormattedMessage id="annualReport.leadershipFormerPresident" />
                                    <br />Cartoon Network
                                </div>
                                <div className="board-member">
                                    <b className="board-title">
                                        <FormattedMessage id="annualReport.leadershipBoardMember" />
                                    </b>
                                    <h4>Avraham Kadar</h4>
                                    <FormattedMessage id="annualReport.leadershipFounderCEO" />
                                    <br />BrainPOP
                                </div>
                            </FlexRow>
                            <h4>
                                <FormattedMessage id="annualReport.leadershipBoardSecretaryTreasurer" />
                            </h4>
                            <FlexRow className="leadership-board">
                                <div className="board-member">
                                    <b className="board-title">
                                        <FormattedMessage id="annualReport.leadershipBoardSecretary" />
                                    </b>
                                    <h4>Sheri Vammen</h4>
                                </div>
                                <div className="board-member">
                                    <b className="board-title">
                                        <FormattedMessage id="annualReport.leadershipBoardTreasurer" />
                                    </b>
                                    <h4>Rich Sauer</h4>
                                </div>
                            </FlexRow>
                            <div className="leadership-scratch-team">
                                <h3>
                                    <FormattedMessage id="annualReport.leadershipScratchTeam" />
                                </h3>
                                <div className="executive-director">
                                    <PeopleGrid
                                        people={[{
                                            userName: 'Champ99',
                                            userId: 900283,
                                            name: 'Champika'
                                        }]}
                                    />
                                    <FormattedMessage id="annualReport.leadershipInterim" />
                                </div>
                                <PeopleGrid people={People} />
                            </div>
                        </div>
                    </div>
                    <div
                        className="donate-section section"
                        id="donate"
                        ref={this.setRef(SECTIONS.donate)}
                    >
                        <FlexRow className="donate-info">
                            <MediaQuery minWidth={frameless.tabletPortrait}>
                                <img src="/images/annual-report/donate-illustration.svg" />
                            </MediaQuery>
                            <div className="donate-content">
                                <h2>
                                    <FormattedMessage id="annualReport.donateTitle" />
                                </h2>
                                <p>
                                    <FormattedMessage id="annualReport.donateMessage" />
                                </p>
                                <a href="https://secure.donationpay.org/scratchfoundation/">
                                    <Button className="donate-button">
                                        <FormattedMessage id="annualReport.donateButton" />
                                    </Button>
                                </a>
                            </div>
                        </FlexRow>
                    </div>
                </div>
            </div>
        );
    }
}

AnnualReport.propTypes = {
    intl: intlShape
};

const WrappedAnnualReport = injectIntl(AnnualReport);

render(
    <Page><WrappedAnnualReport /></Page>, document.getElementById('app')
);
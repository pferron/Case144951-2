import gql from 'graphql-tag';

export default gql`
  type Query {
    """
    Query App Switcher links from navigation service
    """
    products: AppSwitcher @auth(methods: [BEARER], roles: [])
    """
    Returns navigation data for a given page. It takes 'navMetadata' input, which contains
    the navigation metadata of current page
    """
    navigation(navMetadata: NavMetadata!): CarinaNavigation @auth(methods: [BEARER], roles: [])
  }

  type AppSwitcher {
    id: String
    title: String
    defaultOpen: Boolean
    items: [UserProduct]
  }

  type UserProduct {
    id: String!
    icon: String!
    title: String!
    url: Url!
    status: String!
  }

  """
  Link format expected by carina navigation controls
  """
  type CarinaLink {
    href: String!
  }

  """
  Represents fields for Carina Search control
  """
  type CarinaSearch {
    url: String!
    title: String!
  }

  """
  Enum for status of App Switcher
  """
  enum CarinaAppSwitcherStatus {
    enabled
    disabled
  }

  """
  Enum for Carina App Icon name
  """
  enum CarinaAppIcon {
    BarGraphVerticalIcon
    CalendarIcon
    ContactsIcon
    DashboardIcon
    EventIcon
    ExportIcon
    HelpCircleIcon
    HotelIcon
    LogOutIcon
    MailIcon
    MessageBubblesIcon
    PagesIcon
    PaperIcon
    PersonAccountIcon
    RecentItemsIcon
    SettingsIcon
    SurveyIcon
    VideoIcon
  }

  """
  Represents a single link, that is placed inside Carina App Switcher component
  """
  type CarinaAppSwitcherLink {
    title: String!
    icon: CarinaAppIcon
    url: CarinaLink
    status: CarinaAppSwitcherStatus
  }

  """
  Represents Carina App Switcher model for navigation
  """
  type CarinaAppSwitcher {
    defaultOpen: Boolean!
    title: String!
    items: [CarinaAppSwitcherLink!]
  }

  """
  Represents a single navigation item or tree that is rendered by carina navigation controls.
  It has an items array, which is of same type, and can be multi-level deep (as of now, carina
  controls support only 2 level deep navigation tree)
  """
  type CarinaNavItem {
    title: String
    titleKey: String # this is optional phrase app key for the title
    url: CarinaLink
    ## Also from current @cvent/carina-navigation project and NavigationProvider design
    ## needs discussion as 1 top level value to then traverse a deep tree
    ## is problematic
    current: Boolean
    ## this should not be used as giant navigation 'tree' and use graphql connections instead
    ## or something else ...
    ## TODO, discuss carina navigation ui control owners
    items: [CarinaNavItem!]
    index: String!
  }

  """
  Contains the fields for carina navigation logo
  """
  type CarinaNavigationLogo {
    src: String
    url: String
    title: String
  }

  """
  Fields that are basic settings for navigation
  """
  interface CarinaApplicationSettings {
    title: String
    search: CarinaSearch
    isRtl: Boolean
    logo: CarinaNavigationLogo
    appSwitcher: CarinaAppSwitcher
  }

  """
  Response type expected of Carina's NavigationProvider
  """
  type CarinaNavigation implements CarinaApplicationSettings {
    id: ID!
    page: String!
    title: String
    search: CarinaSearch
    isRtl: Boolean
    logo: CarinaNavigationLogo
    appSwitcher: CarinaAppSwitcher
    globalNav: [CarinaNavItem]!
    localNav: [CarinaNavItem]!
  }
  scalar JSON

  """
  Represents the path parameter and its value, for a specific page
  """
  input PathParam {
    key: String!
    value: JSON!
  }

  """
  This represents the metadata of current page, used as input for the query that returns
  navigation data for the page.
  """
  input NavMetadata {
    """
    This is same value as dynamic route, and would also be used as apollo cache unique key
    """
    url: String!
    """
    This is the static path of the current page, used for locating it in the larger
    sitemap. Examples: /events/[eventId]/details, /events/overview, /rfps/[rfpId]/view
    """
    staticRouteId: String!
    """
    This is the id of top most parent node (e.g. 'rfp-local-nav', 'event-nav') of the
    Nav tree where this item belongs. If the value is not provided, it indicates that
    current page is one of the top level nodes in the nav tree
    """
    topParentId: String
    """
    These are page level parameters (e.g. rfpId, env, eventId) that are used to perform
    visibility check for different items in the nav tree
    """
    pathParams: [PathParam!]
  }
`;

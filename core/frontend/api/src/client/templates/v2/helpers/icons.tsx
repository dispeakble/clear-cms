import adultsIcon from "../assets/img/icons/adults-icon.svg";
import adultsWhiteIcon from "../assets/img/icons/adults-white-icon.svg";
import bedroomIcon from "../assets/img/icons/bedroom-icon.svg";
import breadcrumbIcon from "../assets/img/icons/breadcrumb-icon.svg";
import calendarIcon from "../assets/img/icons/calendar-icon.svg";
import checkIcon from "../assets/img/icons/check-icon.svg";
import checkInIcon from "../assets/img/icons/check-in-icon.svg";
import checkInWhiteIcon from "../assets/img/icons/check-in-white-icon.svg";
import checkOutIcon from "../assets/img/icons/check-out-icon.svg";
import checkOutWhiteIcon from "../assets/img/icons/check-out-white-icon.svg";
import checkSignGoldIcon from "../assets/img/icons/check-sign-gold-icon.svg";
import childIcon from "../assets/img/icons/child-icon.svg";
import childWhiteIcon from "../assets/img/icons/child-white-icon.svg";
import closeIcon from "../assets/img/icons/close-icon.svg";
import coldStarIcon from "../assets/img/icons/cold-star-icon.svg";
import dropDarkIcon from "../assets/img/icons/list-dd-dark-icon.svg";
import dropLightIcon from "../assets/img/icons/list-dd-light-icon.svg";
import dropdownIcon from "../assets/img/icons/dropdown-icon.svg";
import goldStarIcon from "../assets/img/icons/gold-star-icon.svg";
import infoIcon from "../assets/img/icons/info-icon.svg";
import orginfoIcon from "../assets/img/icons/orginfo-icon.svg";
import personIcon from "../assets/img/icons/person-icon.svg";
import personWhiteIcon from "../assets/img/icons/person-white-icon.svg";
import refreshIcon from "../assets/img/icons/refresh-icon.svg";
import roomDropIcon from "../assets/img/icons/roomDrop-icon.svg";
import roomUpIcon from "../assets/img/icons/roomUp-icon.svg";
import searchIcon from "../assets/img/icons/search-icon.svg";
import searchWhiteIcon from "../assets/img/icons/search-white-icon.svg";
import zoomIcon from "../assets/img/icons/zoom-icon.svg";
import departureIcon from "../assets/img/icons/departure-icon.svg";
import departureWhiteIcon from "../assets/img/icons/departure-white-icon.svg";
import arrivalIcon from "../assets/img/icons/arrival-icon.svg";
import arrivalWhiteIcon from "../assets/img/icons/arrival-white-icon.svg";
import destinationIcon from "../assets/img/icons/destination-icon.svg";
import companyIcon from "../assets/img/icons/company-icon.svg";
import worldMap from "../assets/img/world-map.svg";
import bookingDetailBg from "../assets/img/booking-detailbg.png";
import quoteUp from "../assets/img/icons/quote-up-icon.svg";
import quoteDown from "../assets/img/icons/quote-down-icon.svg";
import starIcon from "../assets/img/icons/star-icon.svg";
import starWhiteIcon from "../assets/img/icons/star-white-icon.svg";
import calendarCheckIcon from "../assets/img/icons/calendar-check-icon.svg";
import uncheckIcon from "../assets/img/icons/uncheck-icon.svg";
import filterIcon from "../assets/img/icons/filter-icon.svg";
import rightArrowIcon from "../assets/img/icons/right-arrow-icon.svg";
import leftArrowIcon from "../assets/img/icons/left-arrow-icon.svg";
import viewMoreIcon from "../assets/img/icons/view-more-icon.svg";
import loginEmail from "../assets/img/icons/email-icon.svg";
import loginPassword from "../assets/img/icons/password-icon.svg";

const icons: Record<string, any> = {
  loginEmail: loginEmail,
  loginPassword: loginPassword,
  uncheck: uncheckIcon,
  calendarCheckIcon: calendarCheckIcon,
  quoteUp: quoteUp,
  quoteDown: quoteDown,
  worldMap: worldMap,
  bookingDetailBg: bookingDetailBg,
  adults: adultsIcon,
  adultsWhite: adultsWhiteIcon,
  bedroom: bedroomIcon,
  breadcrumb: breadcrumbIcon,
  calendar: calendarIcon,
  check: checkIcon,
  checkIn: checkInIcon,
  checkInWhite: checkInWhiteIcon,
  checkOut: checkOutIcon,
  checkOutWhite: checkOutWhiteIcon,
  checkSignGold: checkSignGoldIcon,
  child: childIcon,
  childWhite: childWhiteIcon,
  close: closeIcon,
  coldStar: coldStarIcon,
  dropDark: dropDarkIcon,
  dropdown: dropdownIcon,
  dropLight: dropLightIcon,
  goldStar: goldStarIcon,
  info: infoIcon,
  orginfo: orginfoIcon,
  person: personIcon,
  personWhite: personWhiteIcon,
  refresh: refreshIcon,
  roomDrop: roomDropIcon,
  roomUp: roomUpIcon,
  search: searchIcon,
  searchWhite: searchWhiteIcon,
  star: starIcon,
  starWhite: starWhiteIcon,
  zoom: zoomIcon,
  departure: departureIcon,
  departureWhite: departureWhiteIcon,
  arrival: arrivalIcon,
  arrivalWhite: arrivalWhiteIcon,
  destination: destinationIcon,
  companyImage: companyIcon,
  resultFilter: filterIcon,
  rightArrow: rightArrowIcon,
  leftArrow: leftArrowIcon,
  viewMore: viewMoreIcon
};

export const getIcon = (iconName: string) => {
  let icon;
  try {
    icon = icons[iconName].src;
  } catch {
  }
  return icon;
};
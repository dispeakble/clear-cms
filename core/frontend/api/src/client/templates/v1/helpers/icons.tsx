import adultsIcon from "../assets/img/adults-icon.svg";
import bedroomIcon from "../assets/img/bedroom-icon.svg";
import breadcrumbIcon from "../assets/img/breadcrumb-icon.svg";
import calendarIcon from "../assets/img/calendar-icon.svg";
import checkIcon from "../assets/img/check-icon.svg";
import checkInIcon from "../assets/img/check-in-icon.svg";
import checkOutIcon from "../assets/img/check-out-icon.svg";
import checkSignGoldIcon from "../assets/img/check-sign-gold-icon.svg";
import childIcon from "../assets/img/child-icon.svg";
import closeIcon from "../assets/img/close-icon.svg";
import coldStarIcon from "../assets/img/cold-star-icon.svg";
import dropDarkIcon from "../assets/img/list-dd-dark-icon.svg";
import dropLightIcon from "../assets/img/list-dd-light-icon.svg";
import dropdownIcon from "../assets/img/dropdown-icon.svg";
import goldStarIcon from "../assets/img/gold-star-icon.svg";
import infantIcon from "../assets/img/infant-icon.svg";
import infoIcon from "../assets/img/info-icon.svg";
import orginfoIcon from "../assets/img/orginfo-icon.svg";
import personIcon from "../assets/img/person-icon.svg";
import refreshIcon from "../assets/img/refresh-icon.svg";
import roomDropIcon from "../assets/img/roomDrop-icon.svg";
import roomUpIcon from "../assets/img/roomUp-icon.svg";
import searchIcon from "../assets/img/search-icon.svg";
import searchWhiteIcon from "../assets/img/search-white-icon.svg";
import zoomIcon from "../assets/img/zoom-icon.svg";
import departureIcon from "../assets/img/departure-icon.svg";
import arrivalIcon from "../assets/img/arrival-icon.svg";
import destinationIcon from '../assets/img/destination-icon.svg'
import companyIcon from '../assets/img/company-icon.svg'
import worldMap from "../assets/img/world-map.svg";
import bookingDetailBg from "../assets/img/booking-detailbg.png";
import quoteUp from "../assets/img/quote-up.svg";
import quoteDown from "../assets/img/quote-down.svg";
import starIcon from "../assets/img/star-icon.svg";
import calendarCheckIcon from "../assets/img/calendar-check-icon.svg";
import uncheckIcon from "../assets/img/uncheck.svg"
import filterIcon from "../assets/img/filter-icon.svg"

const icons: Record<string, any> = {
  uncheck: uncheckIcon,
  calendarCheckIcon: calendarCheckIcon,
  quoteUp: quoteUp,
  quoteDown: quoteDown,
  worldMap: worldMap,
  bookingDetailBg: bookingDetailBg,
  adults: adultsIcon,
  bedroom: bedroomIcon,
  breadcrumb: breadcrumbIcon,
  calendar: calendarIcon,
  check: checkIcon,
  checkIn: checkInIcon,
  checkOut: checkOutIcon,
  checkSignGold: checkSignGoldIcon,
  child: childIcon,
  close: closeIcon,
  coldStar: coldStarIcon,
  dropDark: dropDarkIcon,
  dropdown: dropdownIcon,
  dropLight: dropLightIcon,
  goldStar: goldStarIcon,
  infant: infantIcon,
  info: infoIcon,
  orginfo: orginfoIcon,
  person: personIcon,
  refresh: refreshIcon,
  roomDrop: roomDropIcon,
  roomUp: roomUpIcon,
  search: searchIcon,
  searchWhite: searchWhiteIcon,
  star: starIcon,
  zoom: zoomIcon,
  departure: departureIcon,
  arrival: arrivalIcon,
  destination: destinationIcon,
  companyImage: companyIcon,
  resultFilter: filterIcon
}

export const getIcon = (iconName: string) => {
  let icon;
  try {
    icon = icons[iconName].src;
  } catch {
  }
  return icon;
}
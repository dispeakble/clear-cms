import bedroomIcon from "../assets/img/bedroom-icon.svg";
import breadcrumbIcon from "../assets/img/breadcrumb-icon.svg";
import calenderIcon from "../assets/img/calender-icon.svg";
import checkIcon from "../assets/img/check-icon.svg";
import checkInIcon from "../assets/img/check-in-icon.svg";
import checkOutIcon from "../assets/img/check-out-icon.svg";
import checkSignGoldIcon from "../assets/img/check-sign-gold-icon.svg";
import childIcon from "../assets/img/child-icon.svg";
import closeIcon from "../assets/img/close-icon.svg";
import coldStarIcon from "../assets/img/cold-star-icon.svg";
import dropDarkIcon from "../assets/img/dropDark-icon.svg";
import dropdownIcon from "../assets/img/dropdown-icon.svg";
import dropLightIcon from "../assets/img/dropLight-icon.svg";
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
import starIcon from "../assets/img/star-icon.svg";
import zoomIcon from "../assets/img/zoom-icon.svg";

const icons: Record<string, any> = {
  bedroom: bedroomIcon,
  breadcrumb: breadcrumbIcon,
  calender: calenderIcon,
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
}

export const getIcon = (iconName: string) => {
  return icons[iconName].src;
}
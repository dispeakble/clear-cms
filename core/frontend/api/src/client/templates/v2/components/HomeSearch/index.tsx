import { useTranslations } from "next-intl";
import person from "../../assets/img/person-icon.svg";
import child from "../../assets/img/child-icon.svg";
import infant from "../../assets/img/infant-icon.svg";
import star from "../../assets/img/star-icon.svg";
import {
  CalendarContainer,
  Overlay,
  StyledCenterLabel,
  StyledCheckIn,
  StyledCheckOut,
  StyledChild,
  StyledHomeSearch,
  StyledInfant,
  StyledLabel,
  StyledPerson,
  StyledPrimaryValue, StyledSearchButton,
  StyledSearchCheckinGroup,
  StyledSearchInput, StyledSearchInputHolder,
  StyledSearchOptions,
  StyledSearchOptionsGroup,
  StyledSearchTab,
  StyledSearchTabs,
  StyledStars,
  SearchLabel,
  StyledValue
} from "./styled";
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Calendar from "react-calendar";
import ValuePopup from "./valuePopup";

const HomeSearch = () => {
  const router = useRouter();
  const t = useTranslations();

  const destinationRef = useRef(null);

  const [checkInCalendarIsOpen, setCheckInCalendarIsOpen] = useState(false);
  const [checkOutCalendarIsOpen, setCheckOutCalendarIsOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [filterValues, setFilterValues] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    stars: 4
  });
  const [guestIsOpen, setGuestsIsOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [showFilter, setShowFilter] = useState({
    adults: false,
    children: false,
    infants: false,
    category: false,
  } as Record<string, boolean>);

  const handleDestination = (e: any) => {
    e.preventDefault();
    setDestination(e.target.value);
  };

  const onCheckInChange = (date: any) => {
    setCheckInDate(date);
    setCheckInCalendarIsOpen(false);
  };

  const onCheckOutChange = (date: any) => {
    setCheckOutDate(date);
    setCheckOutCalendarIsOpen(false);
  };

  const formatDate = (date: any) => {
    return Intl.DateTimeFormat(router.locale, {
      month: "short",
      day: "2-digit",
      year: "2-digit"
    }).format(date);
  };

  const openCheckInCalendar = (e: any) => {
    if (e.currentTarget === e.target) {
      setCheckOutCalendarIsOpen(false);
      setGuestsIsOpen(false);
      setCheckInCalendarIsOpen(!checkInCalendarIsOpen);
    }
  };

  const openCheckOutCalendar = (e: any) => {
    if (e.currentTarget === e.target) {
      setCheckInCalendarIsOpen(false);
      setGuestsIsOpen(false);
      setCheckOutCalendarIsOpen(!checkOutCalendarIsOpen);
    }
  };

  const handleFilterChange = (value: Record<string, number>) => {
    setFilterValues((prevState => ({...prevState, ...value})))
  }

  const guestsCount = () => {
    return filterValues.children + filterValues.adults + filterValues.infants;
  };

  const searchSubmitHandler = (e: any) => {
    e.preventDefault();

    if (destination.length === 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      destinationRef.current.focus();
    }

    if (!checkInDate) {
      setCheckInCalendarIsOpen(true);
    }

    if (checkInDate && !checkOutDate) {
      setCheckInCalendarIsOpen(false);
      setCheckOutCalendarIsOpen(true);
    }

    if (destination.length > 0
      && checkInDate
      && checkOutDate
      && guestsCount() > 0) {
      router.push({
        pathname: `/agency/search/
${destination}/
${formatDate(checkInDate)}/
${formatDate(checkOutDate)}/
${filterValues.adults}/
${filterValues.children}/
${filterValues.infants}/
${filterValues.stars}`
      });
    }
  };

  const closeModals = () => {
    setCheckInCalendarIsOpen(false);
    setCheckOutCalendarIsOpen(false);
    closeFilters();
  };

  const toggleFilters = (type: string, force: boolean) => {
    setShowFilter(prevState => {
      Object.keys(prevState).map(key => {
        prevState[key] = false;
      });
      prevState[type] = force;
      return {...prevState};
    })
  }

  const closeFilters = () => {
    Object.keys(showFilter).map(key => {
      showFilter[key] = false;
    });
    setShowFilter({...showFilter});
  }

  return <StyledHomeSearch>
    <StyledSearchTabs>
      <StyledSearchTab className="selected">{t("search.packages")}</StyledSearchTab>
      <StyledSearchTab>{t("search.hotels")}</StyledSearchTab>
      <StyledSearchTab>{t("search.flights")}</StyledSearchTab>
    </StyledSearchTabs>
    <StyledSearchInputHolder>
      <StyledSearchInput
        ref={destinationRef}
        placeholder={t("search.homeSearchPlaceholder")}
        value={destination}
        onChange={handleDestination} />
      <StyledSearchButton onClick={searchSubmitHandler}>{t("search.searchButton")}</StyledSearchButton>
    </StyledSearchInputHolder>
    <StyledSearchOptions>
      <StyledSearchCheckinGroup>
        <StyledCheckIn onClick={openCheckInCalendar}>
          <StyledLabel>{t("search.checkinDate")}</StyledLabel>
          <StyledValue>{
            checkInDate !== null ?
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              formatDate(checkInDate)
              : t("search.addDate")
          }</StyledValue>
          {
            checkInCalendarIsOpen &&
            <>
              <CalendarContainer id="checkIn">
                <SearchLabel>{t("search.checkinDate")}</SearchLabel>
                <Calendar
                  onChange={onCheckInChange}
                  value={checkInDate}
                  minDate={new Date()}
                />
              </CalendarContainer>
            </>
          }
        </StyledCheckIn>
        <StyledCheckOut onClick={openCheckOutCalendar}>
          <StyledLabel>{t("search.checkout")}</StyledLabel>
          <StyledValue>{
            checkOutDate !== null ?
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              formatDate(checkOutDate)
              : t("search.addDate")
          }</StyledValue>
          {
            checkOutCalendarIsOpen &&
            <>
              <CalendarContainer id="checkOut">
                <SearchLabel>{t("search.checkoutDate")}</SearchLabel>
                <Calendar
                  onChange={onCheckOutChange}
                  value={checkOutDate}
                  minDate={checkInDate as unknown as Date}
                />
              </CalendarContainer>
            </>
          }
        </StyledCheckOut>
      </StyledSearchCheckinGroup>
      <StyledSearchOptionsGroup>
        <StyledPerson onClick={() => toggleFilters('adults', true)}>
          <StyledCenterLabel>
            <StyledLabel><Image src={person.src} width={10} height={22}/>{t("search.adults")}</StyledLabel>
            <StyledPrimaryValue>{filterValues.adults}</StyledPrimaryValue>
          </StyledCenterLabel>
          { showFilter.adults && <ValuePopup name="adults" value={filterValues.adults} min={1} max={11} onChange={handleFilterChange} /> }
        </StyledPerson>
        <StyledChild onClick={() => toggleFilters('children', true)}>
          <StyledCenterLabel>
            <StyledLabel><Image src={child.src} width={18} height={18}/>{t("search.children")}</StyledLabel>
            <StyledPrimaryValue>{filterValues.children}</StyledPrimaryValue>
          </StyledCenterLabel>
          { showFilter.children && <ValuePopup name="children" value={filterValues.children} min={0} max={11} onChange={handleFilterChange} /> }
        </StyledChild>
        <StyledInfant onClick={() => toggleFilters('infants', true)}>
          <StyledCenterLabel>
            <StyledLabel><Image src={infant.src} width={13} height={18}/>{t("search.infants")}</StyledLabel>
            <StyledPrimaryValue>{filterValues.infants}</StyledPrimaryValue>
          </StyledCenterLabel>
          { showFilter.infants && <ValuePopup name="infants" value={filterValues.infants} min={0} max={11} onChange={handleFilterChange} /> }
        </StyledInfant>
        <StyledStars onClick={() => toggleFilters('stars', true)}>
          <StyledCenterLabel>
            <StyledLabel><Image src={star.src} width={14} height={13}/>{t("search.hotel-stars")}</StyledLabel>
            <StyledPrimaryValue>{filterValues.stars}</StyledPrimaryValue>
          </StyledCenterLabel>
          { showFilter.stars && <ValuePopup name="stars" value={filterValues.stars} min={1} max={5} onChange={handleFilterChange} /> }
        </StyledStars>
      </StyledSearchOptionsGroup>
    </StyledSearchOptions>
    { (
      showFilter.adults
      || showFilter.children
      || showFilter.infants
      || showFilter.stars
      || checkInCalendarIsOpen
      || checkOutCalendarIsOpen
    ) && <Overlay onClick={closeModals} />}
  </StyledHomeSearch>;
};

export default HomeSearch;
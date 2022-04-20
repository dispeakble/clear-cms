import {
  CalendarContainer,
  Overlay,
  SearchLabel,
  StyledCenterLabel,
  StyledCheckIn,
  StyledCheckOut,
  StyledChild,
  StyledFilterWrapper,
  StyledLabel,
  StyledPerson,
  StyledPrimaryValue,
  StyledSearchButton,
  StyledSearchCheckinGroup,
  StyledSearchDestinationInput,
  StyledSearchInputHolder,
  StyledSearchOptions,
  StyledSearchOptionsGroup,
  StyledStars,
  StyledValue
} from "../styled";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import Calendar from "react-calendar";
import person from "../../../assets/img/person-icon.svg";
import child from "../../../assets/img/child-icon.svg";
import star from "../../../assets/img/star-icon.svg";
import Image from "next/image";
import ValuePopup from "../valuePopup";
import { useRouter } from "next/router";

export const Hotels = () => {
  const router = useRouter();
  const t = useTranslations();
  const destinationRef = useRef(null);
  const [destination, setDestination] = useState("");
  const [checkInCalendarIsOpen, setCheckInCalendarIsOpen] = useState(false);
  const [checkOutCalendarIsOpen, setCheckOutCalendarIsOpen] = useState(false);
  const [showFilter, setShowFilter] = useState("");
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [filterValues, setFilterValues] = useState({
    adults: 1,
    children: 0,
    stars: 4
  });

  const handleDestination = (e: any) => {
    e.preventDefault();
    setDestination(e.target.value);
  };

  const closeModals = () => {
    setCheckInCalendarIsOpen(false);
    setCheckOutCalendarIsOpen(false);
    closeFilters();
  };

  const closeFilters = () => {
    setShowFilter("");
  };

  const openCheckInCalendar = (e: any) => {
    if (e.currentTarget === e.target) {
      setCheckOutCalendarIsOpen(false);
      setCheckInCalendarIsOpen(true);
    }
  };

  const openCheckOutCalendar = (e: any) => {
    if (e.currentTarget === e.target) {
      setCheckInCalendarIsOpen(false);
      setCheckOutCalendarIsOpen(true);
    }
  };

  const formatDate = (date: any) => {
    return Intl.DateTimeFormat(router.locale, {
      month: "short",
      day: "2-digit",
      year: "2-digit"
    }).format(date);
  };

  const guestsCount = () => {
    return filterValues.children + filterValues.adults;
  };

  const onCheckInChange = (date: any) => {
    setCheckInDate(date);
    setCheckInCalendarIsOpen(false);
    setCheckOutCalendarIsOpen(true);
  };

  const onCheckOutChange = (date: any) => {
    setCheckOutDate(date);
    setCheckOutCalendarIsOpen(false);
  };

  const toggleFilters = (type: string) => {
    setShowFilter(type)
  };

  const handleFilterChange = (value: Record<string, number>) => {
    setFilterValues((prevState => ({...prevState, ...value})))
  };

  const focusElement = (elem: any) => {
    elem.current.focus();
  }

  const searchSubmitHandler = (e: any) => {
    e.preventDefault();

    if (destination.length === 0) {
      focusElement(destinationRef)
    }

    if (!checkInDate) {
      setCheckInCalendarIsOpen(true);
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
${filterValues.stars}`
      });
    }
  };

  return (<>
      <StyledSearchInputHolder>
        <StyledSearchDestinationInput
          data-testid="test-destination-search-input"
          ref={destinationRef}
          placeholder={t("search.homeSearchHotelDestinationPlaceholder")}
          value={destination}
          onChange={handleDestination} />
      </StyledSearchInputHolder>
      <StyledFilterWrapper>
        <StyledSearchOptions>
          <StyledSearchCheckinGroup>
            <StyledCheckIn onClick={openCheckInCalendar} data-testid="test-checkIn-button">
              <StyledLabel>{t("search.checkinDate")}</StyledLabel>
              <StyledValue data-testid="test-checkIn-date-value">{
                checkInDate !== null ? formatDate(checkInDate) : t("search.addDate")
              }</StyledValue>
              {
                checkInCalendarIsOpen &&
                <>
                  <CalendarContainer id="checkIn" data-testid="test-checkIn-calendar">
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
            <StyledCheckOut onClick={openCheckOutCalendar} data-testid="test-checkOut-button">
              <StyledLabel>{t("search.checkout")}</StyledLabel>
              <StyledValue data-testid="test-checkOut-date-value">{
                checkOutDate !== null ? formatDate(checkOutDate) : t("search.addDate")
              }</StyledValue>
              {
                checkOutCalendarIsOpen &&
                <>
                  <CalendarContainer id="checkOut" data-testid="test-checkOut-calendar">
                    <SearchLabel>{t("search.checkoutDate")}</SearchLabel>
                    <Calendar
                      className="react-calendar checkIn-picker"
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
            <StyledPerson onClick={() => toggleFilters("adults")} data-testid="test-open-adults-handler">
              <StyledCenterLabel>
                <StyledLabel>{t("search.adults")}</StyledLabel>
                <StyledPrimaryValue>{filterValues.adults}</StyledPrimaryValue>
              </StyledCenterLabel>
              {showFilter === "adults" &&
                <ValuePopup dataTestId="test-adults-handler" name="adults" value={filterValues.adults} min={1} max={11}
                            onChange={handleFilterChange} />}
            </StyledPerson>
            <StyledChild onClick={() => toggleFilters("children")} data-testid="test-open-children-handler">
              <StyledCenterLabel>
                <StyledLabel>{t("search.children")}</StyledLabel>
                <StyledPrimaryValue>{filterValues.children}</StyledPrimaryValue>
              </StyledCenterLabel>
              {showFilter === "children" &&
                <ValuePopup dataTestId="test-children-handler" name="children" value={filterValues.children} min={0}
                            max={11} onChange={handleFilterChange} />}
            </StyledChild>
            <StyledStars onClick={() => toggleFilters("stars")} data-testid="test-open-stars-handler">
              <StyledCenterLabel>
                <StyledLabel>{t("search.hotel-stars")}</StyledLabel>
                <StyledPrimaryValue>{filterValues.stars}</StyledPrimaryValue>
              </StyledCenterLabel>
              {showFilter === "stars" &&
                <ValuePopup dataTestId="test-stars-handler" name="stars" value={filterValues.stars} min={1} max={5}
                            onChange={handleFilterChange} />}
            </StyledStars>
          </StyledSearchOptionsGroup>
          <StyledSearchButton onClick={searchSubmitHandler} data-testid="search-submit-btn">{t("search.searchHotelsButton")}</StyledSearchButton>
        </StyledSearchOptions>
      </StyledFilterWrapper>
      {(
        showFilter.length
        || checkInCalendarIsOpen
        || checkOutCalendarIsOpen
      ) && <Overlay data-testid="home-search-overlay" onClick={closeModals} />}
    </>
  );
};
import {
  AutocompleteItem,
  AutocompleteList,
  CalendarContainer,
  Overlay,
  StyledCenterLabel,
  StyledCheckIn,
  StyledCheckOut,
  StyledChildFilter,
  StyledFilterWrapper,
  StyledLabel,
  StyledPersonFilter,
  StyledPrimaryValue,
  StyledSearchButton,
  StyledSearchCheckinGroup,
  StyledSearchHotelInput,
  StyledSearchInputHolder,
  StyledSearchOptions,
  StyledSearchOptionsGroup,
  StyledSearchSecondGroup,
  StyledStarsFilter,
  StyledValue
} from "../styled";
import { useTranslations } from "next-intl";
import React, { MutableRefObject, useCallback, useRef, useState } from "react";
import Calendar from "react-calendar";
import ValuePopup from "../valuePopup";
import { useRouter } from "next/router";
import useWsContext from "../../../../../context/SocketContext";
import debounce from "lodash/debounce";
import ValuePopupAges from "../valuePopupAges";

export const Hotels = () => {
  const router = useRouter();
  const t = useTranslations();

  const destinationRef = useRef() as MutableRefObject<HTMLInputElement>;

  const [destinationList, setDestinationList] = useState<Record<string, string>[]>([]);
  const [showDestinations, setShowDestinations] = useState(false);

  const { ws } = useWsContext();

  const [destination, setDestination] = useState("");
  const [destinationId, setDestinationId] = useState(0);
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);
  const [currentPopup, setCurrentPopup] = useState("");
  const [popupCss, setPopupCss] = useState<Record<string, number>>({});
  const [minCheckInDate] = useState(new Date());
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [filterValues, setFilterValues] = useState({
    adults: 1,
    children: 0,
    stars: 4,
    childrenAges: []
  });

  const searchDestinationByName = useCallback(async (value: string) => {
    const response = await ws.sendMessage({
      api: "homeSearchHotels",
      act: "hotels",
      payload: {
        type: "destination",
        data: {
          name: value
        }
      }
    });
    if (response && response.destination && response.destination.length) {
      setDestinationList(response.destination);
      setShowDestinations(true);
    } else {
      setDestinationList([]);
      setShowDestinations(false);
    }
    return null;
  }, [ws, setDestinationList, setShowDestinations]);

  const debouncedDestinationSearch = useCallback(debounce(searchDestinationByName, 500), []);

  const handleDestination = useCallback(async (e: any) => {
    if (e.id) {
      setDestination(e.name);
      setDestinationList([]);
      setShowDestinations(false);
      setDestinationId(e.id);
    } else {
      e.preventDefault();
      setDestination(e.target.value);
      if (e.target.value.length > 2) {
        debouncedDestinationSearch(e.target.value);
      }
    }
  }, [setDestination, setDestinationList, setShowDestinations, setDestinationId]);

  const closeModals = () => {
    setCalendarIsOpen(false);
    closeFilters();
    setShowDestinations(false);
  };

  const closeFilters = () => {
    setCurrentPopup("");
  };

  const openCalendar = (e: any) => {
    if (e.currentTarget === e.target) {
      setCalendarIsOpen(true);
    }
  };

  const formatDate = (date: any) => {
    return Intl.DateTimeFormat(router.locale, {
      month: "short",
      day: "2-digit",
      year: "2-digit"
    }).format(date);
  };

  const formatDateSearch = (date: any) => {
    return Intl.DateTimeFormat("ro", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit"
    }).format(date);
  };

  const onDateChange = (dates: any[]) => {
    setCheckInDate(dates[0]);
    setCheckOutDate(dates[1]);
    closeModals();
  };

  const toggleFilters = (evt: React.MouseEvent, type: string) => {
    const boundaries = evt.currentTarget.getBoundingClientRect();
    setPopupCss({
      left: Math.floor(boundaries.left) - 10,
      top: Math.floor(boundaries.top + 22 + boundaries.height),
      width: Math.floor(boundaries.width) + 10
    });
    setCurrentPopup(type);
  };

  const handleFilterChange = (value: Record<string, number[] | number>) => {
    setFilterValues(prevState => {
      return { ...prevState, ...value };
    });
  };

  const focusElement = (elem: any) => {
    elem.current.focus();
  };

  const searchSubmitHandler = (e: any) => {
    e.preventDefault();

    if (destination.length === 0) {
      focusElement(destinationRef);
    } else if (formatDate(checkInDate) === formatDate(checkOutDate)) {
      setCalendarIsOpen(true);
    }

    if (destination.length > 0
      && checkInDate
      && checkOutDate
      && formatDate(checkInDate) !== formatDate(checkOutDate)) {
      router.push({
        pathname: `/hotels/search/
          ${destination}/
          from-${formatDateSearch(checkInDate)}/
          to-${formatDateSearch(checkOutDate)}/
          adults-${filterValues.adults}/
          children-${filterValues.children}`
      });
    }
  };

  return (<>
      <StyledSearchInputHolder className="hotelsSearchForm">
        <StyledSearchHotelInput
          className="singleInput"
          ref={destinationRef}
          data-testid="test-destination-search-input"
          placeholder={t("search.homeSearchHotelDestinationPlaceholder")}
          value={destination}
          onChange={handleDestination} />
        {showDestinations && <AutocompleteList
          data-testid="test-autocomplete-list"
          className="destination">
          {destinationList.map(
            (dest, i) =>
              <AutocompleteItem
                onClick={() => handleDestination({ id: dest.Id, name: dest.Name })}
                key={i}>{dest.IntName} ({dest.Name})</AutocompleteItem>
          )}
        </AutocompleteList>}
      </StyledSearchInputHolder>
      <StyledFilterWrapper>
        <StyledSearchOptions>
          <StyledSearchOptionsGroup>
            <StyledStarsFilter>
              <StyledCenterLabel data-testid="test-open-stars-handler" onClick={(evt) => toggleFilters(evt, "stars")}>
                <StyledLabel>{t("search.hotel-stars")}</StyledLabel>
                <StyledPrimaryValue>{filterValues.stars}</StyledPrimaryValue>
              </StyledCenterLabel>
            </StyledStarsFilter>
            <StyledPersonFilter>
              <StyledCenterLabel data-testid="test-open-adults-handler" onClick={(evt) => toggleFilters(evt, "adults")}>
                <StyledLabel>{t("search.adults")}</StyledLabel>
                <StyledPrimaryValue>{filterValues.adults}</StyledPrimaryValue>
              </StyledCenterLabel>
            </StyledPersonFilter>
            <StyledChildFilter>
              <StyledCenterLabel data-testid="test-open-children-handler"
                                 onClick={(evt) => toggleFilters(evt, "children")}>
                <StyledLabel>{t("search.children")}</StyledLabel>
                <StyledPrimaryValue>{filterValues.children}</StyledPrimaryValue>
              </StyledCenterLabel>
            </StyledChildFilter>
          </StyledSearchOptionsGroup>
          <StyledSearchSecondGroup>
            <StyledSearchCheckinGroup>
              <StyledCheckIn onClick={openCalendar} data-testid="test-checkIn-button">
                <StyledLabel>{t("search.checkinDate")}</StyledLabel>
                <StyledValue data-testid="test-checkIn-date-value">{
                  checkInDate !== null ? formatDate(checkInDate) : t("search.addDate")
                }</StyledValue>
              </StyledCheckIn>
              <StyledCheckOut onClick={openCalendar} data-testid="test-checkOut-button">
                <StyledLabel>{t("search.checkout")}</StyledLabel>
                <StyledValue data-testid="test-checkOut-date-value">{
                  checkOutDate !== null ? formatDate(checkOutDate) : t("search.addDate")
                }</StyledValue>
              </StyledCheckOut>
              {
                calendarIsOpen &&
                <>
                  <CalendarContainer data-testid="test-calendar">
                    <Calendar
                      formatMonthYear={(locale, date) => formatDate(date)}
                      view="month"
                      showDoubleView={true}
                      selectRange={true}
                      onChange={onDateChange}
                      value={[checkInDate, checkOutDate]}
                      minDate={minCheckInDate}
                      returnValue="range"
                    />
                  </CalendarContainer>
                </>
              }
            </StyledSearchCheckinGroup>
            <StyledSearchButton onClick={searchSubmitHandler}
                                data-testid="search-submit-btn">{t("global.search")}</StyledSearchButton>
          </StyledSearchSecondGroup>
        </StyledSearchOptions>
      </StyledFilterWrapper>
      {(
        currentPopup.length
        || calendarIsOpen
        || showDestinations
      ) && <Overlay data-testid="home-search-overlay" onClick={closeModals} />}
      {currentPopup === "stars" &&
        <ValuePopup style={popupCss} dataTestId="test-stars-handler" name="stars" value={filterValues.stars} min={1}
                    max={5}
                    onChange={handleFilterChange} />}
      {currentPopup === "adults" &&
        <ValuePopup style={popupCss} dataTestId="test-adults-handler" name="adults" value={filterValues.adults} min={1}
                    max={9 - filterValues.children}
                    onChange={handleFilterChange} />}
      {currentPopup === "children" ?
        <div><ValuePopup style={popupCss} dataTestId="test-children-handler" name="children"
                         value={filterValues.children} min={0}
                         max={4} onChange={handleFilterChange} />

          {filterValues.children > 0 && <ValuePopupAges
            style={{ ...popupCss, ...{ top: popupCss.top + 50 } }}
            className="childrenAges"
            name="childrenAges"
            min={0}
            max={12}
            count={filterValues.children}
            data={filterValues.childrenAges}
            dataTestId="test-children-ages-handler"
            onChange={handleFilterChange} />}
        </div> : ""
      }
    </>
  );
};
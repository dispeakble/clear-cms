import {
  AutocompleteItem,
  AutocompleteList,
  CalendarContainer,
  Overlay,
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
import { MutableRefObject, useCallback, useRef, useState } from "react";
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

  const [destinationList, setDestinationList] = useState<any[]>([]);
  const [showDestinations, setShowDestinations] = useState(false);

  const { ws } = useWsContext();

  const [destination, setDestination] = useState("");
  const [destinationId, setDestinationId] = useState(0);
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);
  const [showFilter, setShowFilter] = useState("");
  const [minCheckInDate] = useState(new Date());
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [filterValues, setFilterValues] = useState({
    adults: 1,
    children: 0,
    stars: 4,
    childrenAges: []
  });

  const searchDestinationByName = async (value: string) => {
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
  };

  const debouncedDestinationSearch = useCallback(debounce(searchDestinationByName, 500), []);

  const handleDestination = async (e: any) => {
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
  };

  const closeModals = () => {
    setCalendarIsOpen(false);
    closeFilters();
    setShowDestinations(false);
  };

  const closeFilters = () => {
    setShowFilter("");
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
    return Intl.DateTimeFormat('ro', {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit"
    }).format(date);
  };

  const guestsCount = () => {
    return filterValues.children + filterValues.adults;
  };

  const onDateChange = (dates: any[]) => {
    setCheckInDate(dates[0]);
    setCheckOutDate(dates[1]);
    closeModals();
  };

  const toggleFilters = (type: string) => {
    setShowFilter(type);
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
    } else if (!checkInDate) {
      setCalendarIsOpen(true);
    }

    if (destination.length > 0
      && checkInDate
      && checkOutDate
      && guestsCount() > 0) {
      router.push({
        pathname: `/hotels/search/
${destination}/
from-${formatDateSearch(checkInDate)}/
to-${formatDateSearch(checkOutDate)}/
adults-${filterValues.adults}/
children-${filterValues.children}/
category-${filterValues.stars}`
      });
    }
  };

  return (<>
      <StyledSearchInputHolder className="flights">
        <StyledSearchDestinationInput
          className="singleInput"
          ref={destinationRef}
          data-testid="test-destination-search-input"
          placeholder={t("search.homeSearchHotelDestinationPlaceholder")}
          value={destination}
          onChange={handleDestination} />
        {showDestinations && <AutocompleteList className="destination">
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
                    formatYear={(locale, date) => formatDate(date)}
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

          <StyledSearchOptionsGroup>
            <StyledStars>
              <StyledCenterLabel data-testid="test-open-stars-handler" onClick={() => toggleFilters("stars")}>
                <StyledLabel>{t("search.hotel-stars")}</StyledLabel>
                <StyledPrimaryValue>{filterValues.stars}</StyledPrimaryValue>
              </StyledCenterLabel>
              {showFilter === "stars" &&
                <ValuePopup dataTestId="test-stars-handler" name="stars" value={filterValues.stars} min={1} max={5}
                            onChange={handleFilterChange} />}
            </StyledStars>
            <StyledPerson>
              <StyledCenterLabel data-testid="test-open-adults-handler" onClick={() => toggleFilters("adults")}>
                <StyledLabel>{t("search.adults")}</StyledLabel>
                <StyledPrimaryValue>{filterValues.adults}</StyledPrimaryValue>
              </StyledCenterLabel>
              {showFilter === "adults" &&
                <ValuePopup dataTestId="test-adults-handler" name="adults" value={filterValues.adults} min={1} max={9}
                            onChange={handleFilterChange} />}
            </StyledPerson>
            <StyledChild>
              <StyledCenterLabel  data-testid="test-open-children-handler" onClick={() => toggleFilters("children")}>
                <StyledLabel>{t("search.children")}</StyledLabel>
                <StyledPrimaryValue>{filterValues.children}</StyledPrimaryValue>
              </StyledCenterLabel>
              {showFilter === "children" &&
                <><ValuePopup dataTestId="test-children-handler" name="children" value={filterValues.children} min={0}
                              max={4} onChange={handleFilterChange} />

                  { filterValues.children > 0 && <ValuePopupAges
                    className="childrenAges"
                    name="childrenAges"
                    min={0}
                    max={17}
                    count={filterValues.children}
                    data={filterValues.childrenAges}
                    dataTestId="test-children-ages-handler"
                    onChange={handleFilterChange}/> }
                </>

              }
            </StyledChild>
          </StyledSearchOptionsGroup>
          <StyledSearchButton onClick={searchSubmitHandler}
                              data-testid="search-submit-btn">{t("search.searchPackagesButton")}</StyledSearchButton>
        </StyledSearchOptions>
      </StyledFilterWrapper>
      {(
        showFilter.length
        || calendarIsOpen
        || showDestinations
      ) && <Overlay data-testid="home-search-overlay" onClick={closeModals} />}
    </>
  );
};
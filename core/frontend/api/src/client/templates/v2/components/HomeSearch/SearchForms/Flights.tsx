import {
  AutocompleteItem,
  AutocompleteList,
  CalendarContainer,
  Overlay,
  SearchLabel,
  StyledCenterLabel,
  StyledCheckIn,
  StyledCheckOut,
  StyledChild,
  StyledFilterWrapper,
  StyledLabel, StyledOneWay,
  StyledPerson,
  StyledPrimaryValue,
  StyledSearchButton,
  StyledSearchCheckinGroup,
  StyledSearchDestinationInput,
  StyledSearchInput,
  StyledSearchInputHolder,
  StyledSearchOptions,
  StyledSearchOptionsGroup,
  StyledValue
} from "../styled";
import { useTranslations } from "next-intl";
import {useCallback, useRef, useState} from "react";
import Calendar from "react-calendar";
import person from "../../../assets/img/person-icon.svg";
import child from "../../../assets/img/child-icon.svg";
import Image from "next/image";
import ValuePopup from "../valuePopup";
import { useRouter } from "next/router";
import useWsContext from "../../../../../context/SocketContext";
import debounce from "lodash/debounce";
import ValuePopupAges from "../valuePopupAges";

export const Flights = () => {
  const router = useRouter();
  const { ws } = useWsContext();
  const t = useTranslations();
  const departureRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const [departureList, setDepartureList] = useState<any[]>([]);
  const [showDepartures, setShowDepartures] = useState(false);

  const [destinationList, setDestinationList] = useState<any[]>([]);
  const [showDestinations, setShowDestinations] = useState(false);

  const showDepartureList = async () => {


    const response = await ws.sendMessage({
      api: "homeSearchFlights",
      act: "flights",
      payload: {
        type: "init",
        data: {}
      }
    });

    if (response && response.departure) {
      setDepartureList(response.departure);
      setShowDepartures(true);
    } else {
      setDepartureList([]);
      setShowDepartures(false);
    }
  };

  const [departure, setDeparture] = useState("");
  const [departureId, setDepartureId] = useState(0);
  const [destination, setDestination] = useState("");
  const [destinationId, setDestinationId] = useState(0);
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);
  const [showFilter, setShowFilter] = useState("");
  const [minCheckInDate, setMinCheckInDate] = useState(new Date());
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [filterValues, setFilterValues] = useState({
    adults: 1,
    children: 0,
    stars: 4,
    childrenAges: []
  });
  const [oneWay, setOneWay] = useState(false);

  const searchDepartureByName = async (value: string) => {
    const response = await ws.sendMessage({
      api: "homeSearchFlights",
      act: "flights",
      payload: {
        type: "departure",
        data: {
          name: value
        }
      }
    });
    setDepartureList(response.departure);
    if (response.departure && response.departure.length) {
      setShowDepartures(true);
    } else {
      setShowDepartures(false);
    }
  }

  const searchDestinationByName = async (value: string) => {
    const response = await ws.sendMessage({
      api: "homeSearchFlights",
      act: "flights",
      payload: {
        type: "destination",
        data: {
          departure: departureId,
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

  const getStartDates = async () => {
    const response = await ws.sendMessage({
      api: "homeSearchFlights",
      act: "flights",
      payload: {
        type: "dates",
        data: {
          departure: departureId,
          destination: destinationId
        }
      }
    });
    if (response && response.dateInterval) {
      setMinCheckInDate(new Date(response.dateInterval))
    }
  }

  const debouncedDepartureSearch = useCallback(debounce(searchDepartureByName, 500), []);
  const debouncedDestinationSearch = useCallback(debounce(searchDestinationByName, 500), [departureId]);


  const handleDeparture = async (e: any) => {
    setDestination("");
    if (e.id) {
      setDeparture(e.name);
      setDepartureList([]);
      setShowDepartures(false);
      setDepartureId(e.id);
    } else {
      e.preventDefault();
      setDeparture(e.target.value);
      if (e.target.value.length > 2) {
        debouncedDepartureSearch(e.target.value);
      }
    }
  };

  const handleDestination = async (e: any) => {
    if (e.id) {
      setDestination(e.name);
      setDestinationList([]);
      setShowDestinations(false);
      setDestinationId(e.id);
      getStartDates();
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
    setShowDepartures(false);
    setShowDestinations(false);
  };

  const closeFilters = () => {
    setShowFilter("");
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

  const openCalendar = (e: any) => {
    if (e.currentTarget === e.target) {
      setCalendarIsOpen(true);
    }
  };

  const formatDateSearch = (date: any) => {
    return Intl.DateTimeFormat('ro', {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit"
    }).format(date);
  };

  const toggleFilters = (type: string) => {
    setShowFilter(type)
  };

  const onDateChange = (dates: any[]) => {
    setCheckInDate(dates[0]);
    setCheckOutDate(dates[1]);
    closeModals();
  };

  const handleFilterChange = (value: Record<string, number[] | number>) => {
    setFilterValues(prevState => {
      return { ...prevState, ...value };
    });
  };

  const focusElement = (elem: any) => {
    elem.current.focus();
  }

  const searchSubmitHandler = (e: any) => {
    e.preventDefault();

    if (destination.length === 0) {
      focusElement(departureRef);
    } else if (!checkInDate) {
      setCalendarIsOpen(true);
    }

    if (destination.length > 0
        && checkInDate
        && checkOutDate
        && guestsCount() > 0) {
      router.push({
        pathname: `/flights/search/
          ${destination}/
          from-${formatDateSearch(checkInDate)}/
          to-${formatDateSearch(checkOutDate)}/
          adults-${filterValues.adults}/
          children-${filterValues.children}`
      });
    }
  };

  return (<>
      <StyledSearchInputHolder className="flights">
        <StyledSearchInput
          data-testid="test-search-input"
          ref={departureRef}
          placeholder={t("search.homeSearchPackageDeparturePlaceholder")}
          value={departure}
          onChange={handleDeparture}
          onFocus={showDepartureList}
        />
        {showDepartures && <AutocompleteList>
          {departureList.map(
              (dep, i) =>
                  <AutocompleteItem
                      onClick={() => handleDeparture({ id: dep.Id, name: dep.Name })}
                      key={i}>{dep.IntName} ({dep.Name})</AutocompleteItem>
          )}
        </AutocompleteList>}
        <StyledSearchDestinationInput
          data-testid="test-destination-search-input"
          placeholder={t("search.homeSearchPackageDestinationPlaceholder")}
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
            <StyledPerson onClick={() => toggleFilters("adults")} data-testid="test-open-adults-handler">
              <StyledCenterLabel>
                <StyledLabel>{t("search.adults")}</StyledLabel>
                <StyledPrimaryValue>{filterValues.adults}</StyledPrimaryValue>
              </StyledCenterLabel>
              {showFilter === "adults" &&
                <ValuePopup dataTestId="test-adults-handler" name="adults" value={filterValues.adults} min={1} max={11}
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
            <StyledOneWay data-testid="test-checkbox-oneway-handler">
              <StyledCenterLabel style={{height: "100%", width: "100%"}}>
                <StyledLabel>{t("search.oneway")}</StyledLabel>
                <StyledPrimaryValue><input onChange={() => setOneWay(!oneWay)} type="checkbox" checked={oneWay} /></StyledPrimaryValue>
              </StyledCenterLabel>
            </StyledOneWay>
          </StyledSearchOptionsGroup>
          <StyledSearchButton onClick={searchSubmitHandler} data-testid="search-submit-btn">{t("search.searchFlightsButton")}</StyledSearchButton>
        </StyledSearchOptions>
      </StyledFilterWrapper>
        {(
            showFilter.length
            || calendarIsOpen
            || showDepartures
            || showDestinations
        ) && <Overlay data-testid="home-search-overlay" onClick={closeModals} />}
    </>
  );
};
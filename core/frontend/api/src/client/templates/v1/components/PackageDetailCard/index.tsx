import {
  PackageDetailContainer, TitleText, FlightInformation, InputContainer,
  StyledSearchDestinationInput, AutocompleteItem, AutocompleteList, FlightTakeOffInput, DropdownIcon,
  FlightDetailsContainer, FlightPort,
  Time, TakeOffInputContainer, PassengerWrapper, Passenger, ChildIcon,
  PassengerDetailsWrapper, SpanDiv, BetweenInputs
  , BetweenInputsContainer, BookingCardContent, BookingCardPrice, StyledSearchDepartureInput
} from "./styled";

import {
  BookingDetailContainer,
  ParaTextBold,
  BookingCard,
  BookingHeadingText,
  BookingMutedText,
  BookingPriceText,
  BookingButton,
  PackageCharterContainer,
  BookingConditionsContainer,
  CustomHeading,
  QuotedPara
} from "./styled";

import React, { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import debounce from "lodash/debounce";
import useWsContext from "../../../../context/SocketContext";
import { CalenderIcon, DateDiv, HotelCalendar, HotelSearch } from "../../hotel/components/HotelDetail/styled";
import moment from "moment";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Image from "next/image";
import adultsIcon from "../../assets/img/icons/adults-icon.svg";
import placeholderLogo from "../../assets/img/icons/company-icon.svg";
import { Overlay } from "../HomeSearch/styled";
import ValuePopup from "../HomeSearch/valuePopup";
import ValuePopupAges from "../HomeSearch/valuePopupAges";
import Link from "next/link";


const PackageDetailCard = () => {
  const departureRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const t = useTranslations();

  const { ws } = useWsContext();
  const [departure, setDeparture] = useState("");
  const [showDepartures, setShowDepartures] = useState(false);
  const [departureList, setDepartureList] = useState<any[]>([]);
  const [destination, setDestination] = useState("");
  const [departureId, setDepartureId] = useState(0);
  const [showDestinations, setShowDestinations] = useState(false);
  const [destinationList, setDestinationList] = useState<any[]>([]);
  const [destinationId, setDestinationId] = useState(0);
  const [minCheckInDate, setMinCheckInDate] = useState(new Date());
  const [currentPopup, setCurrentPopup] = useState("");
  const [popupCss, setPopupCss] = useState<Record<string, any>>({});
  const [filterValues, setFilterValues] = useState({
    adults: 1,
    children: 0,
    childrenAges: []
  });

  const [data, setData] = useState({
    hotel: "",
    checkin: new Date(),
    checkout: moment(new Date()).add(1, "d"),
    passenger: {
      adults: 1,
      children: 0
    }

  });
  const [show, setShow] = useState({
    checkin: false,
    checkout: false,
    details: false
  });


  const searchDepartureByName = async (value: string) => {
    //TODO SHOW THE LIST HERE
    const response = await ws.sendMessage({
      api: "homeSearchPackages",
      act: "packages",
      payload: {
        type: "departure",
        data: {
          name: value
        }
      }
    });
  };
  const searchDestinationByName = useCallback(async (value: string) => {
    const response = await ws.sendMessage({
      api: "homeSearchPackages",
      act: "packages",
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
  }, [ws, setDestinationList, setShowDestinations]);


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

  const showDepartureList = async () => {
    const response = await ws.sendMessage({
      api: "homeSearchPackages",
      act: "packages",
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
  const getStartDates = async () => {
    const response = await ws.sendMessage({
      api: "homeSearchPackages",
      act: "packages",
      payload: {
        type: "dates",
        data: {
          departure: departureId,
          destination: destinationId
        }
      }
    });
    if (response && response.dateInterval) {
      setMinCheckInDate(new Date(response.dateInterval));
    }
  };

  const handleDestination = useCallback(async (e: any) => {
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
  }, [setDestination, setDestinationList, setShowDestinations, setDestinationId]);

  const handleClickAway = (name: string) => {
    setShow({
      ...show,
      [name]: false
    });
  };

  const handleShowCheckin = () => {
    setShow({
      ...show,
      checkin: !show.checkin
    });
  };
  const handleChangeInput = (name: string, value: any) => {
    setData({
      ...data,
      [name]: value
    });
  };
  const handleDateAway = (name: string) => {
    setShow({
      ...show,
      [name]: false
    });
  };

  const closeModals = () => {
    setCurrentPopup("");
  };

  const handleFilterChange = (value: Record<string, number[] | number>) => {
    setFilterValues(prevState => {
      return { ...prevState, ...value };
    });
  };

  const toggleFilters = (evt: React.MouseEvent, type: string) => {
    const boundaries = evt.currentTarget.getBoundingClientRect();
    setPopupCss({
      left: Math.floor(boundaries.left) + window.scrollX,
      top: Math.floor(boundaries.top + 10 + boundaries.height + window.scrollY),
      width: Math.floor(boundaries.width)
    });
    setCurrentPopup(type);
  };

  return (
    <PackageDetailContainer>
      <TitleText>{t("packageDetails.detailCard.packDetail")}</TitleText>
      <FlightInformation>
        <label>{t("packageDetails.detailCard.flightInf")}</label>
        <InputContainer>
          <FlightTakeOffInput>
            <TakeOffInputContainer>
              <StyledSearchDepartureInput
                ref={departureRef}
                placeholder={t("search.homeSearchPackageDeparturePlaceholder")}
                value={departure}
                onChange={handleDeparture}
                onFocus={showDepartureList}
              />
              <DropdownIcon />
            </TakeOffInputContainer>

            {showDepartures && <AutocompleteList>
              {departureList.map(
                (dep, i) =>
                  <AutocompleteItem
                    onClick={() => handleDeparture({ id: dep.Id, name: dep.Name })}
                    key={i}>{dep.IntName} ({dep.Name})</AutocompleteItem>
              )}
            </AutocompleteList>}
          </FlightTakeOffInput>
          <BetweenInputsContainer>
            <BetweenInputs />
          </BetweenInputsContainer>
          <FlightTakeOffInput>
            <TakeOffInputContainer>
              <StyledSearchDestinationInput
                placeholder={t("search.homeSearchPackageDestinationPlaceholder")}
                value={destination}
                onChange={handleDestination} />
            </TakeOffInputContainer>
            {showDestinations && <AutocompleteList className="destination">
              {destinationList.map(
                (dest, i) =>
                  <AutocompleteItem
                    onClick={() => handleDestination({ id: dest.Id, name: dest.Name })}
                    key={i}>{dest.IntName} ({dest.Name})</AutocompleteItem>
              )}
            </AutocompleteList>}
          </FlightTakeOffInput>
        </InputContainer>

        <label>{t("packageDetails.detailCard.flightDate")}</label>
        <InputContainer>
          <div style={{ flex: 1 }}>
            <ClickAwayListener onClickAway={() => handleClickAway("checkin")}>
              <DateDiv>
                <HotelSearch onClick={() => {
                  handleShowCheckin();
                }}>
                  <CalenderIcon />
                  <input style={{ cursor: "pointer" }}
                         value={moment(data.checkin).format("DD MMM, YYYY")} readOnly />
                  <DropdownIcon />
                </HotelSearch>
                {show.checkin ? (
                  <HotelCalendar
                    minDate={data.checkin}
                    value={data.checkin}
                    onChange={(value: any) => {
                      handleChangeInput("checkin", value);
                      handleDateAway("checkin");
                    }}
                  />
                ) : null}
              </DateDiv>
            </ClickAwayListener>
          </div>
          <BetweenInputsContainer>
            <BetweenInputs />
          </BetweenInputsContainer>
          <HotelSearch onClick={() => {
            handleShowCheckin();
          }}>
            <CalenderIcon />
            <input placeholder={t("deals.checkin")}
                   style={{ cursor: "pointer" }}
                   value={`7 ${t("global.nights")}`} readOnly />

            <DropdownIcon />
          </HotelSearch>

        </InputContainer>
        <label>{t("packageDetails.detailCard.occupants")}</label>
        <InputContainer>
          <PassengerWrapper onClick={(evt) => toggleFilters(evt, "adults")}>
            <Passenger>
              <PassengerDetailsWrapper>
                <div className="icon-and-title__wrapper">
                  <Image src={adultsIcon.src} width={9} height={22} />
                  <SpanDiv>{data?.passenger.adults} {data?.passenger.adults > 1 ? t("packageDetails.adults") : t("packageDetails.adult")}</SpanDiv>
                </div>
                <DropdownIcon />
              </PassengerDetailsWrapper>
            </Passenger>
          </PassengerWrapper>
          <BetweenInputsContainer>
            <BetweenInputs />
          </BetweenInputsContainer>
          <PassengerWrapper onClick={(evt) => toggleFilters(evt, "children")}>
            <Passenger>
              <PassengerDetailsWrapper>
                <div className="icon-and-title__wrapper">
                  <ChildIcon />
                  <SpanDiv>{filterValues.children} {filterValues.children > 1 || filterValues.children === 0 ? t("packageDetails.children") : t("packageDetails.child")}</SpanDiv>
                </div>
                <DropdownIcon />
              </PassengerDetailsWrapper>
            </Passenger>
          </PassengerWrapper>
          {(
            currentPopup.length
          ) ? <Overlay data-testid="home-search-overlay" onClick={closeModals} /> : ""}
          {currentPopup === "adults" ?
            <ValuePopup style={popupCss} dataTestId="test-adults-handler" name="adults" value={filterValues.adults} min={1}
                        max={9 - filterValues.children}
                        onChange={handleFilterChange} /> : ""}
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
        </InputContainer>

        <TitleText>{t("packageDetails.flightDetails")}</TitleText>
        <label>{t("packageDetails.flightDetailLabel", {
          flightFrom: "Henri Coanda",
          flightTo: "Tenerife",
          flightDuration: "06h 00m"
        })}</label>

        <FlightDetailsContainer>
          <FlightPort>{t("packageDetails.detailCard.henri")}<br />{t("packageDetails.detailCard.coanda")},<br />
            {t("packageDetails.detailCard.tenerife")}</FlightPort>
          <Time>
            <div className="takeOffTime">05:45</div>
            <div className="dot-before"></div>
            <div className="time-dotted"></div>
            <div>
              <img src={placeholderLogo.src} />
            </div>
            <div className="time-dotted"></div>
            <div className="dot-after"></div>
            <div className="tandingTime">11:45</div>
          </Time>
          <FlightPort>{t("packageDetails.detailCard.tenerife")}<br /> {t("packageDetails.detailCard.sur")},<br />
            {t("packageDetails.detailCard.spain")}</FlightPort>
        </FlightDetailsContainer>
        <label>{t("packageDetails.flightDetailLabel", {
          flightFrom: "Tenerife",
          flightTo: "Henri Coanda",
          flightDuration: "06h 00m"
        })}</label>
        <FlightDetailsContainer>
          <FlightPort>{t("packageDetails.detailCard.tenerife")}<br />{t("packageDetails.detailCard.sur")},<br />
            {t("packageDetails.detailCard.spain")}</FlightPort>
          <Time>
            <div className="takeOffTime">08:20</div>
            <div className="dot-before"></div>
            <div className="time-dotted"></div>
            <div>
              <img src={placeholderLogo.src} />
            </div>
            <div className="time-dotted"></div>
            <div className="dot-after"></div>
            <div className="tandingTime">14:20</div>
          </Time>
          <FlightPort>{t("packageDetails.detailCard.henri")}<br /> {t("packageDetails.detailCard.coanda")},<br />
            {t("packageDetails.detailCard.bucharest")}</FlightPort>
        </FlightDetailsContainer>
      </FlightInformation>
      <BookingDetailContainer>
        <TitleText>{t("packageDetails.detailCard.bookingDetails")}</TitleText>
        <ParaTextBold style={{ textAlign: "center" }}>{t("packageDetails.bookingDetailPara", {
          date: "Jun 16 2022",
          noOfNights: "7"
        })}</ParaTextBold>

        <BookingCard>
          <div style={{ flexBasis: "15%" }}>
            <BookingHeadingText>{t("packageDetails.detailCard.singleRoom")}</BookingHeadingText>
            <BookingHeadingText>{t("packageDetails.detailCard.b&b")}</BookingHeadingText>
          </div>
          <BookingCardContent>
            <BookingMutedText>8 {t("global.days")} / 7 {t("global.nights")}</BookingMutedText>
            <BookingMutedText>1 {t("global.adults")}, 0 {t("global.children")}</BookingMutedText>
          </BookingCardContent>
          <BookingCardPrice>
            <BookingPriceText>309€</BookingPriceText>
            <Link href={"/packages/checkout"}><BookingButton>{t("packageDetails.detailCard.bookNow")}</BookingButton></Link>
          </BookingCardPrice>
        </BookingCard>

        <BookingCard>
          <div style={{ flexBasis: "15%" }}>
            <BookingHeadingText>{t("packageDetails.detailCard.singleRoom")}</BookingHeadingText>
            <BookingHeadingText>{t("packageDetails.detailCard.allIncl")}</BookingHeadingText>
          </div>
          <BookingCardContent>
            <BookingMutedText>8 {t("global.days")} / 7 {t("global.nights")}</BookingMutedText>
            <BookingMutedText>1 {t("global.adults")}, 0 {t("global.children")}</BookingMutedText>
          </BookingCardContent>
          <BookingCardPrice>
            <BookingPriceText>409€</BookingPriceText>
            <Link href={"/packages/checkout"}><BookingButton>{t("packageDetails.detailCard.bookNow")}</BookingButton></Link>
          </BookingCardPrice>
        </BookingCard>
      </BookingDetailContainer>

      <PackageCharterContainer>
        <CustomHeading>{t("packageDetails.charterDetailHeading1", { hotelName: "Hotel Victoria" })}</CustomHeading>
        <QuotedPara>
          {t("packageDetails.charterDetailPara1")}
        </QuotedPara>
      </PackageCharterContainer>

      <BookingConditionsContainer>
        <CustomHeading>{t("packageDetails.charterDetailHeading2")}</CustomHeading>
        <QuotedPara>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Integer eu dolor efficitur, ullamcorper lectus id, consectetur purus.
            Cras consequat dapibus aliquam. Aenean hendrerit convallis ultrices.
            Praesent scelerisque orci vel arcu tincidunt, eu facilisis massa pellentesque.
            Ut facilisis sem ipsum, vitae porta enim dignissim consequat. Etiam nec placerat nibh.
            Aliquam posuere auctor lacus vitae sollicitudin.
            Quisque facilisis accumsan sapien ac efficitur. Etiam eget urna vulputate, faucibus ipsum et, imperdiet
            ipsum.
            Nam eu nunc a erat tincidunt feugiat sit amet id lacus.
            Nunc id risus vitae neque dictum eleifend eu quis felis.
          </p>

          <p>
            Vestibulum sed rutrum nunc. Ut fringilla interdum neque,
            in sagittis tellus maximus vitae. Phasellus non diam volutpat est mattis vulputate.
            Nulla non interdum purus, ut suscipit purus. Sed sit amet pulvinar nunc. Praesent porttitor,
            risus convallis scelerisque rhoncus, ex est blandit dui, id facilisis erat libero eu ex. Class
            aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris nibh
            tellus, egestas quis semper non, vulputate ac enim. Duis tempus nisl non dolor elementum varius.
            Praesent nec quam vitae elit vestibulum venenatis eget vel magna. Nulla luctus euismod faucibus.
            Aliquam ut lacus nec elit mattis ultrices vel sit amet orci. Nullam dignissim congue risus, at
            sagittis velit tempor sit amet. Cras a molestie leo, ut consequat neque. In ullamcorper auctor nisi,
            a scelerisque magna semper eu.
          </p>
        </QuotedPara>
      </BookingConditionsContainer>
    </PackageDetailContainer>
  );
};

export default PackageDetailCard;

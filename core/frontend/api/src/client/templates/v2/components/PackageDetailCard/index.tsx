import {PackageDetailContainer, TitleText, FlightInformation, InputContainer,
    StyledSearchDestinationInput, AutocompleteItem, AutocompleteList, FlightTakeOffInput, DropdownIcon,
    StyledSearchInput, ImageForCompany, FlightDetailsContainer, FlightPort,
    Time, TakeOffInputContainer, PassengerWrapper, Passenger, ChildIcon,
    CounterBtn, CounterDiv, DivView, PassengerDetailsWrapper, SpanDiv, PassengerView, BetweenInputs
,BetweenInputsContainer} from  './styled';

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
    QuotedPara,
} from './styled';

import React, {useCallback, useRef, useState} from "react";
import { useTranslations } from "next-intl";
import debounce from "lodash/debounce";
import useWsContext from "../../../../context/SocketContext";
import {CalenderIcon, DateDiv, HotelCalendar, HotelSearch} from "../../hotel/components/HotelDetail/styled";
import moment from "moment";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Image from "next/image";
import adultsIcon from "../../assets/img/adults-icon.svg";


const PackageDetailCard = () => {
    const departureRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const t = useTranslations();

    const { ws } = useWsContext();
    const [departure, setDeparture] = useState("");
    const [showDepartures, setShowDepartures] = useState(false);
    const [departureList, setDepartureList] = useState<any[]>([]);
    const [destination, setDestination] = useState("");
    const [departureId, setDepartureId] = useState(0)
    const [showDestinations, setShowDestinations] = useState(false);
    const [destinationList, setDestinationList] = useState<any[]>([]);
    const [destinationId, setDestinationId] = useState(0);
    const [minCheckInDate, setMinCheckInDate] = useState(new Date());
    const [showOccupantAdult, setShowOccupantAdult] = useState(false);
    const [showOccupantChild, setShowOccupantChild] = useState(false);

    const [data, setData] = useState({
        hotel: "",
        checkin: new Date(),
        checkout: moment(new Date()).add(1, "d"),
        passenger: {
            adults: 1,
            infants: 0,
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
        })
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
            setMinCheckInDate(new Date(response.dateInterval))
        }
    }

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
    const handleShowAdults = () => {
        setShowOccupantAdult(prevState => !prevState)
    };

    const handleAdultPlus = () => {
        setData({
            ...data,
            passenger: {
                ...data.passenger,
                adults: data.passenger.adults + 1
            }
        });

    };

    const handleAdultMinus = () => {
        if (Number(data.passenger.adults) > 0) {
            setData({
                ...data,
                passenger: {
                    ...data.passenger,
                    adults: data.passenger.adults - 1
                }
            });
        }
    };
    const handleShowChildren = () => {
        setShowOccupantChild(prevState => !prevState)
    };
    const handleChildrenPlus = () => {
        setData({
            ...data,
            passenger: {
                ...data.passenger,
                children: data.passenger.children + 1
            }
        });

    };
    const handleChildrenMinus = () => {
        if (Number(data.passenger.children) > 0) {
            setData({
                ...data,
                passenger: {
                    ...data.passenger,
                    children: data.passenger.children - 1
                }
            });
        }


    };

    return (
            <PackageDetailContainer>
                <TitleText>{t("packageDetails.detailCard.packDetail")}</TitleText>
                <FlightInformation>
                    <label>{t("packageDetails.detailCard.flightInf")}</label>
                    <InputContainer>
                        <FlightTakeOffInput>
                            <TakeOffInputContainer>
                            <StyledSearchInput
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
                                            onClick={() => handleDeparture({id: dep.Id, name: dep.Name})}
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
                        <div style={{flex: '1 0 40%', }}>

                            <ClickAwayListener onClickAway={() => handleClickAway("checkin")}>
                                <DateDiv>
                                    <HotelSearch onClick={() => {
                                        handleShowCheckin();
                                    }}>
                                        <CalenderIcon  />
                                        <input placeholder={t("deals.checkin") }
                                               onChange={() => {}}
                                               style={{cursor: 'pointer'}}
                                               value={moment(data.checkin).format("dddd, DD MMMM, YYYY")} readOnly />

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
                        <CalenderIcon  />
                        <input placeholder={t("deals.checkin") }
                               onChange={() => {}}
                               style={{cursor: 'pointer'}}
                               value={`7 ${t("global.nights")}`} readOnly />

                        <DropdownIcon />
                    </HotelSearch>

                    </InputContainer>
                    <label>{t("packageDetails.detailCard.occupants")}</label>
                    <InputContainer>
                        <PassengerWrapper>
                            <ClickAwayListener onClickAway={()=>setShowOccupantAdult(false)}>
                            <DivView>
                                <Passenger onClick={()=>handleShowAdults()}>
                                    <PassengerDetailsWrapper>
                                        <div className="icon-and-title__wrapper">
                                        <Image src={adultsIcon.src} width={9} height={22}/>
                                        <SpanDiv>{data?.passenger.adults} {t("packageDetails.adult")}</SpanDiv>
                                        </div>
                                        <DropdownIcon/>
                                    </PassengerDetailsWrapper>
                                </Passenger>
                                {showOccupantAdult  ? (
                                    <PassengerView>
                                        <CounterDiv>
                                            <CounterBtn onClick={handleAdultMinus}>
                                                -
                                            </CounterBtn>
                                            <div>{data?.passenger.adults}</div>
                                            <CounterBtn onClick={handleAdultPlus}>
                                                +
                                            </CounterBtn>


                                        </CounterDiv>
                                    </PassengerView>
                                ) : null}
                            </DivView>
                            </ClickAwayListener>
                        </PassengerWrapper>
                        <BetweenInputsContainer>
                            <BetweenInputs />
                        </BetweenInputsContainer>
                        <PassengerWrapper>
                            <ClickAwayListener onClickAway={()=>setShowOccupantChild(false)}>
                            <DivView>
                                <Passenger>
                                    <PassengerDetailsWrapper onClick={()=>handleShowChildren()}>
                                        <div className="icon-and-title__wrapper">
                                        <ChildIcon/>
                                        <SpanDiv>{data?.passenger.children} {t("packageDetails.children")}</SpanDiv>
                                        </div>
                                        <DropdownIcon/>
                                    </PassengerDetailsWrapper>
                                </Passenger>
                                {showOccupantChild ? (
                                    <PassengerView>
                                        <CounterDiv>
                                            <CounterBtn onClick={handleChildrenMinus}>
                                                -
                                            </CounterBtn>
                                            <div>{data?.passenger.children}</div>
                                            <CounterBtn onClick={handleChildrenPlus}>
                                                +
                                            </CounterBtn>
                                        </CounterDiv>
                                    </PassengerView>
                                ) : null}
                            </DivView>
                                </ClickAwayListener>
                        </PassengerWrapper>
                    </InputContainer>

                    <TitleText>{t("packageDetails.flightDetails")}</TitleText>
                    <label>{t("packageDetails.flightDetailLabel", {flightFrom: "Henri Coanda", flightTo: "Tenerife", flightDuration: "04h 45m"})}</label>

                    <FlightDetailsContainer>
                        <FlightPort>{t("packageDetails.detailCard.henri")}<br />{t("packageDetails.detailCard.coanda")},<br />
                            {t("packageDetails.detailCard.tenerife")}</FlightPort>
                        <Time>
                            <div className="takeOffTime">05:45</div>
                            <div className="time-dotted">
                                <div className="dot-before"></div>
                                <div className="dot-after"></div>
                            </div>
                            <ImageForCompany />
                            <div className="tandingTime">07:30</div>
                        </Time>
                        <FlightPort>{t("packageDetails.detailCard.tenerife")}<br /> {t("packageDetails.detailCard.sur")},<br />
                            {t("packageDetails.detailCard.spain")}</FlightPort>
                    </FlightDetailsContainer>
                    <FlightDetailsContainer>
                        <FlightPort>{t("packageDetails.detailCard.tenerife")}<br />{t("packageDetails.detailCard.sur")},<br />
                            {t("packageDetails.detailCard.spain")}</FlightPort>
                        <Time>
                            <div className="takeOffTime">08:20</div>
                            <div className="time-dotted">
                                <div className="dot-before"></div>
                                <div className="dot-after"></div>
                            </div>
                            <ImageForCompany />
                            <div className="tandingTime">10:30</div>
                        </Time>
                        <FlightPort>{t("packageDetails.detailCard.henri")}<br /> {t("packageDetails.detailCard.coanda")},<br />
                            {t("packageDetails.detailCard.bucharest")}</FlightPort>
                    </FlightDetailsContainer>
                </FlightInformation>
                <BookingDetailContainer>
                    <TitleText>{t("packageDetails.detailCard.bookingDetails")}</TitleText>
                    <ParaTextBold style={{textAlign: 'center'}}>{t("packageDetails.bookingDetailPara", {date: "Jun 16 2022", noOfNights: "7"})}</ParaTextBold>

                    <BookingCard>
                        <div style={{ flexBasis: '15%', marginRight: '10px'}}>
                            <BookingHeadingText>{t('packageDetails.detailCard.singleRoom')}</BookingHeadingText>
                            <BookingHeadingText>{t('packageDetails.detailCard.singleRoom')}</BookingHeadingText>
                        </div>
                        <div style={{display: 'flex', flexBasis: '55%'}}>
                            <BookingMutedText>8  {t('global.days')} / 7 {t('global.nights')}</BookingMutedText>
                            <BookingMutedText style={{marginLeft: '35px'}}>1 {t('global.adults')}, 0 {t('global.children')}</BookingMutedText>
                        </div>
                        <div style={{display: 'flex', flexBasis: '30%'}}>
                            <BookingPriceText style={{marginRight: '30px'}}>409€</BookingPriceText>
                            <BookingButton>{t("packageDetails.detailCard.bookNow")}</BookingButton>
                        </div>
                    </BookingCard>

                    <BookingCard>
                        <div style={{ flexBasis: '15%', marginRight: '10px'}}>
                            <BookingHeadingText>{t("packageDetails.detailCard.doubleRoom")}</BookingHeadingText>
                            <BookingHeadingText>{t("packageDetails.detailCard.allIncl")}</BookingHeadingText>
                        </div>
                        <div style={{display: 'flex', flexBasis: '55%'}}>
                            <BookingMutedText>8 days / 7 nights</BookingMutedText>
                            <BookingMutedText style={{marginLeft: '35px'}}>2 {t('global.adults')}, 4 {t('global.children')}</BookingMutedText>
                        </div>
                        <div style={{display: 'flex', flexBasis: '30%'}}>
                            <BookingPriceText style={{marginRight: '30px'}}>1409€</BookingPriceText>
                            <BookingButton>{t("packageDetails.detailCard.bookNow")}</BookingButton>
                        </div>
                    </BookingCard>
                </BookingDetailContainer>

                <PackageCharterContainer>
                    <CustomHeading>{t("packageDetails.charterDetailHeading1", {hotelName: "Hotel Victoria"})}</CustomHeading>
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
                            Quisque facilisis accumsan sapien ac efficitur. Etiam eget urna vulputate, faucibus ipsum et, imperdiet ipsum.
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
        )
}

export default PackageDetailCard;

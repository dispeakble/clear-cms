import {useTranslations} from "next-intl";
import {
    StyledHomeSearch,
    StyledSearchTabs,
    StyledSearchTab,
    StyledSearchInput,
    StyledSearchOptions,
    StyledSearchCheckinGroup,
    StyledSearchOptionsGroup,
    StyledCheckIn,
    StyledCheckOut,
    StyledPerson,
    StyledChild,
    StyledInfant,
    StyledStars,
    StyledLabel,
    StyledValue, StyledPrimaryValue, StyledCenterLabel,
    CalendarContainer,
    Overlay,
} from "./styled";
import {useRef, useState} from "react";
import {useRouter} from "next/router";
import {
    GuestsContainer, GuestsItem, GuestsLabelContainer, Handler, HandlerContainer,
    SearchLabel
} from "../../../../components/agency/SearchComponent/styled";
import Calendar from "react-calendar";

const HomeSearch = () => {
    const router = useRouter();
    const t = useTranslations();

    const date = new Date()
    const destinationRef = useRef(null)

    const [checkInCalendarIsOpen, setCheckInCalendarIsOpen] = useState(false)
    const [checkOutCalendarIsOpen, setCheckOutCalendarIsOpen] = useState(false)
    const [checkInDate, setCheckInDate] = useState(null)
    const [checkOutDate, setCheckOutDate] = useState(null)
    const [guests, setGuests] = useState({
        adults: 1,
        children: 0,
        infants: 0
    })
    const [guestIsOpen, setGuestsIsOpen] = useState(false)
    const [destination, setDestination] = useState("")

    const handleDestination = (e: any) => {
        e.preventDefault()
        setDestination(e.target.value)
    }

    const onCheckInChange = (date: any) => {
        setCheckInDate(date)
        setCheckInCalendarIsOpen(false)
    }

    const onCheckOutChange = (date: any) => {
        setCheckOutDate(date)
        setCheckOutCalendarIsOpen(false)
    }

    const formateDate = (date : any) => {
        return Intl.DateTimeFormat(router.locale, {
            month: 'short',
            day: '2-digit',
            year: '2-digit',
        }).format(date)
    }

    const openCheckInCalendar = (e: any) => {
        if(e.currentTarget === e.target) {
            setCheckOutCalendarIsOpen(false)
            setGuestsIsOpen(false)
            setCheckInCalendarIsOpen(!checkInCalendarIsOpen)
        }
    }

    const openCheckOutCalendar = (e: any) => {
        if(e.currentTarget === e.target){
            setCheckInCalendarIsOpen(false)
            setGuestsIsOpen(false)
            setCheckOutCalendarIsOpen(!checkOutCalendarIsOpen)
        }
    }

    const openGuests = (e: any) => {
        if(e.currentTarget === e.target){
            setCheckInCalendarIsOpen(false)
            setCheckOutCalendarIsOpen(false)
            setGuestsIsOpen(!guestIsOpen)
        }
    }

    const handleAdults = (e: any) => {
        switch(e.target.id){
            case "adults-minus" : if(guests.adults > 1) setGuests(prev => ({adults: prev.adults-1, children: prev.children, infants: prev.infants}));
                break;
            case "adults-plus": if(guestsCount() < 10) setGuests(prev => ({adults: prev.adults+1, children: prev.children, infants: prev.infants}))  ;
                break;
        }
    }


    const handleChildren = (e: any) => {
        switch(e.target.id){
            case "children-minus" : if(guests.children > 0) setGuests(prev => ({adults: prev.adults, children: prev.children-1, infants: prev.infants}));
                break;
            case "children-plus": if(guestsCount() < 10) setGuests(prev => ({adults: prev.adults, children: prev.children+1, infants: prev.infants}))  ;
                break;
        }
    }

    const handleInfants = (e: any) => {
        switch(e.target.id){
            case "infants-minus" : if(guests.infants > 0) setGuests(prev => ({adults: prev.adults, children: prev.children, infants: prev.infants-1}));
                break;
            case "infants-plus": if(guestsCount() < 10)setGuests(prev => ({adults: prev.adults, children: prev.children, infants: prev.infants+1}))  ;
                break;
        }
    }

    const guestsCount = () => {
        return guests.children + guests.adults + guests.infants;
    }

    const searchSubmitHandler = (e: any) => {
        e.preventDefault();

        if(destination.length === 0){
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            destinationRef.current.focus()
        }

        if(!checkInDate){
            setCheckInCalendarIsOpen(true)
        }

        if(checkInDate && !checkOutDate){
            setCheckInCalendarIsOpen(false)
            setCheckOutCalendarIsOpen(true)
        }

        if(destination.length > 0
            && checkInDate
            && checkOutDate
            && guestsCount() > 0){
            router.push({
                pathname: `/agency/search/${destination}/${formateDate(checkInDate)}/${formateDate(checkOutDate)}/${guests.adults}`,
            })
        }
    }

    const closeModals = () => {
        setCheckInCalendarIsOpen(false)
        setCheckOutCalendarIsOpen(false)
        setGuestsIsOpen(false)
    }

    return <StyledHomeSearch>
        <StyledSearchTabs>
            <StyledSearchTab className="selected">{t('search.packages')}</StyledSearchTab>
            <StyledSearchTab>{t('search.hotels')}</StyledSearchTab>
            <StyledSearchTab>{t('search.flights')}</StyledSearchTab>
        </StyledSearchTabs>
        <StyledSearchInput placeholder={t('search.homeSearchPlaceholder')} value={destination} onChange={handleDestination} ref={destinationRef}/>
        <StyledSearchOptions>
            <StyledSearchCheckinGroup>
                <StyledCheckIn onClick={openCheckInCalendar}>
                    <StyledLabel>{t('search.checkinDate')}</StyledLabel>
                    <StyledValue>{
                        checkInDate !== null ?
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            formateDate(checkInDate)
                            : t('search.addDate')
                    }</StyledValue>
                    {
                        checkInCalendarIsOpen &&
                        <>
                            <CalendarContainer id="checkIn">
                                <SearchLabel>{t('search.checkinDate')}</SearchLabel>
                                <Calendar
                                    onChange={onCheckInChange}
                                    value={checkInDate}
                                    minDate={new Date()}
                                />
                            </CalendarContainer>
                            <Overlay onClick={closeModals}/>
                        </>
                    }
                </StyledCheckIn>
                <StyledCheckOut onClick={openCheckOutCalendar}>
                    <StyledLabel>{t('search.checkout')}</StyledLabel>
                    <StyledValue>{
                        checkOutDate !== null ?
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            formateDate(checkOutDate)
                            : t('search.addDate')
                    }</StyledValue>
                    {
                        checkOutCalendarIsOpen &&
                        <>
                            <CalendarContainer id="checkOut">
                                <SearchLabel>{t('search.checkoutDate')}</SearchLabel>
                                <Calendar
                                    onChange={onCheckOutChange}
                                    value={checkOutDate}
                                    minDate={checkInDate as unknown as Date}
                                />
                            </CalendarContainer>
                            <Overlay onClick={closeModals}/>
                        </>
                    }
                </StyledCheckOut>
            </StyledSearchCheckinGroup>
            <StyledSearchOptionsGroup onClick={openGuests}>
                <StyledPerson>
                    <StyledCenterLabel>
                        <StyledLabel>{t('search.adults')}</StyledLabel>
                        <StyledPrimaryValue>{guests.adults}</StyledPrimaryValue>
                    </StyledCenterLabel>
                </StyledPerson>
                <StyledChild>
                    <StyledCenterLabel>
                        <StyledLabel>{t('search.children')}</StyledLabel>
                        <StyledPrimaryValue>{guests.children}</StyledPrimaryValue>
                    </StyledCenterLabel>
                </StyledChild>
                <StyledInfant>
                    <StyledCenterLabel>
                        <StyledLabel>{t('search.infants')}</StyledLabel>
                        <StyledPrimaryValue>{guests.infants}</StyledPrimaryValue>
                    </StyledCenterLabel>
                </StyledInfant>
                <StyledStars>
                    <StyledCenterLabel>
                        <StyledLabel>{t('search.hotel-stars')}</StyledLabel>
                        <StyledPrimaryValue>2</StyledPrimaryValue>
                    </StyledCenterLabel>
                </StyledStars>
                {
                    guestIsOpen &&
                    <>
                        <GuestsContainer>
                            <GuestsItem>
                                <GuestsLabelContainer>
                                    <label>
                                        {t('search.adults')}
                                    </label>
                                    <label>
                                        {t('search.adults-age')}
                                    </label>
                                </GuestsLabelContainer>
                                <HandlerContainer>
                                    <Handler id="adults-minus" onClick={handleAdults}>
                                        -
                                    </Handler>
                                    {guests.adults}
                                    <Handler id="adults-plus" onClick={handleAdults}>
                                        +
                                    </Handler>
                                </HandlerContainer>
                            </GuestsItem>
                            <GuestsItem>
                                <GuestsLabelContainer>
                                    <label>
                                        {t('search.children')}
                                    </label>
                                    <label>
                                        {t('search.children-age')}
                                    </label>
                                </GuestsLabelContainer>
                                <HandlerContainer>
                                    <Handler id="children-minus" onClick={handleChildren}>
                                        -
                                    </Handler>
                                    {guests.children}
                                    <Handler id="children-plus" onClick={handleChildren}>
                                        +
                                    </Handler>
                                </HandlerContainer>
                            </GuestsItem>
                            <GuestsItem>
                                <GuestsLabelContainer>
                                    <label>
                                        {t('search.infants')}
                                    </label>
                                    <label>
                                        {t('search.infants-age')}
                                    </label>
                                </GuestsLabelContainer>
                                <HandlerContainer>
                                    <Handler id="infants-minus" onClick={handleInfants}>
                                        -
                                    </Handler>
                                    {guests.infants}
                                    <Handler id="infants-plus" onClick={handleInfants}>
                                        +
                                    </Handler>
                                </HandlerContainer>
                            </GuestsItem>
                        </GuestsContainer>
                        <Overlay onClick={closeModals} />
                    </>
                }
            </StyledSearchOptionsGroup>
        </StyledSearchOptions>
    </StyledHomeSearch>
}

export default HomeSearch;
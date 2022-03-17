import {
    CalendarContainer,
    DateLabel,
    GuestsContainer,
    GuestsItem,
    GuestsLabel,
    GuestsLabelContainer,
    Handler,
    HandlerContainer, Overlay,
    SearchButton,
    SearchContainer,
    SearchInput,
    SearchItem,
    SearchLabel, Separator
} from './styled'
import {AiOutlineSearch} from "react-icons/ai";
import {useRef, useState} from "react"
import Calendar from 'react-calendar';
import {useRouter} from 'next/router'
import 'react-calendar/dist/Calendar.css';
import {useTranslations} from "next-intl";

function SearchComponent(){

    const router = useRouter()
    const t = useTranslations('search')

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

    const focusDestination = () => {
       if(destinationRef.current){
           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
           // @ts-ignore
           destinationRef.current.focus()
       }
    }

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
            month: 'long',
            day: '2-digit',
            year: 'numeric',
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
                pathname: '/agency/search',
                query: {
                    destination: destination,
                    checkin: checkInDate,
                    checkout: checkOutDate,
                    adults: guests.adults,
                    children: guests.children,
                    infants: guests.infants,
                }
            })
        }
    }

    const closeModals = () => {
        setCheckInCalendarIsOpen(false)
        setCheckOutCalendarIsOpen(false)
        setGuestsIsOpen(false)
    }

    return(
        <SearchContainer onSubmit={searchSubmitHandler} data-testid="search-form">

            <SearchItem>
                <SearchLabel onClick={focusDestination}>{t('destination')}</SearchLabel>

                <SearchInput value={destination} onChange={handleDestination} ref={destinationRef} type="text" placeholder={t('input-placeholder')}/>
            </SearchItem>
            <Separator />
            <SearchItem onClick={openCheckInCalendar}>
                <SearchLabel onClick={openCheckInCalendar}>{t('checkin')}</SearchLabel>
                <DateLabel selected={checkInDate !== null} onClick={openCheckInCalendar}>
                    {
                        checkInDate !== null ?
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            formateDate(checkInDate)
                            : t('addDate')
                    }
                </DateLabel>
                {
                    checkInCalendarIsOpen &&
                    <>
                        <CalendarContainer id="checkIn">
                            <SearchLabel>{t('checkinDate')}</SearchLabel>
                            <Calendar
                                onChange={onCheckInChange}
                                value={checkInDate}
                                minDate={new Date()}
                                maxDate={new Date(date.setMonth(date.getMonth() + 3))}
                            />
                        </CalendarContainer>
                        <Overlay onClick={closeModals}/>
                    </>
                }
            </SearchItem>
            <Separator />
            <SearchItem onClick={openCheckOutCalendar}>
                <SearchLabel onClick={openCheckOutCalendar}>{t('checkout')}</SearchLabel>
                <DateLabel selected={checkOutDate !== null} onClick={openCheckOutCalendar}>
                    {
                        checkOutDate !== null ?
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            formateDate(checkOutDate)
                            : t('addDate')
                    }
                </DateLabel>
                {
                    checkOutCalendarIsOpen &&
                    <>
                        <CalendarContainer id="checkOut">
                        <SearchLabel>{t('checkoutDate')}</SearchLabel>
                        <Calendar
                            onChange={onCheckOutChange}
                            value={checkOutDate}
                            minDate={checkInDate as unknown as Date}
                        />
                        </CalendarContainer>
                        <Overlay onClick={closeModals}/>
                    </>
                }
            </SearchItem>
            <Separator />
            <SearchItem onClick={openGuests}>
                <SearchLabel onClick={openGuests}>{t('guests')}</SearchLabel>
                <GuestsLabel onClick={openGuests}>
                    {
                        guests.adults > 0 &&
                        `${guests.adults} ${t('adults')}`
                    }
                    {
                        guests.children > 0 &&
                        `, ${guests.children} ${t('children')}`
                    }
                </GuestsLabel>
                {
                    guestIsOpen &&
                    <>
                        <GuestsContainer>
                            <GuestsItem>
                                <GuestsLabelContainer>
                                    <label>
                                        {t('adults')}
                                    </label>
                                    <label>
                                        {t('adults-age')}
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
                                        {t('children')}
                                    </label>
                                    <label>
                                        {t('children-age')}
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
                                        {t('infants')}
                                    </label>
                                    <label>
                                        {t('infants-age')}
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
            </SearchItem>
            <SearchButton type="submit">
                <AiOutlineSearch /> {t('search-btn')}
            </SearchButton>
        </SearchContainer>
    )
}

export default SearchComponent
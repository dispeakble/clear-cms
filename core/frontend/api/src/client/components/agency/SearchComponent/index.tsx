import {
    CalendarContainer,
    DateLabel,
    GuestsContainer,
    GuestsItem,
    GuestsLabel,
    GuestsLabelContainer,
    Handler,
    HandlerContainer,
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

function SearchComponent(){

    const router = useRouter()

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

    return(
        <SearchContainer onSubmit={searchSubmitHandler} data-testid="search-form">

            <SearchItem>
                <SearchLabel onClick={focusDestination}>Destination</SearchLabel>

                <SearchInput value={destination} onChange={handleDestination} ref={destinationRef} type="text" placeholder="Where are you going?"/>
            </SearchItem>
            <Separator />
            <SearchItem onClick={openCheckInCalendar}>
                <SearchLabel onClick={openCheckInCalendar}>Check in</SearchLabel>
                <DateLabel selected={checkInDate !== null} onClick={openCheckInCalendar}>
                    {
                        checkInDate !== null ?
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            formateDate(checkInDate)
                            : "Add date"
                    }
                </DateLabel>
                {
                    checkInCalendarIsOpen &&
                    <CalendarContainer id="checkIn">
                        <SearchLabel>Check in date</SearchLabel>
                        <Calendar
                            onChange={onCheckInChange}
                            value={checkInDate}
                            minDate={new Date()}
                            maxDate={new Date(date.setMonth(date.getMonth() + 3))}
                        />
                    </CalendarContainer>
                }
            </SearchItem>
            <Separator />
            <SearchItem onClick={openCheckOutCalendar}>
                <SearchLabel onClick={openCheckOutCalendar}>Check out</SearchLabel>
                <DateLabel selected={checkOutDate !== null} onClick={openCheckOutCalendar}>
                    {
                        checkOutDate !== null ?
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            formateDate(checkOutDate)
                            : "Add date"
                    }
                </DateLabel>
                {
                    checkOutCalendarIsOpen &&
                    <CalendarContainer id="checkOut">
                        <SearchLabel>Check out date</SearchLabel>
                        <Calendar
                            onChange={onCheckOutChange}
                            value={checkOutDate}
                            minDate={checkInDate as unknown as Date}
                        />
                    </CalendarContainer>
                }
            </SearchItem>
            <Separator />
            <SearchItem onClick={openGuests}>
                <SearchLabel onClick={openGuests}>Guests</SearchLabel>
                <GuestsLabel onClick={openGuests}>
                    {
                        guests.adults > 0 &&
                        `${guests.adults} adults`
                    }
                    {
                        guests.children > 0 &&
                        `, ${guests.children} children`
                    }
                </GuestsLabel>
                {
                    guestIsOpen &&
                    <GuestsContainer>
                        <GuestsItem>
                            <GuestsLabelContainer>
                                <label>
                                    Adults
                                </label>
                                <label>
                                    Ages 13 or above.
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
                                    Children
                                </label>
                                <label>
                                    Ages between 2 and 13.
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
                                    Infants
                                </label>
                                <label>
                                    Under 2.
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
                }
            </SearchItem>
            <SearchButton type="submit">
                <AiOutlineSearch /> Search
            </SearchButton>
        </SearchContainer>
    )
}

export default SearchComponent
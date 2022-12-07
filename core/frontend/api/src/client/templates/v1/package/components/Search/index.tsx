import { useTranslations } from "next-intl";
import React, { ChangeEvent, useState } from "react";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import {
  PopupHolder,
  CalenderIcon,
  FieldGroup,
  FormElement,
  ResponsiveFieldGroup,
  SearchBody,
  SearchHolder,
  SearchIcon,
  SearchTitle,
  PassengerFilters,
  PassengerFilterTitle,
  CloseIcon,
  PassengerEntry,
  PassengerDesc,
  PersonHolder,
  PersonText, PersonQuantity, ClosePersonsButtonHolder
} from "./styled";
import {
  AdultBox, AdultIcon, AdultNumber, ChildIcon,
  DropdownIcon,
  GuestType, SearchButton, SearchIconWhite, span
} from "../../../components/PackageCharter/styled";
import { CalendarPopup, Overlay } from "../../../components/Styled/common";
import { Link } from "react-scroll";

interface PackageSearchProps {
  data: Record<string, any>,
  onSubmit?: () => Record<string, any>
}

const PackageSearch = ({ data, onSubmit }: PackageSearchProps) => {
  const t = useTranslations();

  const [show, setShow] = useState<Record<string, boolean>>({
    checkin: false,
    checkout: false,
    passengers: false
  });

  const [destination, setDestination] = useState(`${data.hotel}`);
  const [adults, setAdults] = useState<number>(data.passengers.adults);
  const [children, setChildren] = useState<number>(data.passengers.children);
  const [childAges, setChildAges] = useState<number[]>(data.passengers.childAges);

  const [showOverlay, setShowOverlay] = useState(false);

  const closeFormElements = () => {
    const newShow: Record<string, boolean> = {...show};
    Object.keys(newShow).forEach(function(key: string) {
      newShow[key] = false;
    });
    setShow({
      ...newShow
    });
    setShowOverlay(false);
  };

  const openFormElement = (name: string) => {
    setShow({
      ...show,
      [name]: true
    });
    setShowOverlay(true);
  };

  const handleSearch = (name: string) => {
    //TODO make WS search
    setDestination(name);
  };

  const handleChangeInput = (name: string, value: Date) => {

  };

  const handleAdultChange = (type: string) => {
    switch (type) {
      case 'plus':
        setAdults(adults >= 9 ? 9 : adults + 1);
        break;
      case 'minus':
        setAdults((adults - 1) || 1);
        break;
    }
  };

  const handleChildrenChange = (type: string) => {
    const newChildAges: number[] = [...childAges];
    switch (type) {
      case 'plus':
        newChildAges[children] = 0;
        setChildAges(newChildAges);
        setChildren(children >= 4 ? 4 : children + 1);
        break;
      case 'minus':
        delete newChildAges[children - 1];
        setChildAges(newChildAges);
        setChildren((children <= 0) ? 0 : children -1);
        break;
    }
  };

  const handleChildrenAgesChange = (type: string, rank: number) => {
    const newChildAges: number[] = [...childAges];

    switch (type) {
      case 'plus':
        if (newChildAges[rank] >= 9) return;
        newChildAges[rank] = Number(newChildAges[rank]) + 1;
        setChildAges(newChildAges);
        break;
      case 'minus':
        newChildAges[rank] = Number(newChildAges[rank]) - 1;
        if (Number(newChildAges[rank]) >= 0) {
          setChildAges(newChildAges);
        }
        break;
    }
  };

  return (<SearchHolder>
    <SearchTitle>{t("packageDetails.findDeals")}</SearchTitle>
    <SearchBody>
      <FieldGroup>
        <h4>{t("packageDetails.destinationOrHotel")}</h4>
        <FormElement>
          <SearchIcon />
          <input
            data-lpignore="true"
            value={destination}
            type="search"
            placeholder={t("deals.hotel")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleSearch(e.target.value);
            }} />
        </FormElement>
      </FieldGroup>
      <ResponsiveFieldGroup>
        <FieldGroup>
          <h4>{t("packageDetails.checkInDate")}</h4>
          <FormElement onClick={() => {
            openFormElement('checkin');
          }}>
            <CalenderIcon />
            <input placeholder={t("deals.checkin")}
                   style={{ cursor: "pointer" }}
                   value={moment(data.checkin).format("ddd, DD MMM, YYYY")} readOnly />

            <DropdownIcon />
          </FormElement>
          <PopupHolder>
            {show.checkin ? (
              <CalendarPopup
                minDate={new Date()}
                value={data.checkin}
                onChange={(value: Date) => {
                  handleChangeInput("checkin", value);
                  closeFormElements();
                }}
              />
            ) : null}
          </PopupHolder>
        </FieldGroup>
        <FieldGroup>
          <h4>{t("packageDetails.checkOutDate")}</h4>
          <FormElement onClick={() => {
            openFormElement('checkout');
          }}>
            <CalenderIcon />
            <input placeholder={t("deals.checkout")}
                   value={moment(data.checkout).format("ddd, DD MMM, YYYY")} readOnly
                   style={{ cursor: "pointer" }}
            />
            <DropdownIcon />
          </FormElement>
          <PopupHolder>
            {show.checkout ? (
              <CalendarPopup
                minDate={new Date()}
                value={data.checkout}
                onChange={(value: Date) => {
                  handleChangeInput("checkout", value);
                  closeFormElements();
                }}
              />
            ) : null}
          </PopupHolder>
        </FieldGroup>

      </ResponsiveFieldGroup>
      <FieldGroup>
        <h4>{t("hotelResult.sideBar.search.passengers")}:</h4>
        <GuestType onClick={() => {
          openFormElement('passengers');
        }}>
          <AdultBox>
            <AdultIcon />
            <AdultNumber>
              {t(`deals.detail.adult`)}: {adults}
            </AdultNumber>
          </AdultBox>
          <AdultBox>
            <ChildIcon />
            <AdultNumber>
              {t("global.children")}: {children}
            </AdultNumber>
          </AdultBox>
          <div>
            <DropdownIcon />
          </div>
        </GuestType>
        {show.passengers ? (
          <PopupHolder>
            <PassengerFilters>
              <PassengerEntry>
                <PassengerDesc>{t("hotelResult.sideBar.search.addPersons")}</PassengerDesc>
                <PersonHolder>
                  <PersonText>
                    <h3>{t("global.adults")}</h3>
                  </PersonText>
                  <div>
                    <PersonQuantity>
                      <span onClick={() => handleAdultChange('minus')}>-</span>
                      <h5>{adults}</h5>
                      <span onClick={() => handleAdultChange('plus')}>+</span>
                    </PersonQuantity>
                  </div>
                </PersonHolder>
                <PersonHolder>
                  <PersonText>
                    <h3>{t("global.children")}</h3>
                  </PersonText>
                  <div>
                    <PersonQuantity>
                      <span onClick={() => handleChildrenChange('minus')}>-</span>
                      <h5>{children}</h5>
                      <span onClick={() => handleChildrenChange('plus')}>+</span>
                    </PersonQuantity>
                  </div>
                </PersonHolder>
                {
                  [...Array(children)].map((n: number, i: number) => (
                    <PersonHolder>
                      <PersonText>
                        <h3>{t('search.childAgeVar', {n: i + 1})}</h3>
                      </PersonText>
                      <div>
                        <PersonQuantity>
                          <span onClick={() => handleChildrenAgesChange('minus', i)}>-</span>
                          <h5>{childAges[i]}</h5>
                          <span onClick={() => handleChildrenAgesChange('plus', i)}>+</span>
                        </PersonQuantity>
                      </div>
                    </PersonHolder>
                  ))
                }
                <ClosePersonsButtonHolder>
                  <button onClick={closeFormElements}>{t("hotelResult.sideBar.search.done")}</button>
                </ClosePersonsButtonHolder>
              </PassengerEntry>
            </PassengerFilters>
          </PopupHolder>

        ) : null}
      </FieldGroup>
      <SearchButton>
        <button>
          <SearchIconWhite />
          <Link to="prices" spy={true} smooth={true}>
            <span>{t("hotelResult.sideBar.search.newSearch")}</span>
          </Link>
        </button>
      </SearchButton>
    </SearchBody>
    {
      showOverlay && <Overlay data-testid="home-search-overlay" onClick={closeFormElements} />
    }
  </SearchHolder>);

};

export default PackageSearch;
import * as React from "react";
import { useState } from "react";
import { ThemeProvider } from "styled-components";
import Header from "./components/Header";
import HotelDetail from "./components/HotelDetail";
import HotelAbout from "./components/HotelAbout";
import {
  ContentWrapper,
  GlobalStyle,
  MainWrapper,
  PaperWrapper,
  StyledContentWrapper,
  TopContentWrapper
} from "./styled";
import Breadcrumbs from "./components/Breadcrumbs";
import HotelAvailable from "./components/HotelAvailable";
import moment from "moment";
import { getIcon } from "./helpers/icons";

const HotelPage = ({ websiteName, websiteSlogan, colorScheme }: any) => {

  const getIcons = (iconName: string) => {
    return getIcon(iconName);
  };

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

  const handleChangeInput = (name: string, value: any) => {
    setData({
      ...data,
      [name]: value
    });
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
  const handleInfantsPlus = () => {
    setData({
      ...data,
      passenger: {
        ...data.passenger,
        infants: data.passenger.infants + 1
      }
    });

  };
  const handleInfantsMinus = () => {
    if (Number(data.passenger.infants) > 0) {
      setData({
        ...data,
        passenger: {
          ...data.passenger,
          infants: data.passenger.infants - 1
        }
      });
    }


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
  const handleHotelSearch = (hotelValue: any) => {
    setData({
      ...data,
      hotel: hotelValue
    });

  };
  const handleSearch = (value: any) => {
    setData({
      ...data,
      hotel: value
    });
  };

  const myTheme: any = { colors: colorScheme, icon: getIcons };

  return (
    <ThemeProvider theme={myTheme}>
      <GlobalStyle />
      <MainWrapper data-testid="hotel-page-wrapper">
        <Header websiteName={websiteName} />
        <TopContentWrapper>
          <ContentWrapper>
            <Breadcrumbs />
            <HotelDetail
              data={data}
              handleChildrenMinus={handleChildrenMinus}
              handleChildrenPlus={handleChildrenPlus}
              handleInfantsMinus={handleInfantsMinus}
              handleInfantsPlus={handleInfantsPlus}
              handleChangeInput={handleChangeInput}
              handleAdultPlus={handleAdultPlus}
              handleAdultMinus={handleAdultMinus}
              handleSearch={handleSearch}
              handleHotelSearch={handleHotelSearch}
            />
          </ContentWrapper>
        </TopContentWrapper>
        <PaperWrapper>
          <ContentWrapper>
            <HotelAbout />
            <HotelAvailable
              data={data}
              handleChildrenMinus={handleChildrenMinus}
              handleChildrenPlus={handleChildrenPlus}
              handleInfantsMinus={handleInfantsMinus}
              handleInfantsPlus={handleInfantsPlus}
              handleChangeInput={handleChangeInput}
              handleAdultPlus={handleAdultPlus}
              handleAdultMinus={handleAdultMinus}
            />
          </ContentWrapper>

        </PaperWrapper>

      </MainWrapper>
    </ThemeProvider>
  );
};

export default HotelPage;
import * as React from "react";
import { useEffect, useState } from "react";
import {
  ContentWrapper,
} from "../styled";
import {
  DetailsWrapper,
  HotelsHeaderWrapper,
  HotelsHeader,
  HotelsWrapper,
  CartStepsWrapper,
  StepWrapper
} from "./styled";
import { useTranslations } from "next-intl";
import FirstStep from "./steps/FirstStep";
import SecondStep from "./steps/SecondStep";
import ThirdStep from "./steps/ThirdStep";
import Cart from "./Cart";
import * as shortid from "shortid";
import DepartureIcon from "../assets/img/icons/departure-icon.svg";
import FlightImg from "../assets/img/flight.png";
import ArrivalIcon from "../assets/img/icons/arrival-icon.svg";
import Layout from "../components/Layout";

interface IPassenger {
  id: string,
  firstName: string;
  lastName: string;
  isAdult: boolean;
  age?: number;
}

const PackageCheckoutPage = ({ websiteName, websiteSlogan, colorScheme }: any) => {

  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState<number>(1);

  const breadcrumbs = {
    //TODO translate this
    "packages/list": "Packages",
    "packages/checkout": "Checkout"
  };

  //this is silly. must do something about it
  const day = {
    Monday: t("day.monday"),
    Tuesday: t("day.tuesday"),
    Wednesday: t("day.wednesday"),
    Thurday: t("day.thursday"),
    Friday: t("day.friday"),
    Saturday: t("day.saturday"),
    Sunday: t("day.sunday")
  };
  const month = {
    January: t("month.january"),
    February: t("month.february"),
    March: t("month.march"),
    April: t("month.april"),
    May: t("month.may"),
    June: t("month.june"),
    July: t("month.july"),
    August: t("month.august"),
    September: t("month.september"),
    October: t("month.october"),
    November: t("month.november"),
    December: t("month.december")
  };

  const passengersData = [
    {
      type: "adult"
    },
    {
      type: "adult"
    },
    {
      type: "children"
    },
    {
      type: "children"
    }
  ];

  const packageDetails = {
    title: "Package Charter for Hotel Victoria",
    packagePrice: 4798,
    hotels: [
      {
        name: "Hotel Victoria",
        address: "Costa Adeje, Santa Cruz de Tenerife",
        rating: 4,
        adults: 1,
        children: 0,
        roomType: `2 x ${t("packageCheckout.details.doubleRoom")}`,
        roomDetails: t("packageCheckout.details.bedAndBreakfast"),
        allInclusive: true,
        duration: `8 ${t("global.days")} / 7 ${t("global.nights")}`,
        checkoutDay: `${day.Monday}, 10 ${month.June}.`,
        checkoutTime: "14:00",
        price: 409
      }
    ],
    flights: [
      {
        trips: {
          outbound: {
            typeIMG: DepartureIcon,
            flightProviderIMG: FlightImg,
            type: t("flightsCheckout.main.type.departure"),
            departure: t("flightsCheckout.main.bucharest"),
            departureShort: "OTP",
            departureDate: `${day.Monday}, 10 ${month.June}`,
            departureTime: "00:20",
            destination: t("flightsCheckout.main.tenerife"),
            destinationShort: "TFS",
            destinationDate: `${day.Monday}, 10 ${month.June}`,
            arrivalTime: "06:20",
            duration: "7h 30m",
            aircraft: "Wizz Air",
            aircraftRef: "W12345"
          },
          return: {
            typeIMG: ArrivalIcon,
            flightProviderIMG: FlightImg,
            type: t("flightsCheckout.main.type.departure"),
            departure: t("flightsCheckout.main.tenerife"),
            departureShort: "TFS",
            departureDate: `${day.Monday}, 10 ${month.June}`,
            departureTime: "00:20",
            destination: t("flightsCheckout.main.bucharest"),
            destinationShort: "OTP",
            destinationDate: `${day.Monday}, 10 ${month.June}`,
            arrivalTime: "06:20",
            duration: "7h 30m",
            aircraft: "Wizz Air",
            aircraftRef: "W12345"
          }
        },
        services: [
          `${t("packageCheckout.details.airportHotelTransfer")}`,
          `1 x ${t("packageCheckout.details.smallBags")}`,
          `1 x ${t("packageCheckout.details.suitcase")}`,
          `${t("packageCheckout.details.airportTaxes")}`
        ]
      }
    ]
  };

  const [passengers, setPassengers] = useState<IPassenger[]>([]);
  const [paymentError, setPaymentError] = useState(true);

  const [contactDetails, setContactDetails] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: "",
    country: ""
  });

  const [invoiceDetails, setInvoiceDetails] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: "",
    country: "",
    address: "",
    city: "",
    zipCode: ""
  });

  useEffect(() => {
    setPassengers([]);
    passengersData.map((passenger: { type: string }) => {
      setPassengers((prev: IPassenger[]) => {
        return [...prev, {
          id: shortid.generate(),
          firstName: "",
          lastName: "",
          isAdult: passenger.type === "adult",
          ...(passenger.type !== "adult" ? { age: 0 } : {})
        }];
      });
    });
  }, []);

  const passengersCount = {
    ...(passengers.filter((p) => p.isAdult).length > 0
      && { [t("global.adults")]: passengers.filter((p) => p.isAdult).length }),
    ...(passengers.filter((p) => !p.isAdult).length > 0
      && { [t("global.children")]: passengers.filter((p) => !p.isAdult).length })
  };

  const displayHeader = () => {
    switch (currentStep) {
      case 1 :
        return t("packageCheckout.headers.first");
      case 2 :
        return t("packageCheckout.headers.second");
      case 3 :
        if (paymentError) {
          return t("packageCheckout.headers.fourthError");
        } else {
          return t("packageCheckout.headers.fourthSuccess");
        }
      case 4:
        return t("packageCheckout.headers.confirmed");
    }
  };

  const displayStep = () => {
    switch (currentStep) {
      case 1:
        return <FirstStep passengers={passengers}
                           setCurrentStep={setCurrentStep}
                           currentStep={currentStep}
                           setPassengers={setPassengers}
                           contactDetails={contactDetails}
                           setContactDetails={setContactDetails}
                           invoiceDetails={invoiceDetails}
                           setInvoiceDetails={setInvoiceDetails}
                           passengersCount={passengersCount}
        />;
      case 2:
        return <SecondStep paymentError={paymentError}
                           currentStep={currentStep}
                           setCurrentStep={setCurrentStep}
        />;
      case 3:
        return <ThirdStep />;
    }
  };

  return (
    <Layout
      isHomePage={false}
      breadcrumbs={breadcrumbs}
      websiteSlogan={websiteSlogan}
      websiteName={websiteName}
      colorScheme={colorScheme}
    >
      <ContentWrapper>
        <DetailsWrapper>
          {
            currentStep !== 3 &&
            <Cart packageDetails={packageDetails}
                  passengersCount={passengersCount}
            />
          }
          <HotelsWrapper>
            <HotelsHeaderWrapper>
              <HotelsHeader>
                {
                  displayHeader()
                }
              </HotelsHeader>
              <CartStepsWrapper>
                <StepWrapper currentStep={currentStep === 1}>
                  1
                </StepWrapper>
                <StepWrapper currentStep={currentStep === 2}>
                  2
                </StepWrapper>
                <StepWrapper currentStep={currentStep === 3}>
                  3
                </StepWrapper>
              </CartStepsWrapper>
            </HotelsHeaderWrapper>
            {
              displayStep()
            }
          </HotelsWrapper>
        </DetailsWrapper>
      </ContentWrapper>
    </Layout>
  );
};

export default PackageCheckoutPage;
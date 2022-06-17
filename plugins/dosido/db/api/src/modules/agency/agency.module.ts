import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { QueryService } from "../../services/query.service";
import { AgencyService } from "./services/agency.service";

import { FileInfo } from "./models/general/file.info.model";
import { Gender } from "./models/general/gender.model";
import { BookingItem } from "./models/booking/booking.item.model";
import { BookingItemStatus } from "./models/booking/booking.item.status.model";
import { BookingItemType } from "./models/booking/booking.item.type.model";
import { BookingOptionFlight } from "./models/booking/booking.option.flight.model";
import { Booking } from "./models/booking/booking.model";
import { BookingOptionHotel } from "./models/booking/booking.option.hotel.model";
import { BookingOptionPackage } from "./models/booking/booking.option.package.model";
import { PaxInfo } from "./models/booking/pax.info.model";
import { PaxType } from "./models/booking/pax.type.model";
import { AirlineCabin } from "./models/flights/airline.cabin.model";
import { Leg } from "./models/flights/leg.model";
import { Geography } from "./models/geography/geography.model";
import { Hotel } from "./models/hotels/hotel.model";
import { RoomCategory } from "./models/hotels/room.category.model";
import { DetailedDescription } from "./models/packages/detailed.description.model";
import { DiscountInfo } from "./models/packages/discount.info.model";
import { ExtraComponent } from "./models/packages/extra.component.model";
import { MealPlan } from "./models/packages/meal.plan.model";
import { PackageInfo } from "./models/packages/package.info.model";
import { PriceInfo } from "./models/packages/price.info.model";
import { PriceSet } from "./models/packages/price.set.model";
import { Room } from "./models/packages/room.model";
import { SpecialOffer } from "./models/packages/special.offer.model";
import { Client } from "./models/clients/client.model";

//search
import { PackagesCache } from "./models/search/packages.cache.model";
import { HotelsCache } from "./models/search/hotels.cache.model";
import { FlightsCache } from "./models/search/flights.cache.model"

@Module({
    imports: [SequelizeModule.forFeature([

        //general
        FileInfo,
        Gender,

        //booking
        BookingItem,
        BookingItemStatus,
        BookingItemType,
        Booking,
        BookingOptionFlight,
        BookingOptionHotel,
        BookingOptionPackage,
        PaxInfo,
        PaxType,

        //flights
        AirlineCabin,
        Leg,

        //geography
        Geography,

        //hotel
        Hotel,
        RoomCategory,

        //packages
        DetailedDescription,
        DiscountInfo,
        ExtraComponent,
        MealPlan,
        PackageInfo,
        PriceInfo,
        PriceSet,
        Room,
        SpecialOffer,

        //clients
        Client,

        //search and cache
        PackagesCache,
        HotelsCache,
        FlightsCache

    ], `agency`)],
    providers: [AgencyService, QueryService],
    exports: [AgencyService]
})
export class AgencyModule {
}
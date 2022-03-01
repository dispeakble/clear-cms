import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {QueryService} from "../../services/query.service";
import {AgencyService} from "./services/agency.service";


import {FileInfoModel} from "./models/general/file.info.model";
import {GenderModel} from "./models/general/gender.model";
import {BookingItemModel} from "./models/booking/booking.item.model";
import {BookingItemStatusModel} from "./models/booking/booking.item.status.model";
import {BookingItemTypeModel} from "./models/booking/booking.item.type.model";
import {BookingOptionFlightModel} from "./models/booking/booking.option.flight.model";
import {BookingModel} from "./models/booking/booking.model";
import {BookingOptionHotelModel} from "./models/booking/booking.option.hotel.model";
import {BookingOptionPackageModel} from "./models/booking/booking.option.package.model";
import {PaxInfoModel} from "./models/booking/pax.info.model";
import {PaxTypeModel} from "./models/booking/pax.type.model";
import {AirlineCabinModel} from "./models/flights/airline.cabin.model";
import {LegModule} from "./models/flights/leg.module";
import {GeographyModel} from "./models/geography/geography.model";
import {HotelModel} from "./models/hotels/hotel.model";
import {RoomCategoryModel} from "./models/hotels/room.category.model";
import {DetailedDescriptionModel} from "./models/packages/detailed.description.model";
import {DiscountInfoModel} from "./models/packages/discount.info.model";
import {ExtraComponentModel} from "./models/packages/extra.component.model";
import {MealPlanModel} from "./models/packages/meal.plan.model";
import {PackageInfoModel} from "./models/packages/package.info.model";
import {PriceInfoModel} from "./models/packages/price.info.model";
import {PriceSetModel} from "./models/packages/price.set.model";
import {RoomModel} from "./models/packages/room.model";
import {SpecialOfferModel} from "./models/packages/special.offer.model";

@Module({
    imports: [SequelizeModule.forFeature([

        //general
        FileInfoModel,
        GenderModel,

        //booking
        BookingItemModel,
        BookingItemStatusModel,
        BookingItemTypeModel,
        BookingModel,
        BookingOptionFlightModel,
        BookingOptionHotelModel,
        BookingOptionPackageModel,
        PaxInfoModel,
        PaxTypeModel,

        //flights
        AirlineCabinModel,
        LegModule,

        //geography
        GeographyModel,

        //hotel
        HotelModel,
        RoomCategoryModel,

        //packages
        DetailedDescriptionModel,
        DiscountInfoModel,
        ExtraComponentModel,
        MealPlanModel,
        PackageInfoModel,
        PriceInfoModel,
        PriceSetModel,
        RoomModel,
        SpecialOfferModel,
    ], 'agency')],
    providers: [AgencyService, QueryService],
    exports: [AgencyService]
})
export class AgencyModule {
}
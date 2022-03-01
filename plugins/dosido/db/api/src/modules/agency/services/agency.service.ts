import {Inject, Injectable} from '@nestjs/common';
import {QueryService} from "../../../services/query.service";
import {InjectModel} from "@nestjs/sequelize";
import {FileInfoModel} from "../models/general/file.info.model";
import {GenderModel} from "../models/general/gender.model";
import {BookingItemModel} from "../models/booking/booking.item.model";
import {BookingItemStatusModel} from "../models/booking/booking.item.status.model";
import {BookingItemTypeModel} from "../models/booking/booking.item.type.model";
import {BookingModel} from "../models/booking/booking.model";
import {BookingOptionFlightModel} from "../models/booking/booking.option.flight.model";
import {BookingOptionHotelModel} from "../models/booking/booking.option.hotel.model";
import {BookingOptionPackageModel} from "../models/booking/booking.option.package.model";
import {PaxInfoModel} from "../models/booking/pax.info.model";
import {PaxTypeModel} from "../models/booking/pax.type.model";
import {AirlineCabinModel} from "../models/flights/airline.cabin.model";
import {LegModule} from "../models/flights/leg.module";
import {GeographyModel} from "../models/geography/geography.model";
import {HotelModel} from "../models/hotels/hotel.model";
import {RoomCategoryModel} from "../models/hotels/room.category.model";
import {DetailedDescriptionModel} from "../models/packages/detailed.description.model";
import {DiscountInfoModel} from "../models/packages/discount.info.model";
import {ExtraComponentModel} from "../models/packages/extra.component.model";
import {MealPlanModel} from "../models/packages/meal.plan.model";
import {PackageInfoModel} from "../models/packages/package.info.model";
import {PriceInfoModel} from "../models/packages/price.info.model";
import {PriceSetModel} from "../models/packages/price.set.model";
import {RoomModel} from "../models/packages/room.model";
import {SpecialOfferModel} from "../models/packages/special.offer.model";

@Injectable()
export class AgencyService {

    constructor(

        //general
        @InjectModel(FileInfoModel, 'agency') private fileInfoModel: FileInfoModel,
        @InjectModel(GenderModel, 'agency') private genderModel: GenderModel,

        //booking
        @InjectModel(BookingItemModel, 'agency') private bookingItemModel: BookingItemModel,
        @InjectModel(BookingItemStatusModel, 'agency') private bookingItemStatusModel: BookingItemStatusModel,
        @InjectModel(BookingItemTypeModel, 'agency') private bookingItemTypeModel: BookingItemTypeModel,
        @InjectModel(BookingModel, 'agency') private bookingModel: BookingModel,
        @InjectModel(BookingOptionFlightModel, 'agency') private bookingOptionFlightModel: BookingOptionFlightModel,
        @InjectModel(BookingOptionHotelModel, 'agency') private bookingOptionHotelModel: BookingOptionHotelModel,
        @InjectModel(BookingOptionPackageModel, 'agency') private bookingOptionPackageModel: BookingOptionPackageModel,
        @InjectModel(PaxInfoModel, 'agency') private paxInfoModel: PaxInfoModel,
        @InjectModel(PaxTypeModel, 'agency') private paxTypeModel: PaxTypeModel,

        //flights
        @InjectModel(AirlineCabinModel, 'agency') private airlineCabinModel: AirlineCabinModel,
        @InjectModel(LegModule, 'agency') private legModule: LegModule,

        //geography
            @InjectModel(GeographyModel, 'agency') private geographyModel: GeographyModel,

        //hotel
        @InjectModel(HotelModel, 'agency') private hotelModel: HotelModel,
        @InjectModel(RoomCategoryModel, 'agency') private roomCategoryModel: RoomCategoryModel,

        //packages
        @InjectModel(DetailedDescriptionModel, 'agency') private detailedDescriptionModel: DetailedDescriptionModel,
        @InjectModel(DiscountInfoModel, 'agency') private discountInfoModel: DiscountInfoModel,
        @InjectModel(ExtraComponentModel, 'agency') private extraComponentModel: ExtraComponentModel,
        @InjectModel(MealPlanModel, 'agency') private mealPlanModel: MealPlanModel,
        @InjectModel(PackageInfoModel, 'agency') private packageInfoModel: PackageInfoModel,
        @InjectModel(PriceInfoModel, 'agency') private priceInfoModel: PriceInfoModel,
        @InjectModel(PriceSetModel, 'agency') private priceSetModel: PriceSetModel,
        @InjectModel(RoomModel, 'agency') private roomModel: RoomModel,
        @InjectModel(SpecialOfferModel, 'agency') private specialOfferModel: SpecialOfferModel,

        //services
        @Inject('QueryService') private queryService: QueryService
    ) {
    }

    public getModel(modelName: string) {
        return this[`${modelName}Model`];
    }


    public perform(data: any) {
        try {
            return this.queryService[data.act]({getModel: (modelName) => this.getModel(modelName), ...data.payload});
        } catch (err) {
            return null;
        }
    }

}

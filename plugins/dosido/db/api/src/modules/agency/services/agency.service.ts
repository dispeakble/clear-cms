import { Inject, Injectable } from "@nestjs/common";
import {QueryService} from "../../../services/query.service";
import { InjectModel } from "@nestjs/sequelize";
import {FileInfo} from "../models/general/file.info.model";
import {Gender} from "../models/general/gender.model";
import {BookingItem} from "../models/booking/booking.item.model";
import {BookingItemStatus} from "../models/booking/booking.item.status.model";
import {BookingItemType} from "../models/booking/booking.item.type.model";
import {Booking} from "../models/booking/booking.model";
import {BookingOptionFlight} from "../models/booking/booking.option.flight.model";
import {BookingOptionHotel} from "../models/booking/booking.option.hotel.model";
import {BookingOptionPackage} from "../models/booking/booking.option.package.model";
import {PaxInfo} from "../models/booking/pax.info.model";
import {PaxType} from "../models/booking/pax.type.model";
import {AirlineCabin} from "../models/flights/airline.cabin.model";
import {Leg} from "../models/flights/leg.model";
import {Geography} from "../models/geography/geography.model";
import {Hotel} from "../models/hotels/hotel.model";
import {RoomCategory} from "../models/hotels/room.category.model";
import {DetailedDescription} from "../models/packages/detailed.description.model";
import {DiscountInfo} from "../models/packages/discount.info.model";
import {ExtraComponent} from "../models/packages/extra.component.model";
import {MealPlan} from "../models/packages/meal.plan.model";
import {PackageInfo} from "../models/packages/package.info.model";
import {PriceInfo} from "../models/packages/price.info.model";
import {PriceSet} from "../models/packages/price.set.model";
import {Room} from "../models/packages/room.model";
import {SpecialOffer} from "../models/packages/special.offer.model";
import { PackagesCache } from "../models/search/packages.cache.model";
import { HotelsCache } from "../models/search/hotels.cache.model";
import {FlightsCache} from "../models/search/flights.cache.model";

@Injectable()
export class AgencyService {

  constructor(

    //general
    @InjectModel(FileInfo, 'agency') private fileInfoModel: FileInfo,
    @InjectModel(Gender, 'agency') private genderModel: Gender,

    //booking
    @InjectModel(BookingItem, 'agency') private bookingItemModel: BookingItem,
    @InjectModel(BookingItemStatus, 'agency') private bookingItemStatusModel: BookingItemStatus,
    @InjectModel(BookingItemType, 'agency') private bookingItemTypeModel: BookingItemType,
    @InjectModel(Booking, 'agency') private bookingModel: Booking,
    @InjectModel(BookingOptionFlight, 'agency') private bookingOptionFlightModel: BookingOptionFlight,
    @InjectModel(BookingOptionHotel, 'agency') private bookingOptionHotelModel: BookingOptionHotel,
    @InjectModel(BookingOptionPackage, 'agency') private bookingOptionPackageModel: BookingOptionPackage,
    @InjectModel(PaxInfo, 'agency') private paxInfoModel: PaxInfo,
    @InjectModel(PaxType, 'agency') private paxTypeModel: PaxType,

    //flights
    @InjectModel(AirlineCabin, 'agency') private airlineCabinModel: AirlineCabin,
    @InjectModel(Leg, 'agency') private legModule: Leg,

    //geography
    @InjectModel(Geography, 'agency') private geographyModel: Geography,

    //hotel
    @InjectModel(Hotel, 'agency') private hotelModel: Hotel,
    @InjectModel(RoomCategory, 'agency') private roomCategoryModel: RoomCategory,

    //packages
    @InjectModel(DetailedDescription, 'agency') private detailedDescriptionModel: DetailedDescription,
    @InjectModel(DiscountInfo, 'agency') private discountInfoModel: DiscountInfo,
    @InjectModel(ExtraComponent, 'agency') private extraComponentModel: ExtraComponent,
    @InjectModel(MealPlan, 'agency') private mealPlanModel: MealPlan,
    @InjectModel(PackageInfo, 'agency') private packageInfoModel: PackageInfo,
    @InjectModel(PriceInfo, 'agency') private priceInfoModel: PriceInfo,
    @InjectModel(PriceSet, 'agency') private priceSetModel: PriceSet,
    @InjectModel(Room, 'agency') private roomModel: Room,
    @InjectModel(SpecialOffer, 'agency') private specialOfferModel: SpecialOffer,
    //caches
    @InjectModel(PackagesCache, 'agency') private packagesCacheModel: PackagesCache,
    @InjectModel(HotelsCache, 'agency') private hotelsCacheModel: HotelsCache,
    @InjectModel(FlightsCache, 'agency') private flightsCacheModel: FlightsCache,

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

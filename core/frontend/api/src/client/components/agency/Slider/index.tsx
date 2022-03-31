import React ,{useState , useEffect} from 'react';
import {Colors} from "../../../assets/design-set";


import Image1 from '../../../pages/agency/assets/Slider/bridge.jpg'
import Image2 from '../../../pages/agency/assets/Slider/houses.jpg'
import Image3 from '../../../pages/agency/assets/Slider/lake.jpg'
import {ChevronLeft, ChevronRight,Check} from "@material-ui/icons";



import {
    SliderWrapper,
    SliderContainer,
    GalleryImage,
    SliderContentWrapper,
    ListItemContainer,
    ListItemDescription,
    ListItemHeading,
    ListItemIcon,
    ListContainer,
    GalleryMainImage,
    SliderBtnRight,
    SliderButtonContainer,
    SliderBtnLeft,
    SliderLeft,
    SliderBoxContainer,
    SliderBoxHeading,
    SliderBox,
    SliderRight,
    ImageSliderWrapper,
    ImageSliderHeading,
    GalleryContainer,
} from './styled'

const Slider = ({sliderData}) => {
    const [checkNumber , setCheckNumber]=useState([1,2,3])


   const  CheckNumberFunction = (type: string)=>{
       const newImages = [...checkNumber];
       if(type == '+'){

           newImages[0] = newImages[0] === 3 ? 1 : newImages[0] + 1
           newImages[1] = newImages[1] === 3 ? 1 : newImages[1] + 1
           newImages[2] = newImages[2] === 3 ? 1 : newImages[2] + 1

       }else{
           newImages[0] = newImages[0] === 1 ? 3 : newImages[0] - 1
           newImages[1] = newImages[1] === 1 ? 3 : newImages[1] - 1
           newImages[2] = newImages[2] === 1 ? 3 : newImages[2] - 1

       }
     setCheckNumber(newImages)
    }

    const CheckSideBarFunction =(index:number)=>{
        const newImages = [...checkNumber];
        if(Number(index) == 0){
            newImages[0] = 3
            newImages[1] = 1
            newImages[2] = 2
        }else if(Number(index) == 1){
            newImages[0] = 1
            newImages[1] = 2
            newImages[2] = 3

        }else{
            newImages[0] = 2
            newImages[1] = 3
            newImages[2] = 1
        }
        setCheckNumber(newImages)

    }


    return (
        <SliderWrapper>
            <SliderContainer>
                <SliderLeft >
                    <SliderBoxContainer>
                        {
                            sliderData.map((slide:any,index:number) =>  <SliderBox key={`${index}`} onClick={()=>CheckSideBarFunction(index)} style={{backgroundColor: slide.val === checkNumber[1] ? 'rgba(220,107,3,0.7)' : 'rgba(255, 255, 255, 0.6)',color: slide.val === checkNumber[1] ? `${Colors.white}` : `${Colors.black}`}} >
                              <SliderBoxHeading> {slide.heading}</SliderBoxHeading>
                            </SliderBox>)
                        }

                    </SliderBoxContainer>
                </SliderLeft>
                <SliderRight>
                    <ImageSliderWrapper>
                        <ImageSliderHeading>Best Water Parks</ImageSliderHeading>
                        <GalleryContainer>
                            <GalleryImage src={sliderData.filter(img => img.val === checkNumber[0])[0].img}/>
                            <GalleryMainImage src={sliderData.filter(img => img.val === checkNumber[1])[0].img} />
                            <GalleryImage src={sliderData.filter(img => img.val === checkNumber[2])[0].img} />
                            <SliderButtonContainer>
                                <SliderBtnLeft onClick={() => CheckNumberFunction('-')}>
                                    <svg width="23" height="39" viewBox="0 0 23 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 37L3 18.875L21 2" stroke="white" stroke-width="3"/>
                                    </svg>
                                </SliderBtnLeft>
                                <SliderBtnRight onClick={()=>CheckNumberFunction('+')}>
                                    <svg width="23" height="39" viewBox="0 0 23 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 2L20 20.125L2.00001 37" stroke="white" stroke-width="3"/>
                                    </svg>
                                </SliderBtnRight>

                            </SliderButtonContainer>
                        </GalleryContainer>
                    </ImageSliderWrapper>
                    <SliderContentWrapper>
                        <ListContainer>
                            {
                                sliderData.filter((img:any) => img.val === checkNumber[1])[0].additional.map((value:any,index:number)=>{
                                    return (  <ListItemContainer key={`${index}`}>
                                        <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.22962 16C6.21294 15.9722 6.18408 15.9249 6.15602 15.8773C5.11319 14.0974 3.94011 12.4069 2.57614 10.8479C1.95134 10.1341 1.28657 9.45848 0.54105 8.86344C0.517223 8.84421 0.494455 8.82367 0.471157 8.80365C0.0242682 8.4184 -0.159465 8.07032 0.162465 7.3661C0.487307 6.65538 1.07133 6.2106 1.82347 5.97872C2.06201 5.90515 2.29604 5.95064 2.49169 6.09076C2.70772 6.24543 2.9129 6.41908 3.10298 6.60417C4.2308 7.70222 5.18653 8.93129 5.98129 10.2812C6.00485 10.3215 6.03133 10.3603 6.05992 10.405C8.77646 5.54381 12.6902 2.02557 17.9999 0C12.61 4.3254 8.80665 9.72779 6.22962 16Z" fill="url(#paint0_linear_1_351)"/>
                                            <defs>
                                                <linearGradient id="paint0_linear_1_351" x1="-8.83673e-05" y1="8.00001" x2="18" y2="8.00001" gradientUnits="userSpaceOnUse">
                                                    <stop stop-color="#FF8C1D"/>
                                                    <stop offset="1" stop-color="#FF840D"/>
                                                </linearGradient>
                                            </defs>
                                        </svg>

                                        <div>
                                            <ListItemHeading>{value.heading}</ListItemHeading>
                                            <ListItemDescription>{value.descriptionL}</ListItemDescription>
                                        </div>
                                    </ListItemContainer>)
                                })
                            }
                        </ListContainer>
                    </SliderContentWrapper>
                </SliderRight>
            </SliderContainer>

        </SliderWrapper>
    )
}
Slider.defaultProps = {
    sliderData: [
        {val: 1, img: Image1.src ,heading:'Fun water parks and zoos' ,
            additional:[
                {
                    heading:'Slide down the biggest water slide 1', descriptionL:'A number of water slides are ready to make your day 1'
                },
                {
                    heading:'Slide down the biggest water slide 1', descriptionL:'A number of water slides are ready to make your day 1'
                },{
                    heading:'Slide down the biggest water slide 1', descriptionL:'A number of water slides are ready to make your day 1'
                }

            ]
            } ,
        {val: 2, img: Image2.src ,heading:'Relax on the finest beaches' , additional:[
                {
                    heading:'Slide down the biggest water slide 2', descriptionL:'A number of water slides are ready to make your day 2'
                },
                {
                    heading:'Slide down the biggest water slide 2', descriptionL:'A number of water slides are ready to make your day 2'
                },{
                    heading:'Slide down the biggest water slide 2', descriptionL:'A number of water slides are ready to make your day 2'
                }

            ]},
        {val: 3, img: Image3.src ,heading:' Flight + Hotel 3 nights' , additional:[
                {
                    heading:'Slide down the biggest water slide 3', descriptionL:'A number of water slides are ready to make your day 3'
                },
                {
                    heading:'Slide down the biggest water slide 3', descriptionL:'A number of water slides are ready to make your day 3'
                },{
                    heading:'Slide down the biggest water slide 3', descriptionL:'A number of water slides are ready to make your day 3'
                }

            ]}]
}



export default Slider;
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
    SliderButton
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


    return (
        <SliderWrapper>
            <SliderContainer>
                <SliderLeft >
                    <SliderBoxContainer>
                        {
                            sliderData.map((slide:any) =>  <SliderBox style={{backgroundColor: slide.val === checkNumber[1] ? 'rgba(220,107,3,0.7)' : 'rgba(255, 255, 255, 0.6)',color: slide.val === checkNumber[1] ? `${Colors.white}` : `${Colors.black}`}} >
                              <SliderBoxHeading> {sliderData[0].heading}</SliderBoxHeading>
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
                                    <ChevronLeft style={{color: Colors.white, fontSize: '52px'}}/>
                                </SliderBtnLeft>
                                <SliderBtnRight onClick={()=>CheckNumberFunction('+')}>
                                    <ChevronRight style={{color: Colors.white, fontSize: '52px'}}/>
                                </SliderBtnRight>

                            </SliderButtonContainer>
                        </GalleryContainer>
                    </ImageSliderWrapper>
                    <SliderContentWrapper>
                        <ListContainer>
                            {
                                sliderData.filter((img) => img.val === checkNumber[1])[0].additional.map((value)=>{
                                    return(  <ListItemContainer>
                                        <ListItemIcon />
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
        {val: 1, img: Image1.src ,heading:'Flight + Hotel 3 nights' ,
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
        {val: 3, img: Image3.src ,heading:'Fun water parks and zoos' , additional:[
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
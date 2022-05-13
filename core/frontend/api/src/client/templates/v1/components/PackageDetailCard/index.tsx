import {PackageDetailContainer, PackageTitle, FlightInformation, FlightInputs, FlightTakeOffIcon, FlightTakeOffInput, DropdownIcon } from  './styled';
import { Packages } from '../HomeSearch/SearchForms/Packages'
import React from "react";


const PackageDetailCard = () => {

    return(
        <PackageDetailContainer>
            <PackageTitle>Package Details</PackageTitle>
            <Packages />
           {/* <FlightInformation>
                <label>Flight information</label>
                <FlightInputs>
                    <FlightTakeOffInput>
                        <FlightTakeOffIcon />
                        <input placeholder="Bucharest"
                               style={{cursor: 'pointer'}}/>
                        <DropdownIcon />
                    </FlightTakeOffInput>
                    <input placeholder="Bucharest"
                           style={{cursor: 'pointer'}}/>
                </FlightInputs>
            </FlightInformation>*/}
        </PackageDetailContainer>
    )
}

export default PackageDetailCard;

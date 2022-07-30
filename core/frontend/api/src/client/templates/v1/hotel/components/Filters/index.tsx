import {FiltersHeader, FiltersHeaderWrapper, FiltersWrapper, ResetText} from "../../styled";
import {useTranslations} from "next-intl";
import Image from "next/image"
import FiltersArrow from "../../../assets/img/filtersArrow-icon.svg"

import {useState} from "react";

const Filters = ({setSelectedFilters, selectedFilters, filters}: any) => {

    const t = useTranslations();
    const [isOpen, setIsOpen] = useState<string[]>([])


    const handleFilterOpen = (slug: string) => {
        setIsOpen((prev: any) => {
            return prev.includes(slug) ? prev.filter((p: string) => p !== slug).filter(Boolean) : [...prev, slug]
        })
    }

    return(
        <></>
    )
}

export default Filters;
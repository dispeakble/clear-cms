import { FiltersHeader, FiltersHeaderWrapper, FiltersWrapper, ResetText } from "../../styled";
import { useTranslations } from "next-intl";
import Image from "next/image";
import FiltersArrow from "../../../assets/img/icons/filtersArrow-icon.svg";

import { useState } from "react";

const Filters = ({ setSelectedFilters, selectedFilters, filters }: any) => {

  const t = useTranslations();
  const [isOpen, setIsOpen] = useState([]);


  const handleFilterOpen = (slug: string) => {
    setIsOpen((prev: any) => {
      return prev.includes(slug) ? prev.filter((p: string) => p !== slug).filter(Boolean) : [...prev, slug];
    });
  };

  return (
    <FiltersWrapper>
      <FiltersHeaderWrapper>
        <FiltersHeader>
          {t("filters.main.title")}
        </FiltersHeader>
        <ResetText onClick={() => setSelectedFilters([])}>
          {t("filters.main.reset")}
        </ResetText>
      </FiltersHeaderWrapper>

      {
        filters &&
        filters.map((filter: any, index: number) => {
          return (
            <FiltersHeaderWrapper key={index}>
              <FiltersHeader>
                {filter.title}
              </FiltersHeader>
              <Image
                src={FiltersArrow}
                width={10}
                height={5}
                onClick={() => handleFilterOpen(filter.slug)}
                style={{
                  cursor: "pointer"
                }}
              />
            </FiltersHeaderWrapper>
          );
        })
      }
    </FiltersWrapper>
  );
};

export default Filters;
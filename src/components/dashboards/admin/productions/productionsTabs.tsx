"use client";

import { useState } from "react";

import { AttributesIcon, BrandsIcon, CategoriesIcon } from "@/icons";
import ProductionOrders from "./productionsOrders/Productions";
import Productions from "./productions/Productions";

const ProductionTabs = ({ allproductions, allproductionOrders }) => {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };
  return (
    <div className="tabs__container mt-2">
      {/* {loading && <Spinner />} */}
      <div className="tabs__bloc">
        <div
          onClick={() => toggleTab(1)}
          className={toggleState === 1 ? "tabs active__tabs" : "tabs"}>
          <CategoriesIcon className="w-6 h-6" />
          <span>Production Orders</span>
        </div>

        <div
          onClick={() => toggleTab(2)}
          className={toggleState === 2 ? "tabs active__tabs" : "tabs"}>
          <BrandsIcon className="w-6 h-6" />
          <span>Productions</span>
        </div>
      </div>

      <div className="tabs__content">
        <div
          className={
            toggleState === 1 ? "tab__content active__content" : "tab__content"
          }>
          <ProductionOrders allproductionOrders={allproductionOrders} />
        </div>

        <div
          className={
            toggleState === 2 ? "tab__content active__content" : "tab__content"
          }>
          <Productions allproductions={allproductions} />
        </div>
        {/* <div
          className={
            toggleState === 3 ? "tab__content active__content" : "tab__content"
          }>
          <Attributes allAtributes={allAttributes} />
        </div> */}
      </div>
    </div>
  );
};
export default ProductionTabs;

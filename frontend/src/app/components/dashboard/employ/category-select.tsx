import NiceSelect from "@/ui/nice-select";
import React from "react";

const CountrySelect = () => {
  const handleCountry = (item: { value: string; label: string }) => {};
  return (
    <NiceSelect
      options={[
        { value: "Medical Position", label: "Medical Position" },
        { value: "Social Care Positions", label: "Social Care Positions" },
        { value: "Social Service Positions", label: "Social Service Positions" },
      
      ]}
      defaultCurrent={0}
      onChange={(item) => handleCategory(item)}
      name="Country"
    />
  );
};

export default CountrySelect;

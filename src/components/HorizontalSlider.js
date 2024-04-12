import React, { useState } from "react";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";

const HorizontalSlider = ({ value, max }) => {
  const [sliderValue, setSliderValue] = useState(value);

  const handleChangeStart = () => {
    console.log("Change event started");
  };

  const handleChange = (value) => {
    setSliderValue(value);
  };

  const handleChangeComplete = () => {
    console.log("Change event completed");
  };

  return (
    <div className="slider w-full">
      <Slider
        min={0}
        max={max}
        value={sliderValue}
        onChangeStart={handleChangeStart}
        onChange={handleChange}
        onChangeComplete={handleChangeComplete}
      />
      {/* <div className="value">{sliderValue}</div> */}
    </div>
  );
};

export default HorizontalSlider;

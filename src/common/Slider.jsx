import { useState } from "react";
import "./Slider.css";


const Slider = (props) => {
    const {min, max, state, setState} = props;

    const handleInput = (e) => {
        setState(Number(e.target.value))
    }

    return (
        <div className="slider-container">

        <input type="range" min={min} max={max} value={state} className="slider" onInput={handleInput}/>
        <p className='slider-value'>{state}</p>
        </div>
    )
}

export default Slider
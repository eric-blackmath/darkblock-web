import React from "react";
import DiscreteSlider from '../components/slider'


function Form() {

  return (
    <form>
        <input type="file" />
        <h2>Level of Encryption</h2>
        <DiscreteSlider />
    </form>

  );
}

export default Form;

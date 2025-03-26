import React, { useState, useEffect } from "react";
import { Alert, Form, InputGroup } from "react-bootstrap";

export default function PriceRangeFilter({ onChange }) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [priceError, setPriceError] = useState()
  // Call onChange whenever either price changes.
  useEffect(() => {
    onChange({ min: minPrice, max: maxPrice });
  }, [minPrice, maxPrice, onChange]);

  const handleChange = (e) => {
    const value = Number(e.target.value)
    const name = e.target.name
    if (name == "minPrice"){
      if (value || value == 0) {
        setMinPrice(value)
      }else{
        setMinPrice(0)
      }
    }else if (name == "maxPrice"){
      if (value || value == 0) {
        setMaxPrice(value)
      }else{
        setMaxPrice(0)
      }
    }
  }

  return (
    <div>
      {/* <input

        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(Number(e.target.value))}
        placeholder="Min Price"
        style={{ marginRight: "0.5rem",marginBottom:"1rem" }}
      />
      <input
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        placeholder="Max Price"
      /> */}
      {minPrice > maxPrice ?
        <Alert key={"danger"} variant={"danger"}>
          Min. must be less than Max.
        </Alert> : ""
      }
      <InputGroup className="mb-3">
        <InputGroup.Text>Min.</InputGroup.Text>
        <InputGroup.Text>0.00</InputGroup.Text>
        <Form.Control
          aria-label="Dollar amount (with dot and two decimal places)"
          value={minPrice}
          onChange={handleChange}
          name="minPrice"
          id="minPrice"
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Max.</InputGroup.Text>
        <InputGroup.Text>10000</InputGroup.Text>
        <Form.Control
          aria-label="Dollar amount (with dot and two decimal places)"
          value={maxPrice}
          name="maxPrice"
          id="maxPrice"
        onChange={handleChange}
        />
      </InputGroup>

    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Alert, Form, InputGroup } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

export default function PriceRangeFilter({ onChange }) {
  const { t } = useTranslation();
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
      {minPrice > maxPrice ?
        <Alert key={"danger"} variant={"danger"}>
          {t('projects.filter.minPriceError')}
        </Alert> : ""
      }
      <InputGroup className="mb-3">
        <InputGroup.Text>{t('projects.filter.minPrice')}</InputGroup.Text>
        <Form.Control
          aria-label={t('projects.filter.minPrice')}
          value={minPrice}
          onChange={handleChange}
          name="minPrice"
          id="minPrice"
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>{t('projects.filter.maxPrice')}</InputGroup.Text>
        <Form.Control
          aria-label={t('projects.filter.maxPrice')}
          value={maxPrice}
          name="maxPrice"
          id="maxPrice"
          onChange={handleChange}
        />
      </InputGroup>
    </div>
  );
}
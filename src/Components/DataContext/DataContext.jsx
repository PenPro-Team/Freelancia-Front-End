import React, { createContext, useContext } from "react";

const DataContext = createContext([]);

export const DataProvider = ({ children, data }) => {
  return (
    <DataContext.Provider value={data || []}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

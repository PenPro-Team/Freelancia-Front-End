// react-redux redux 

import { createStore } from "redux";
// import languageReducer from "./LanguageReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import CombineReducers from "./Reducers/CombineReducers";


const FrelanciaStore = createStore(CombineReducers, composeWithDevTools())

export default FrelanciaStore
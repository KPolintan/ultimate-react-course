import React from 'react';
import { useState } from "react";
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
import StarRating from './StarRating';

const Test = () => {
  const [movieRating, setMovieRating] = useState(0);

  return ( 
    <div>
      <StarRating color='blue' maxRating={10} onSetRating={setMovieRating} />
      <p> This movie was rated: {movieRating} </p>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']} />
    <StarRating maxRating={20} />
    <StarRating size={24} color='blue' className='' defaultRating={3} />
    <Test />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

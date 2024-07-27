import React, { useState } from 'react'
import './quiz.css'
import { data } from '../../assets/data';

const quiz = () => {

  let [index, setIndex] = useState(0);
  let [question, setQuestion] = useState(data[index]);

  return(
    <div className='container'>
      <h1>Quiz App</h1>
      <hr />
      <h2>{index+1}. {question.question}</h2>
      <ul>
        <li>{question.option1}</li>
        <li>{question.option2}</li>
        <li>{question.option3}</li>
        <li>{question.option4}</li>
      </ul>
      <button>Next</button>
      <div className="index">1 of 5 question</div>
    </div>
  )
}

export default quiz
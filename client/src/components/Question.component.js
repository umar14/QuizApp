import React, { Fragment, useEffect, useState } from "react";
import styles from "../componentsStyles/Question.module.css";
import TestNav from "./TestNav.component";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Question(props) {
  let history = useHistory();
  const res = props.location.state.res;
  const mins = res.time.split(":")[0];
  const secs = res.time.split(":")[1] ? res.time.split(":")[1] : 0;
  const length = res.results.length;
  const [ques, setques] = useState(0);
  const [options, setoptions] = useState([]);
  const [question, setquestion] = useState("");
  const [answers, setanswers] = useState({});

  const submithandler = () => {
    console.log(answers);
    let name = localStorage.getItem("name");
    let email = localStorage.getItem("email");
    let pin = localStorage.getItem("pin");

    let score = 0;
    for (let i = 0; i < length; i++) {
      if (answers[i] == res.results[i].correct_answer) {
        score += 1;
      }
    }
    // score = (score / length) * 100;
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        "/api/test/submittest",
        {
          pin,
          email,
          name,
          score,
        },
        options
      )
      .then((res) => {
        console.log("Score:", res);
        history.push("/");
      })
      .catch((err) => console.log(err));
    console.log(score);
  };

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      // Generate random number
      var j = Math.floor(Math.random() * (i + 1));

      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  useEffect(() => {
    for (let i = 0; i < length; i++) {
      res.results[i].question = res.results[i].question.replace(
        /&#?\w+;/g,
        (match) => entities[match]
      );
      res.results[i].correct_answer = res.results[i].correct_answer.replace(
        /&#?\w+;/g,
        (match) => entities[match]
      );
      res.results[ques].incorrect_answers = res.results[
        ques
      ].incorrect_answers.map((x) =>
        x.replace(/&#?\w+;/g, (match) => entities[match])
      );
    }
  }, []);

  useEffect(() => {
    setquestion(res.results[ques].question);
    setoptions([
      res.results[ques].correct_answer,
      ...res.results[ques].incorrect_answers,
    ]);
    shuffleArray(options);
  }, [ques]);

  const entities = {
    "&#039;": "'",
    "&quot;": '"',
    "&lt;": "<",
    "&gt;": ">",
    "&#39;": "'",
    "&#34;": "'",
    "&#034;": '"',
    "&#60;": "<",
    "&#060;": "<",
    "&#62;": ">",
    "&#062;": ">",
    "&amp;": "&",
    "&#38;": "&",
    "&#038;": "&",
  };

  const changeclass = (e) => {
    var p = e.currentTarget.parentElement.childNodes;
    for (var i = 0; i < p.length; i++) {
      if (p[i].childNodes[0].value == e.currentTarget.childNodes[0].value) {
        p[i].className = styles.containeractive;
      } else {
        p[i].className = styles.container;
      }
    }

    var ans = e.currentTarget.childNodes[0].value;
    setanswers({ ...answers, [ques]: ans });
  };


  return (
    <Fragment>
      {/* mins={mins} secs={secs} */}
      <TestNav submithandler={submithandler} />
      <div className={styles.container}>
        Total Questions : {length}          
      </div>
      <div className={styles.qcontainer}>
        {ques + 1}. {question}
      </div>
      <div id="options">
        {options.map((option, index) => (          
          <div key={index} className={answers[ques] == option ? styles.containeractive : styles.container} onClick={changeclass}>
            <input
              className={styles.radios}
              type="radio"
              value={option}
              name="options"
              id={index.toString()}
            />
            <label htmlFor={index.toString()}>
              {String.fromCharCode("A".charCodeAt(0) + index)}. {option}
            </label>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <a
          onClick={(e) => {
            if (ques == 0) {
            } else {
              setques(ques - 1);
            }
          }}
          // className={styles.buttons1}
          className={ques == 0 ? styles.buttonhide : styles.buttons1 }
        >
          &#8249;
        </a>
        <a
          onClick={(e) => {
            if (ques == length - 1) {
            } else {
              setques(ques + 1);
            }
          }}
          // className={styles.buttons2}
          className={ques == length - 1 ? styles.buttonhide : styles.buttons2 }
        >
          &#8250;
        </a>
      </div>
    </Fragment>
  );
}

export default Question;

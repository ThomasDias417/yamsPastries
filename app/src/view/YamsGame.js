import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { decodeToken, isExpired } from "react-jwt";
import styles from "./../css/yummyGame.module.css";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, deleteUser } from "../redux/features/User";
import Fireworks from "@fireworks-js/react";

const YummyGame = () => {
  // Store
  const userInfo = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  let token = "";

  if (userInfo != null) {
    token = userInfo.token;
  } else {
    token = null;
    window.location.href = "/";
  }

  const [userName, setUserName] = useState("");
  const [dices, setDices] = useState([0, 0, 0, 0, 0]);
  const [message, setMessage] = useState("");
  const [playButtonVisible, setPlayButtonVisible] = useState(true);

  const [showWinnerDiv, setShowWinnerDiv] = useState(false);

  useEffect(() => {
    

    const fetchData = async () => {
      let isTokenExpired = isExpired(token);
      console.log("Token expired : " + isTokenExpired);
      let user = await decodeToken(token);
      console.log("user name : " + user.name);
      if (!user) {
        dispatch(deleteUser());
        console.log("No more user in the storage");
      } else {
        setUserName(user.name);
        fetchChancesLeft(user.email);
      }
    };
    fetchData();
  }, []);

  
  async function fetchChancesLeft(email) {
    try {
      const response = await fetch(
        `http://localhost:3001/chances-left/${email}`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        dispatch(updateUser({ field: "chancesLeft", value: data }));
        console.log("Chances left:", data);
        setMessage(
          data <= 0
            ? "Tu as déjà lancé les dés 3 fois."
            : `A toi de jouer ${userInfo.username} ! Tu peux lancer les dés encore ${data} fois pour tenter de remporter des pâtisseries.`
        );
      } else {
        console.error("Failed to fetch chances left:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching chances left:", error);
    }
  }

  function Dice(props) {
    const faces = [
      props.value,
      ...gsap.utils.shuffle(
        [1, 2, 3, 4, 5, 6].filter((v) => v !== props.value)
      ),
    ];

    const dice = useRef();
    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        gsap.from(dice.current, {
          rotationX: "random(720, 1080)",
          rotationY: "random(720, 1080)",
          rotationZ: 0,
          duration: "random(2, 3)",
        });
      }, dice);
      return () => ctx.revert();
    }, [props.value]);

    return (
      <div className={styles.dice_container}>
        <div className={styles.dice} ref={dice}>
          {faces.map((value) => (
            <div className={styles.face}>{value}</div>
          ))}
        </div>
      </div>
    );
  }

  async function rollDices(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:3001/rolling-dices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      let data = await response.json();
      if (data.chancesLeft === 0) {
        console.error("Cannot roll dices more than 3 times:", data);
      }
      if (data.numberOfPastriesWon !== 0) {
        dispatch(
          updateUser({
            field: "numberOfPastriesWon",
            value: data.numberOfPastriesWon,
          })
        );
        dispatch(updateUser({ field: "winningDate", value: new Date() }));
        dispatch(updateUser({ field: "winner", value: true }));
        dispatch(updateUser({ field: "chancesLeft", value: data.chancesLeft }));
        // play_button & confetti
        setPlayButtonVisible(false);
        setTimeout(() => {
          setShowWinnerDiv(true);
        }, 3400);

        gsap.to(".component", {
          duration: 8,
          opacity: 0,
          onComplete: () => {
            navigate("/patisserie_selection");
          },
        });
      } else {
        dispatch(updateUser({ field: "chancesLeft", value: data.chancesLeft }));
        setMessage(
          data.chancesLeft === 0
            ? "vous n'avez plus d'essai"
            : "jouer, il reste : " + data.chancesLeft + "chance"
        );
      }

      setDices(data.dices);
    } else {
      const errorResponse = await response.json();
      console.error(errorResponse);
      alert("connection expiré");
      navigate("/connexion");
    }
  }

  return (
    <div className={styles.main}>
        {showWinnerDiv &&(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          height: "100vh",
          overflow: "hidden",
          width: "100vw",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: "10",
          background: "#051D39C8",
          backdropFilter: "blur(9px)",
        }}
      >
        <div
          style={{
            display: "flex",

            borderRadius: "10px",
            padding: "20px",

            flexDirection: "column",
            minHeight: "200px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
            <Fireworks width="100%" height="100%" />
          <p
            style={{
              fontSize: "30px",
              color: "#FFFFFF",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            vous avez gagner
          </p>
        </div>
      </div>
      )}

      <h1> Lancez les dés ! </h1>
      {userName && message && <p className={styles.message}>{message}</p>}
      {dices.map((dice, index) => (
        <Dice key={gsap.utils.random()} value={dice} />
      ))}

      <div className={styles.actions}>
        {playButtonVisible && (
          <button className={styles.play_button} onClick={rollDices}>
            PLAY
          </button>
        )}
      </div>
    </div>
  );
};

export default YummyGame;

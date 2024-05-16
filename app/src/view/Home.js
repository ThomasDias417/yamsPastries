import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import styles from './../css/home.module.css';

function Home() {

    const navigate = useNavigate();

    function userLogin() {
        navigate('/inscription');
    }

    function play() {
        navigate('/yummy-game');
    }

    function goToWinnerPage() {
        navigate('/liste_des_gagnants');
    }

    const [pictures, setPictures] = useState([]);
    const [isTheGameOver, setIsTheGameOver] = useState();
    const [isUserConnected, setIsUserConnected] = useState();

    useEffect(() => {
        fetch("http://localhost:3001/pastries-img")
        .then(res => res.json())
        .then(
            (result) => {
                setPictures(result);
            }
        );

        fetch("http://localhost:3001/pastries-left")
        .then(res => res.json())
        .then(
            (pastriesLeft) => {
                if (pastriesLeft > 0) {
                    setIsTheGameOver(false);
                } else {
                    setIsTheGameOver(true);
                }
            }
        );

        if (localStorage.hasOwnProperty('token')) {
            setIsUserConnected(true);
        } else {
            setIsUserConnected(false);
        }

    }, []);

    return (
        <div className={styles.container}>
            {isTheGameOver ? (
                <div className={styles.game_over}>
                    <h1>Le jeu est terminé 🥲</h1>
                    <button className={styles.button} onClick={goToWinnerPage}>Voir les gagnants</button>
                </div>
            ) : (
                <div className={styles.main}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        width : "--webkit-fill-available",

                        gap: "10px"
                    }}>
                    <h1 style={{
                        margin: "0px"
                    }}>Bienvenue à Yummy Game !<span className={styles.username}>@Thomas</span></h1>
                    <p>Participez et tentez de remporter de délicieuses pâtisseries !</p>

                    </div>
                    {isUserConnected ? (
                        <div className={styles.buttons}>
                            <button className={styles.button} onClick={play}>Jouer</button>
                        </div>
                    ) : (
                        <div className={styles.connexion}>
                            <p>Pour jouer, tu doit te connecter !</p>
                            <div  className={styles.buttons}>
                                <button style={{
                                    margin : "0px"
                                }} className={styles.button} onClick={userLogin}>Créer un compte</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Home;
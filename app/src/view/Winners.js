import React, { useState, useEffect } from 'react';
import styles from './../css/winners.module.css';

function Winners() {
    const [winners, setWinners] = useState([]);
    console.log(winners);

    useEffect(() => {
        fetch("http://localhost:3001/winners")
            .then(res => res.json())
            .then((result) => {
                setWinners(result);
            });
    }, []);

    function formatDate(dateOfwinning) {
        const dateObj = new Date(dateOfwinning);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return dateObj.toLocaleDateString('fr-FR', options);
    }

    function formatTime(dateOfwinning) {
        const dateObj = new Date(dateOfwinning);
        return dateObj.toTimeString().slice(0, 8);
    }

    return (
        <div className={styles.main}>
            <h1>🏆 Liste des Gagnants 🏆</h1>
            {winners.length > 0 && (
                <section className={styles.winners}>
                    <div className={`${styles.winnerCard} ${styles.winnerTitle}`}>
                        <p>Gagnant</p>
                        <p>Date</p>
                        <p>Heure</p>
                        <p>Gains</p>
                    </div>
                    {winners.map((item, index) => (
                        <div key={index} className={`${styles.winnerCard} ${styles.winnerCardOnly}`}>
                            <p>{item.userName}</p>
                            <p>{formatDate(item.date)}</p>
                            <p>{formatTime(item.date)}</p>
                            <div>
                                {item.pastries.map((picture, i) => (
                                    <img key={i} src={`/images/pastries/${picture.image}`} alt="pastries" />
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            )}
            <section>
                <h2>Podium</h2>
                <p>🥇 Premier</p>
                <p>🥈 Deuxième</p>
                <p>🥉 Troisième</p>
            </section>
        </div>
    );
}

export default Winners
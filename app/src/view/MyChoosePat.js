import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/features/User';
import styles from './../css/choosePastries.module.css';

function MyChoosePat() {
    const userInfo = useSelector((state) => state.user.value);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [warningMessage, setWarningMessage] = useState([]);
    const [pastries, setPastries] = useState([]);
    const [pastriesChoosed, setPastriesChoosed] = useState([]);

    useEffect(() => {
        dispatch(updateUser({ field: 'numberOfPastriesChooseable', value: userInfo.numberOfPastriesWon }));

        fetch("http://localhost:3001/patisserie-manquante")
        .then(res => res.json())
        .then((stock) => {
            if (stock.length < userInfo.numberOfPastriesWon) {
                dispatch(updateUser({ field: 'numberOfPastriesWon', value: stock.length }));
            }
            setPastries(stock);
        });
    }, [userInfo.numberOfPastriesWon, dispatch]);

    function addSelectedPastry(item) {
        let numberOfPastriesChooseable = userInfo.numberOfPastriesChooseable;

        if (numberOfPastriesChooseable > 0) {
            item.stock--;
            const updatedPastries = pastries.filter(p => p.stock > 0);
            setPastries(updatedPastries);
            setPastriesChoosed([...pastriesChoosed, item]);
            numberOfPastriesChooseable--;
            dispatch(updateUser({ field: 'numberOfPastriesChooseable', value: numberOfPastriesChooseable }));
        } else {
            setWarningMessage("Tu as gagner  " + userInfo.numberOfPastriesWon + " patiserie");
        }
    }

    function confirmSelection() {
        setWarningMessage("");
        if (pastriesChoosed.length < userInfo.numberOfPastriesWon && pastries.length > 0) {
            setWarningMessage("il reste " + (userInfo.numberOfPastriesWon - pastriesChoosed.length)+ " choix");
        } else {
            fetch("http://localhost:3001/patisserie-choix", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    pastriesChoosed,
                    winningDate: userInfo.winningDate,
                    numberOfPastriesWon: pastriesChoosed.length,
                }),
            }).then(() => {
                dispatch(updateUser({ field: 'numberOfPastriesChooseable', value: 0 }));
                alert('VALIDE');
                navigate('/liste_des_gagnants');
            });
        }
    }

    return (
        <div className={styles.main}>
            <p>Tu peut maintenant choisir {userInfo.numberOfPastriesWon} pâtisseries.</p>
            {pastries.length > 0 && (
                <div className={styles.pastriesContainer}>
                    {pastries.map((item) => (
                        <div key={item.id} className={styles.pastryItem} onClick={() => addSelectedPastry(item)}>
                            <img src={`/images/pastries/${item.image}`} alt={item.name} />
                            <p>{item.name}</p>
                        </div>
                    ))}
                </div>
            )}
            <p className={styles.warningMessage}>{warningMessage}</p>
            
            <div className={styles.pastriesChoosedContainer}>
                {pastriesChoosed.map((item, index) => (
                    <img key={index} src={`/images/pastries/${item.image}`} alt={item.name} className={styles.pastrySelected} />
                ))}
            </div>
            <button className={styles.confirmButton} onClick={confirmSelection}>Choisir</button>
        </div>
    );
}

export default MyChoosePat;
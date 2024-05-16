import React , { useState, useEffect }from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/features/User';
import styles from './../css/choosePastries.module.css';

function ChoosePastries() {
    const userInfo = useSelector((state) => state.user.value)
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const [warningMessage, setWarningMessage] = useState([]);
    const [pastries, setPastries] = useState([]);
    const [pastriesChoosed, setPastriesChoosed] = useState([]);

    useEffect(() => {

        dispatch(updateUser({ field: 'numberOfPastriesChooseable', value: userInfo.numberOfPastriesWon }))

        fetch("http://localhost:3001/patisserie-manquante")
        .then(res => res.json())
        .then(
            (stock) => {
                if (stock.length < userInfo.numberOfPastriesWon) {
                    dispatch(updateUser({ field: 'numberOfPastriesWon', value: stock.length }));
                }
                setPastries(stock)
            }
        )
    }, []);


    function addSelectedPastry(item) {
        let numberOfPastriesChooseable = userInfo.numberOfPastriesChooseable

        if (numberOfPastriesChooseable > 0) {
            let pastriesChoosedContainer = document.querySelector('.pastries_choosed')
            const pastry = document.createElement("img")
            pastry.src = `/images/pastries/${item.image}`
            pastry.alt = item.image
            pastry.style.width = '15vw';
            pastry.style.aspectRatio = '1';
            pastry.style.margin = '5px';
            pastry.style.borderRadius = '5px';
    
           
            item.stock--
            const updatedPastries = pastries.filter(p => p.stock > 0);
            setPastries(updatedPastries);
    
        
            pastriesChoosedContainer.appendChild(pastry)
            const updatedPastriesChoosed = [...pastriesChoosed, item];
            setPastriesChoosed(updatedPastriesChoosed);
            console.log(pastriesChoosed)

            numberOfPastriesChooseable--
            dispatch(updateUser({ field: 'numberOfPastriesChooseable', value: numberOfPastriesChooseable }))

        } else {
            setWarningMessage("Tu ne peux pas choisir plus que " + userInfo.numberOfPastriesWon)
        }
    }


    function confirmSelection(pastriesChoosed) {
        setWarningMessage("")
        let pastriesChoosedContainer = document.querySelector('.pastries_choosed')
        if (pastriesChoosedContainer.childElementCount < userInfo.numberOfPastriesWon && pastries.length > 0) {
            setWarningMessage("tu peux encore en choisir " + (userInfo.numberOfPastriesWon - pastriesChoosedContainer.childElementCount))
        } else {
            fetch("http://localhost:3001/patisserie-choix", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    pastriesChoosed: pastriesChoosed,
                    winningDate: userInfo.winningDate,
                    numberOfPastriesWon: pastriesChoosedContainer.childElementCount,
                }),
            })
            dispatch(updateUser({ field: 'numberOfPastriesChooseable', value: 0 }))
            alert('Choix validé !')
            navigate('/')
        }
        
    }


    return(
        <div className={styles.main}>

            {<p>Bravo !!! Tu peux choisir {userInfo.numberOfPastriesWon} pâtisseries.</p>}
            {pastries.length > 0 && (
            <div className={styles.pastries_container}>
                {pastries.map((item) => (
                    <img key={item} src={`/images/pastries/${item.image}`} alt={item.image} onClick={() => addSelectedPastry(item)} />
                ))}
            </div>
            )}
            <p className={styles.warning_message}>{warningMessage}</p>
            <p>pâtisseries choisies : </p>
            <div className="pastries_choosed"></div>
            <button onClick={() => confirmSelection(pastriesChoosed)}>Choisir</button>
        </div>
    );
}

export default ChoosePastries;
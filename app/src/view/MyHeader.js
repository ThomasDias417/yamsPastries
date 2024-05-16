import React from "react";
import styles from "./../css/myHeader.module.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../redux/features/User";

const MyHeader = () => {
  const userInfo = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  function home() {
    window.location.href = "/";
  }

  function deconnexion() {
    localStorage.removeItem("token");
    const email = localStorage.getItem("email");
    dispatch(deleteUser({ email: email }));
    window.location.href = "/";
  }

  return (
    <div className={styles.main}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          minWidth: "85vw",
          width: "-webkit-fill-available",
          padding: "10px",
        }}
      >
        <button
          style={{
            fontSize: "35px",
            border: "none",
            color: "rgb(33 150 243)",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            width: "300px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          className={styles.home}
          onClick={home}
        >
          YummyGame 🍰
        </button>

        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            flexDirection: "row",
        }}>
          
           
            <button  className={styles.seeWinners} onClick={()=>{
                window.location.href = "/liste_des_gagnants";
            }}>Liste des gagnants</button>
          

          {userInfo == null && (
            <button
              className={styles.connexionBtn}
              onClick={() => {
                window.location.href = "/connexion";
              }}
            >
              Connexion
            </button>
          )}

          {userInfo != null && (
            <button className={styles.deconnexionBtn} onClick={deconnexion}>
              Deconnexion
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyHeader;

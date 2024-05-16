import { useState } from 'react';
import styles from './../css/myLoginPage.module.css';
import { useDispatch } from "react-redux";
import { addUser } from '../redux/features/User';

const MyLoginPage = () => {
  // Store
  const dispatch = useDispatch()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function loginUser(event) {
    event.preventDefault();
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.user) {
      localStorage.setItem('token', data.user);
      dispatch(addUser({ email: email, username: data.username, token: data.user }));
      alert('Connecté');
      window.location.href = '/yummy-game';
    } else {
      alert('erreur username/password');
    }
    console.log(data);
  }

  return (
    <div className={styles.container}>
      <div className={styles.flexRow}>
        <div className={styles.imageSection}></div>
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <h1 className={styles.title}>Se connecter</h1>
            <form onSubmit={loginUser}>
              <input
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
              />
              <input
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Mot de passe"
              />
              <button className={styles.button} type="submit">Connexion</button>
            </form>
            <p className={styles.switchText}>
              Nouveau ici ? <a className={styles.link} href="/inscription">Créer un compte</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyLoginPage;
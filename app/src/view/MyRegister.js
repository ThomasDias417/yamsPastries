import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './../css/myLoginPage.module.css';

const MyRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  async function registerUser(event) {
    event.preventDefault();
    const response = await fetch('http://localhost:3001/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();
    if (data.status === 'ok') {
      navigate('/connexion');
    } else {
      alert('Cette Adresse email existe déjà !');
    }
    console.log(data);
  }

  return (
    <div className={styles.container}>
      <div className={styles.flexRow}>
        <div className={styles.imageSection}></div>
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <h1 className={styles.title}>Créez votre compte</h1>
            <p className={styles.subtitle}>Rejoignez-nous et vivez une expérience incroyable</p>
            <form onSubmit={registerUser}>
              <input
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Nom"
              />
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
              <button className={styles.button} type="submit">Créer un compte</button>
            </form>
            <p className={styles.switchText}>
              Déjà membre ? <a className={styles.link} href="/connexion">Connexion</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyRegister;
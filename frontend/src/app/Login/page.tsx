import styles from './login.module.css';

export default function LoginPage() {
   return (
      <div className={styles.container}>
         <h1 className={styles.title}>Login Page</h1>
         <form className={styles.form}>
            <input type="text" placeholder="Username" className={styles.input} />
            <input type="password" placeholder="Password" className={styles.input} />
            <button type="submit" className={styles.button}>Login</button>
            <a href="http://localhost:5001/auth/google">
               <button className={styles.googleButton}>Click here to login with Google</button>
            </a>
         </form>
      </div>
   )
};
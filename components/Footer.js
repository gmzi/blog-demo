import styles from '/styles/Home.module.css'

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>Find me on</p>
            <a
                href="https://www.youtube.com/channel/UC2vhalQV2p2CrhTwxycAgvw"
                target="_blank"
                rel="noopener noreferrer"
            >
                youtube
            </a>
            <a
                href="https://www.instagram.com/sebastian.bauer"
                target="_blank"
                rel="noopener noreferrer"
            >
                instagram
            </a>
            <a
                href="https://www.facebook.com/sebastian.bauer.980"
                target="_blank"
                rel="noopener noreferrer"
            >
                facebook
            </a>
        </footer>
    )
}

export default Footer;
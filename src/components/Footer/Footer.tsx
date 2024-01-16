import './Footer.scss';
import DiscordImage from '../../assets/images/discord.png';
import InstagramImage from '../../assets/images/instagram.png';
import TwitterImage from '../../assets/images/twitter.png';
import FacebookImage from '../../assets/images/facebook.png';
import FooterLogoImage from '../../assets/images/footer-logo.png';

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-container">
                <div className="footer-logo">
                    <img src={FooterLogoImage} />
                </div>
                <div className="footer-content">
                    <div className="footer-content-condition">
                        <div className="footer-content-condition-copyright">© 2021 Axis Circle LLC</div>
                        <div className="footer-content-condition-terms">SSS Terms & Conditions</div>
                    </div>
                    <div className="footer-content-socials">
                        <div className="footer-content-socials-link">
                            <a href="https://discord.gg/surfsharksociety">
                                <img src={DiscordImage} />
                            </a>
                        </div>
                        <div className="footer-content-socials-link">
                            <a href="https://www.instagram.com/surfsharksociety">
                                <img src={InstagramImage} />
                            </a>
                        </div>
                        <div className="footer-content-socials-link">
                            <a href="https://twitter.com/surfsharksoc">
                                <img src={TwitterImage} />
                            </a>
                        </div>
                        <div className="footer-content-socials-link">
                            <a href="https://www.facebook.com/SURFSHARKSOCIETY">
                                <img src={FacebookImage} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
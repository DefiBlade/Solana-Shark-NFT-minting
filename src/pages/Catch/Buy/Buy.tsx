import './Buy.scss';
import Header from '../../../components/Header/Header';
import DiscordImage from '../../../assets/images/discord.png';
import InstagramImage from '../../../assets/images/instagram.png';
import TwitterImage from '../../../assets/images/twitter.png';
import FacebookImage from '../../../assets/images/facebook.png';

const Buy = () => {

    return (
        <div className="buy">
            <div className="buy-container">
                <Header />
                <div className="buy-title">
                    Catch the <span className="buy-title-highlight">Wave</span>
                </div>
                <div className="buy-controls">
                    <div className="buy-now">Buy now</div>
                    <div className="buy-how">How to buy</div>
                </div>
                <div className="buy-label">Surf'sup a part of our society</div>
                <div className="buy-socials">
                    <div className="buy-socials-link">
                        <a href="https://discord.gg/surfsharksociety">
                            <img src={DiscordImage} />
                        </a>
                    </div>
                    <div className="buy-socials-link">
                        <a href="https://www.instagram.com/surfsharksociety">
                            <img src={InstagramImage} />
                        </a>
                    </div>
                    <div className="buy-socials-link">
                        <a href="https://twitter.com/surfsharksoc">
                            <img src={TwitterImage} />
                        </a>
                    </div>
                    <div className="buy-socials-link">
                        <a href="https://www.facebook.com/SURFSHARKSOCIETY">
                            <img src={FacebookImage} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Buy;

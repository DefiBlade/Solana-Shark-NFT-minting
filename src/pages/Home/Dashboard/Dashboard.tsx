import './Dashboard.scss';
import ClueImage from '../../../assets/images/clue.png';
import DiscordImage from '../../../assets/images/discord.png';
import InstagramImage from '../../../assets/images/instagram.png';
import TwitterImage from '../../../assets/images/twitter.png';
import FacebookImage from '../../../assets/images/facebook.png';
import Shark3Image from '../../../assets/images/shark3.png';
import LeafImage from '../../../assets/images/leaf.png';
import Header from '../../../components/Header/Header';

import { WalletDialogButton } from '@solana/wallet-adapter-material-ui';
import styled from 'styled-components';
const ConnectButton = styled(WalletDialogButton)`
  font-size: 16px;
`;

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="dashboard-container">
                <Header />
                <div className="dashboard-title-back">SURF</div>
                <div className="dashboard-content">
                    <div className="dashboard-content-top-leaf">
                        <img src={LeafImage} />
                    </div>
                    <div className="dashboard-mint-title">
                        Salutations,<br />
                        Surf <span className="dashboard-mint-highlight">Shark</span><br />
                        Society!<br />
                    </div>
                    <div className="dashboard-mint-control">
                        <ConnectButton className="dashboard-mint-button">Connect Wallet</ConnectButton>
                        <div className="dashboard-mint-caption">9 Days 17Hrs 55Min</div>
                    </div>
                </div>
                <div className="dashboard-title-back-bottom"><div className="content">Shark</div></div>
                <div className="dashboard-socials">
                    <div className="dashboard-socials-link">
                        <a href="https://discord.gg/surfsharksociety">
                            <img src={DiscordImage} />
                        </a>
                    </div>
                    <div className="dashboard-socials-link">
                        <a href="https://www.instagram.com/surfsharksociety">
                            <img src={InstagramImage} />
                        </a>
                    </div>
                    <div className="dashboard-socials-link">
                        <a href="https://twitter.com/surfsharksoc">
                            <img src={TwitterImage} />
                        </a>
                    </div>
                    <div className="dashboard-socials-link">
                        <a href="https://www.facebook.com/SURFSHARKSOCIETY">
                            <img src={FacebookImage} />
                        </a>
                    </div>
                    <div className="dashboard-socials-leaf">
                        <img src={LeafImage} />
                    </div>
                </div>
                <div className="dashboard-shark">
                    <img src={Shark3Image} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
import './Perks.scss';
import ExclusivityImage from '../../../assets/images/exclusivity.png';
import MemebershipImage from '../../../assets/images/membership.png';
import P2eImage from '../../../assets/images/p2e.png';
import ClueImage from '../../../assets/images/clue.png';
import LightImage from '../../../assets/images/light.png';
import Back1Image from '../../../assets/images/back1.png';

const perks = [
    {
        image: ExclusivityImage,
        title: 'Exclusivity',
        content: 'Surf Shark Society is a collection of 3333 unique Shark NFTs, which are digital collectibles on board the Solana network.'
    },
    {
        image: MemebershipImage,
        title: 'Membership',
        content: 'Gain access to an exclusive crypto community (Shark Shack) that will allow you to converse with other NFT holders, and receive trading calls and giveaways.'
    },
    {
        image: P2eImage,
        title: 'P2e',
        content: 'Get an early ticket to our future blockchain game, which will feature our very own cryptocurrency (Sharkoin) as a reward system.'
    }
]

const Perks = () => {
    return (
        <div className="perks" id="perks">
            <div className="perks-title-back"><div className="content">Collection</div></div>
            <div className="perks-container">
                <div className="perks-header">
                    <div className="perks-header-light">
                        <img src={LightImage} />
                    </div>
                    <div className="perks-header-title">Perks</div>
                    <div className="perks-header-light">
                        <img src={LightImage} />
                    </div>
                </div>
                {/* <div className="perks-back1">
                    <img src={Back1Image} />
                </div> */}
                <div className="perks-cards">
                    {perks.map( (ele, key) =>
                    <div className="perks-card" key={key}>
                        <div className="perks-card-image">
                            <img src={ele.image} />
                        </div>
                        <div className="perks-card-title">
                            {ele.title}
                        </div>
                        {/* <div className="perks-card-clue">
                            <img src={ClueImage} />
                        </div> */}
                        <div className="perks-card-content">
                            {ele.content}
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Perks;
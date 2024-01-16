import './Roadmap.scss';
import ClueImage from '../../../assets/images/clue.png';
import RoadmapImage from '../../../assets/images/roadmap.png';
import CircleImage from '../../../assets/images/circle.png';
import Back2Image from '../../../assets/images/back2.png';
import Back3Image from '../../../assets/images/back3.png';
import LeafImage from '../../../assets/images/leaf.png';

const roadmap = [
    {
        title: 'Wave 1',
        content: 'Whitelisted members of our discord server will be able to buy Surf Shark NFTs for a discounted price of 1 Solana.'
    },
    {
        title: 'Wave 2',
        content: 'Full release of NFTs, non-whitelisted people on the server will now be able to purchase or mint these Sharks for 1.2 Solana'
    },
    {
        title: 'Wave 3',
        content: 'Launch the Home for our very own Shark Holders which will grant them access to a exclusive cryptocurrency club (Shark Shack) where there will be giveaways, cryptocurrency calls, and more.'
    },
    {
        title: 'Wave 4',
        content: 'Start partnerships with brands that will allow Surf Shark Society Holders to receive discounts and cash rebates.'
    },
    {
        title: 'Wave 5',
        content: 'Develop and launch our very own cryptocurrency (Sharkoin) to be used as the reward system token for our blockchain game (Shark Society)'
    },
    {
        title: 'Wave 6',
        content: 'Develop a Play to earn blockchain game (Shark Society) where sharks will fight against each other in different minigames in exchange for our future cryptocurrency (Sharkoin)'
    }
]

const Roadmap = () => {
    return (
        <div className="roadmap" id="roadmap">
            <div className="roadmap-container">
                <div className="roadmap-title-back">Nft</div>
                <div className="roadmap-header">
                    <div className="roadmap-title">Roadmap</div>
                    <div className="roadmap-header-image">
                        <img src={RoadmapImage} />
                    </div>
                </div>
                <div className="roadmap-back2">
                    <img src={Back2Image} />
                </div>
                <div className="roadmap-back3">
                    <img src={Back3Image} />
                </div>
                <div className="roadmap-leaf">
                    <img src={LeafImage} />
                </div>
                <div className="roadmap-rows">
                    {roadmap.map( (ele, key) => 
                    <div className="roadmap-row" key={key}>
                        <div className="roadmap-item">
                            <div className="roadmap-item-circle">
                                {/* <img src={CircleImage} /> */}
                            </div>
                            <div className="roadmap-item-line"></div>
                            <div className="roadmap-item-title">{ele.title}</div>
                            <div className="roadmap-item-image">
                                <img src={ClueImage} />
                            </div>
                            <div className="roadmap-item-content">{ele.content}</div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Roadmap;
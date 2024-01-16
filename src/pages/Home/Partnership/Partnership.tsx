import './Partnership.scss';
import ClueImage from '../../../assets/images/clue.png';
import Back4Image from '../../../assets/images/back4.png';
import CircleImage from '../../../assets/images/circle-back.png';
import LeafImage from '../../../assets/images/leaf.png';
import partnership1 from '../../../assets/images/partnership/1.png';
import partnership2 from '../../../assets/images/partnership/2.png';
import partnership3 from '../../../assets/images/partnership/3.png';
import partnership4 from '../../../assets/images/partnership/4.png';
import partnership5 from '../../../assets/images/partnership/5.png';
import partnership6 from '../../../assets/images/partnership/6.png';
import partnership7 from '../../../assets/images/partnership/7.png';
import partnership8 from '../../../assets/images/partnership/8.png';
import partnership9 from '../../../assets/images/partnership/9.png';
import partnership10 from '../../../assets/images/partnership/10.png';
import partnership11 from '../../../assets/images/partnership/11.png';
import partnership12 from '../../../assets/images/partnership/12.png';

const partnershipImages: string[] = [];

partnershipImages.push(partnership1);
partnershipImages.push(partnership2);
partnershipImages.push(partnership3);
partnershipImages.push(partnership4);
partnershipImages.push(partnership5);
partnershipImages.push(partnership6);
partnershipImages.push(partnership7);
partnershipImages.push(partnership8);
partnershipImages.push(partnership9);
partnershipImages.push(partnership10);
partnershipImages.push(partnership11);
partnershipImages.push(partnership12);


const Partnership = () => {
    return (
        <div className="partnership" id="partners">
            <div className="partnership-container">
                <div className="partnership-title-back"><div className="content">Community</div></div>
                <div className="partnership-header">
                    <div className="partnership-header-title">Partnership</div>
                    <div className="partnership-header-label">In partnership with the biggest names in the crypto space.</div>
                </div>
                <div className="partnership-back4">
                    <img src={Back4Image} />
                </div>
                <div className="partnership-back-circle">
                    <img src={CircleImage} />
                </div>
                <div className="partnership-leaf-top">
                    <img src={LeafImage} />
                </div>
                <div className="partnership-leaf-bottom">
                    <img src={LeafImage} />
                </div>
                <div className="partnership-items">
                    {partnershipImages.map( (ele, key) => 
                    <div className="partnership-item" key={key}>
                        <img src={ele} />
                    </div>
                    )}
                </div>
                <div className="partnership-image">
                    <img src={ClueImage} />
                </div>
                <div className="partnership-title-back-bottom">Crypto</div>
            </div>
        </div>
    );
}

export default Partnership;
import './About.scss';
import Shark1Image from '../../../assets/images/giphy.webp';
import Shark2Image from '../../../assets/images/shark2.png';
import Clue1Image from '../../../assets/images/clue1.png';
import ClueImage from '../../../assets/images/clue.png';
import NewImage from '../../../assets/images/new.png';
import CircleBack from '../../../assets/images/circle-back.png';
import Back1Image from '../../../assets/images/back1.png';

const About = () => {
    return (
        <div className="about">
            <div className="about-title-back">Society</div>
            <div className="about-container">
                <div className="about-cards">
                    <div className="about-card">
                        <div className="about-card-content">
                            <div className="about-card-title">About Us</div>
                            <div className="about-card-description">
                                Oceans rose, icebergs melted, and radiation soaked the earth. 
                                Most human species died, and only deep sea creatures could survive. 
                                Since then, we've only encountered sharks as the remaining living species on Earth.
                            </div>
                            <div className="about-card-clue">
                                <img src={ClueImage} />
                            </div>
                        </div>
                        <div className="about-card-image">
                            <div className="about-card-image-shark">
                                <img src={Shark1Image} />
                                {/* <div className="about-card-new-image">
                                    <img src={NewImage} />
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="about-card-circle-back">
                        <div></div>
                    </div>
                    {/* <div className="about-card-back1">
                        <img src={Back1Image} />
                    </div> */}
                    <div className="about-card">
                        <div className="about-card-image">
                            <img src={Shark2Image} />
                        </div>
                        <div className="about-card-content">
                            <div className="about-card-description">
                                <div className="about-card-description-paragraphy">
                                    Although we recognized the greed of human beings, we wanted to preserve the innovations and inventions of mankind. 
                                    We setup the Surf Shark Society as a way to establish a pseudogovernment that will protect and keep all remaining sharks safe. 
                                </div>
                                <div className="about-card-description-paragraphy">
                                    Our underwater city and resources allow us to welcome 3,333 sharks. 
                                    Although all the shark work involve moving around a tank, we envision a future where Sharks govern the defiverse
                                    See you in Shark Shack!. 
                                </div>
                            </div>
                            <div className="about-card-content-control  ">
                                <div className="about-card-content-button">
                                    Get on the list
                                </div>
                                <div className="about-card-content-clue1">
                                    <img src={Clue1Image} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
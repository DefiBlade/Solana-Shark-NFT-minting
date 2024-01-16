import './Header.scss'
import LogoImage from '../../assets/images/logo.png';
import TogglerImage from '../../assets/images/toggler.png';
import { Link } from 'react-scroll';

const Header = () => {
    return (
        <div className="navbar">
            <div className="navbar-container">
                <div className="logo">
                    <img src={LogoImage}/>
                </div>
                <div className="links">
                    <div className="nav-link">
                        <Link 
                            smooth={true} 
                            duration={500} 
                            spy={true} 
                            to="home"
                            offset={-50}
                        >Home</Link>
                    </div>
                    <div className="nav-link">
                        <Link 
                            smooth={true} 
                            duration={500} 
                            spy={true} 
                            to="perks"
                            offset={-50}
                        >Perks</Link>
                    </div>
                    <div className="nav-link">
                        <Link 
                            smooth={true} 
                            duration={500} 
                            spy={true} 
                            to="roadmap"
                            offset={-50}
                        >Roadmap</Link>
                    </div>
                    <div className="nav-link">
                        <Link 
                            smooth={true} 
                            duration={500} 
                            spy={true} 
                            to="partners"
                            offset={-50}
                        >Partners</Link></div>
                    <div className="nav-link">
                        <Link 
                            smooth={true} 
                            duration={500} 
                            spy={true} 
                            to="team"
                            offset={-50}
                        >Team</Link>
                    </div>
                </div>
                <div className="collapse-links">
                    <div className="collapse-link-icon">
                        <img src={TogglerImage} />
                    </div>
                    <div className="collapse-menus">
                        <div className="nav-link">
                            <Link 
                                smooth={true} 
                                duration={500} 
                                spy={true} 
                                to="home"
                                offset={-50}
                            >Home</Link>
                        </div>
                        <div className="nav-link">
                            <Link 
                                smooth={true} 
                                duration={500} 
                                spy={true} 
                                to="perks"
                                offset={-50}
                            >Perks</Link>
                        </div>
                        <div className="nav-link">
                            <Link 
                                smooth={true} 
                                duration={500} 
                                spy={true} 
                                to="roadmap"
                                offset={-50}
                            >Roadmap</Link>
                        </div>
                        <div className="nav-link">
                            <Link 
                                smooth={true} 
                                duration={500} 
                                spy={true} 
                                to="partners"
                                offset={-50}
                            >Partners</Link>
                        </div>
                        <div className="nav-link">
                            <Link 
                                smooth={true} 
                                duration={500} 
                                spy={true} 
                                to="team"
                                offset={-50}
                            >Team</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>   
    );
}

export default Header;
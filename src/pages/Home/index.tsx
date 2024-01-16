import Dashboard from "./Dashboard/Dashboard";
import About from "./About/About";
import Perks from './Perks/Perks';
import Roadmap from './Roadmap/Roadmap';
import Partnership from './Partnership/Partnership';
import Team from './Team/Team';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const MainPage = () => {
    return (
        <>
            {/* <Header /> */}
            <Dashboard />
            <About />
            <Perks />
            <Roadmap />
            <Partnership />
            <Team />
            <Footer />
        </>
        // <
    );
}

export default MainPage;
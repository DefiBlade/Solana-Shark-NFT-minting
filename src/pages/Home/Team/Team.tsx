import "./Team.scss";
import LeafImage from "../../../assets/images/leaf.png";
import team1 from "../../../assets/images/team/1.png";
import team2 from "../../../assets/images/team/2.png";
import team3 from "../../../assets/images/team/3.png";
import team4 from "../../../assets/images/team/4.png";
import team5 from "../../../assets/images/team/5.png";
import team6 from "../../../assets/images/team/6.png";

const imageCount = 6;
const team:[any, string] = ["",""];
const names:string[]  = [
  "Kenri Matthew Ang",
  "Pia Cassandra Bautista",
  "Jazer Oliver Sy",
  "Aniceto Jose Cajigal",
  "John Trecy Gonzales",
  "Mark Angelo Alvinez",
];

team.push({
  image: team1,
  name: names[0],
});

team.push({
  image: team2,
  name: names[1],
});

team.push({
  image: team3,
  name: names[2],
});

team.push({
  image: team4,
  name: names[3],
});

team.push({
  image: team5,
  name: names[4],
});

team.push({
  image: team6,
  name: names[5],
});

const Team = () => {
  return (
    <div className="team" id="team">
      <div className="team-container">
        <div className="team-header">
          <div className="team-header-label">Our team</div>
          <div className="team-header-title">
            Behind the
            <span className="team-header-highlight"> sharks</span>
          </div>
        </div>
        <div className="team-leaf-top">
          <img src={LeafImage} />
        </div>
        <div className="team-leaf-bottom">
          <img src={LeafImage} />
        </div>
        <div className="team-cards">
          {team.map((ele, key) => (
            <div className="team-card" key={key}>
              <div className="team-card-avatar">
                <img src={ele.image} />
              </div>
              <div className="team-card-title">{ele.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;

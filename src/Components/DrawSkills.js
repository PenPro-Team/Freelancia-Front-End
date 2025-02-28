import { Badge } from "react-bootstrap";

function DrawSkills(props) {
  //   const required_skills = props.required_skills;
  return (
    <>
      {!props.notShowingTitle && (
        <span className="fw-bold">Required Skills:</span>
      )}
      {(Array.isArray(props.required_skills)
        ? props.required_skills
        : (props.required_skills || "").split(",").map((skill) => skill.trim())
      ).map(
        (skill) =>
          skill && (
            <Badge
              key={skill}
              bg={props.bgClass ? props.bgClass : "secondary"}
              className="me-1"
            >
              {skill}
            </Badge>
          )
      )}
    </>
  );
}

export default DrawSkills;

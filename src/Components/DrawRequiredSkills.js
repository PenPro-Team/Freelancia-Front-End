import { Badge } from "react-bootstrap";

function DrawRequiredSkills(props) {
  //   const required_skills = props.required_skills;
  return (
    <>
      <span className="fw-bold">Required Skills:</span>{" "}
      {(Array.isArray(props.required_skills)
        ? props.required_skills
        : (props.required_skills || "").split(",").map((skill) => skill.trim())
      ).map(
        (skill) =>
          skill && (
            <Badge key={skill} bg="secondary" className="me-1">
              {skill}
            </Badge>
          )
      )}
    </>
  );
}

export default DrawRequiredSkills;

import { Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";
function DrawSkills(props) {
  //   const required_skills = props.required_skills;
  const { t,i18n } = useTranslation();
  return (
    <>
      {!props.notShowingTitle && (
        <span className="fw-bold">{t('projects.required_skills')} :</span>
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

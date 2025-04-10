import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, InputGroup, Placeholder } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function FilterSkills(props) {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const navigate = useNavigate(); // Updated from useHistory to useNavigate
    const params = useParams();
    const [selectedSkills, setSelectedSkills] = useState([]);

    useEffect(() => {
        axios
            .get(`https://api-generator.retool.com/SHY6hX/projects/`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) =>
                console.error(t('projects.filter.errorFetchingSkills'), error)
            );
    }, []);

    const uniqueSkills = [
        ...new Set(data.flatMap((project) => project.required_skills || [])),
    ];

    const handleChange = (e) => {
        const skill = e.target.id;
        const isChecked = e.target.checked;

        setSelectedSkills((prevSkills) => {
            const updatedSkills = isChecked
                ? [...prevSkills, skill]
                : prevSkills.filter((s) => s !== skill);

            props.skillCb(updatedSkills);

            return updatedSkills;
        });
    };

    return (
        <>
            {uniqueSkills.length > 0 ? (
                uniqueSkills.map((skill, index) => (
                    <InputGroup
                        className="mb-3 bg-light-subtle w-100 rounded-3 py-2 px-3 text-dark-emphasis"
                        key={index}
                    >
                        <Form.Check
                            type={"checkbox"}
                            id={skill}
                            label={`${skill}`}
                            style={{ paddingRight: "5px" }}
                            onChange={handleChange}
                            checked={selectedSkills.includes(skill)}
                        />
                    </InputGroup>
                ))
            ) : (
                <div>
                    <Placeholder xs={6} />
                    <Placeholder className="w-75" />{" "}
                    <Placeholder style={{ width: "25%" }} />
                </div>
            )}
        </>
    );
}

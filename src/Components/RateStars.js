import { IoStar } from "react-icons/io5";
import { IoStarOutline } from "react-icons/io5";
import { IoStarHalf } from "react-icons/io5";

function RateStars(props) {
  const rating = props.rating;
  return (
    <>
      {rating <= 0 ? (
        <>
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
        </>
      ) : rating < 1 ? (
        <>
          <IoStarHalf style={{ color: "gold" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
        </>
      ) : rating == 1 ? (
        <>
          <IoStar style={{ color: "gold" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
        </>
      ) : rating < 2 ? (
        <>
          <IoStar style={{ color: "gold" }} />
          <IoStarHalf style={{ color: "gold" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
        </>
      ) : rating == 2 ? (
        <>
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
        </>
      ) : rating < 3 ? (
        <>
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
          <IoStarHalf style={{ color: "gold" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
        </>
      ) : rating == 3 ? (
        <>
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
        </>
      ) : rating < 4 ? (
        <>
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
          <IoStarHalf style={{ color: "gold" }} />
          <IoStarOutline style={{ color: "gray" }} />
        </>
      ) : rating == 4 ? (
        <>
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
          <IoStarOutline style={{ color: "gray" }} />
        </>
      ) : rating < 5 ? (
        <>
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
          <IoStarHalf style={{ color: "gold" }} />
        </>
      ) : rating == 5 ? (
        <>
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
          <IoStar style={{ color: "gold" }} />
        </>
      ) : (
        <>
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
          <IoStarOutline style={{ color: "gray" }} />
        </>
      )}
    </>
  );
}

export default RateStars;

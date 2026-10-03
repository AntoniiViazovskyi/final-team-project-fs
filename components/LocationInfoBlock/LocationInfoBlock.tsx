import Link from "next/link";
import css from "./LocationInfoBlock.module.css";
import { LocationDetails } from "../../types/location";

type LocationInfoBlockProps = {
  location: LocationDetails;
};

export default function LocationInfoBlock({
  location,
}: LocationInfoBlockProps) {
  const rating = location.rate;

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  return (
    <div className={css.infoContainer}>
      <div className={css.rate}>
        {Array.from({ length: 5 }, (_, index) => {
          let icon = "icon-star-rate";

          if (index < fullStars) {
            icon = "icon-star-filled";
          } else if (index === fullStars && hasHalfStar) {
            icon = "icon-star-half";
          }

          return (
            <svg
              key={index}
              className={css.star}
              width={24}
              height={24}
              aria-hidden="true"
            >
              <use href={`/icons/sprite.svg#${icon}`} />
            </svg>
          );
        })}
        <svg
          className={css.rateDot}
          width="4"
          height="4"
          viewBox="0 0 4 4"
          aria-hidden="true"
        >
          <circle cx="2" cy="2" r="2" fill="currentColor" />
        </svg>

        <span className={css.rateNumber}>{rating.toFixed(1)}</span>
      </div>

      <h2 className={css.title}>{location.name}</h2>
      <ul className={css.list}>
        <li className={css.item}>
          <p className={css.text}>
            Регіон:
            <span className={css.label}>{location.region}</span>
          </p>
        </li>

        <li className={css.item}>
          <p className={css.text}>
            Тип локації:
            <span className={css.label}>{location.locationType}</span>
          </p>
        </li>
        <li className={css.item}>
          <p className={css.text}>
            Автор статті:
            {location.ownerId?.name ? (
              <Link
                href={`/profile/${location.ownerId._id}`}
                className={`${css.link} ${css.label}`}
              >
                {location.ownerId.name}
              </Link>
            ) : (
              <span className={css.label}>Автор не вказаний</span>
            )}
          </p>
        </li>
      </ul>
    </div>
  );
}

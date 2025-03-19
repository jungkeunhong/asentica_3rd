// Custom FilledStar SVG component
const FilledStar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    height="20px" 
    viewBox="0 -960 960 960" 
    width="20px" 
    {...props}
  >
    <path d="m243-144 237-141 237 141-63-266 210-179-276-23-108-252-108 251-276 24 210 179-63 266Z" />
  </svg>
);

interface MedspaRatingsProps {
  googleStar?: number;
  googleReview?: number;
  yelpStar?: number;
  yelpReview?: number;
  google_map_link?: string;
  yelp_url?: string;
}

export function MedspaRatings({ 
  googleStar, 
  googleReview, 
  yelpStar, 
  yelpReview,
  google_map_link,
  yelp_url
}: MedspaRatingsProps) {
  return (
    <div className="flex items-center gap-3 mt-1">
      {/* Google Ratings */}
      {googleStar !== undefined && googleStar > 0 && (
        <div className="flex items-center gap-1">
          <Image
            src="/icons/google.png"
            alt="Google"
            width={12}
            height={12}
            className="relative top-[0px]"
          />
          <span className="text-sm text-gray-700">{googleStar.toFixed(1)}</span>
          {googleReview !== undefined && googleReview > 0 && (
            <>
              <span className="text-sm text-gray-400 mx-0.5">/</span>
              <a 
                href={google_map_link || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-gray-500 hover:text-amber-900"
              >
                {googleReview}
              </a>
            </>
          )}
        </div>
      )}

      {/* Yelp Ratings */}
      {yelpStar !== undefined && yelpStar > 0 && (
        <div className="flex items-center gap-1">
          <Image
            src="/icons/yelp.png"
            alt="Yelp"
            width={12}
            height={12}
            className="relative top-[0px]"
          />
          <span className="text-sm text-gray-700">{yelpStar.toFixed(1)}</span>
          {yelpReview !== undefined && yelpReview > 0 && (
            <>
              <span className="text-sm text-gray-400 mx-0.5">/</span>
              <a 
                href={yelp_url || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-gray-500 hover:text-amber-900"
              >
                {yelpReview}
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
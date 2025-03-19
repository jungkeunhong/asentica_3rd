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
  googleStar?: number | null;
  googleReview?: number | null;
  yelpStar?: number | null;
  yelpReview?: number | null;
}

export function MedspaRatings({ 
  googleStar, 
  googleReview = 0, 
  yelpStar, 
  yelpReview 
}: MedspaRatingsProps) {
  return (
    <div className="flex flex-col gap-0.5 mt-2">
      {/* Google rating */}
      <div className="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
          <path fill="#000000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#000000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#000000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#000000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <FilledStar className="w-4 h-4 fill-current text-black" />
        <span className="text-xs text-black">{googleStar || ''}</span>
        <span className="text-xs text-gray-500">({googleReview || 0})</span>
      </div>

      {/* Yelp rating - only show if data exists */}
      {yelpStar && yelpReview && (
        <div className="flex items-center gap-1">                              
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 228.097 228.097">
            <g>
              <path fill="#000000" d="M173.22,68.06c8.204,6.784,30.709,25.392,27.042,38.455c-1.696,5.867-8.434,7.746-13.43,9.579 c-11.505,4.171-23.33,7.471-35.339,9.9c-9.717,1.971-30.48,6.279-26.63-10.909c1.512-6.646,6.875-12.284,11.184-17.28 c8.846-10.404,17.876-21.405,28.555-29.93c0.871-0.688,1.925-0.871,2.842-0.733C169.232,66.41,171.386,66.502,173.22,68.06z"/>
              <path fill="#000000" d="M161.119,205.197c-7.196-5.821-12.284-14.942-16.684-22.917c-4.309-7.7-11.092-17.876-12.238-26.813 c-2.337-18.38,24.292-7.333,31.947-4.675c10.175,3.575,37.447,7.517,34.422,23.421c-2.521,12.971-18.151,28.784-31.213,30.801 c-0.137,0.046-0.321,0-0.504,0c-0.046,0.046-0.092,0.092-0.137,0.137c-0.367,0.183-0.779,0.413-1.192,0.596 C163.961,206.573,162.449,206.252,161.119,205.197z"/>
              <path fill="#000000" d="M101.58,157.896c14.484-6.004,15.813,10.175,15.721,19.984c-0.137,11.688-0.504,23.421-1.375,35.063 c-0.321,4.721-0.137,10.405-4.629,13.384c-5.546,3.667-16.225,0.779-21.955-1.008c-0.183-0.092-0.367-0.183-0.55-0.229 c-12.054-2.108-26.767-7.654-28.188-18.792c-0.138-1.283,0.367-2.429,1.146-3.3c0.367-0.688,0.733-1.329,1.146-1.925 c1.788-2.475,3.85-4.675,5.913-6.921c3.483-5.179,7.242-10.175,11.229-14.988C85.813,172.197,92.917,161.471,101.58,157.896z"/>
              <path fill="#000000" d="M103.689,107.661c-21.13-17.371-41.71-44.276-52.344-69.164 c-8.113-18.93,12.513-30.48,28.417-35.705c21.451-7.059,29.976-0.917,32.13,20.534c1.788,18.471,2.613,37.08,2.475,55.643 c-0.046,7.838,2.154,20.488-2.429,27.547c0.733,2.888-3.621,4.95-6.096,2.979c-0.367-0.275-0.733-0.642-1.146-0.963 C104.33,108.303,104.009,108.028,103.689,107.661z"/>
              <path fill="#000000" d="M101.397,134.566c1.696,7.517-3.621,10.542-9.854,13.384c-11.092,4.996-22.734,8.984-34.422,12.284 c-6.784,1.879-17.188,6.371-23.742,1.375c-4.95-3.758-5.271-11.596-5.729-17.28c-1.008-12.696,0.917-42.993,18.517-44.276 c8.617-0.596,19.388,7.104,26.447,11.138c9.396,5.409,19.48,11.596,26.492,20.076C100.159,131.862,101.03,132.916,101.397,134.566z"/>
            </g>
          </svg>
          <FilledStar className="w-4 h-4 fill-current text-black" />
          <span className="text-xs text-black">{yelpStar}</span>
          <span className="text-xs text-gray-500">({yelpReview})</span>
        </div>
      )}
    </div>
  );
}
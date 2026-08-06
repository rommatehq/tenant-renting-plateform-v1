import { Star } from "lucide-react";

const reviews = [
  {
    name: "Ananya Sharma",
    college: "St. Xavier's College",
    year: "2nd Year",
    avatarBg: "bg-teal-100",
    avatarEmoji: "🧑",
    text: "The proximity to college is unbeatable. I save so much time on commuting, and the Wi-Fi is actually as fast as they claim!",
  },
  {
    name: "Rohan Das",
    college: "Loreto College",
    year: "3rd Year",
    avatarBg: "bg-slate-800",
    avatarEmoji: "🧑",
    text: "Great community vibe here. The security is top-notch which makes my parents feel much better about me living away from home.",
  },
];

function StarRating({ rating = 4.8, max = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            size={20}
            className={
              filled || half
                ? "fill-amber-500 text-amber-500"
                : "fill-slate-200 text-slate-200"
            }
          />
        );
      })}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-20 w-auto h-24 overflow-y-auto">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0 ${review.avatarBg}`}
        >
          {review.avatarEmoji}
        </div>
        <div>
          <p className="font-semibold text-slate-900 text-sm">{review.name}</p>
          <p className="text-slate-500 text-sm">
            {review.college} • {review.year}
          </p>
        </div>
      </div>
      <p className="text-slate-500 italic leading-relaxed text-sm mb-10 mt-20">"{review.text}"</p>
    </div>
  );
}

export default function StudentReviews() {
  return (
    <section className="bg-indigo-50/60 py-12 px-6">
      <div className="w-auto mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-20 ">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Student Reviews
            </h2>
            <div className="flex items-center gap-2">
              <StarRating rating={4.8} />
              <span className="text-slate-900 font-medium">4.8/5</span>
              <span className="text-slate-500">based on 124 reviews</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 h-10 w-48 rounded-sm border border-indigo-600 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition-colors">
              Leave a Review
            </button>
            <button className="px-5 py-2.5 h-10 w-48  rounded-full bg-indigo-700 text-white font-semibold text-sm hover:bg-indigo-800 transition-colors">
              View All Reviews
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
          {reviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
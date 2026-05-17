const reviews = [
  { name: 'Hamza A.', feedback: 'The 3D style cards helped me compare SUVs quickly. Checkout was smooth and fast.' },
  { name: 'Sana R.', feedback: 'Great details for each model including horsepower and stock. Very practical PKR pricing.' },
  { name: 'Bilal M.', feedback: 'Search and filters feel instant. This is a complete mini car commerce workflow.' }
];

export function ReviewsPage() {
  return (
    <section>
      <h2>Customer Reviews</h2>
      <div className="review-grid">
        {reviews.map((review) => (
          <article key={review.name} className="review-card">
            <h3>{review.name}</h3>
            <p>{review.feedback}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

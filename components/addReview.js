import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Rating from '@mui/material/Rating';

const AddReviewForm = (props) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating || !comment) {
      alert("All fields are required!");
      return;
    }

    props.AddReview(parseInt(rating, 5),comment )
    
    // Clear the form
    setRating(0);
    setComment("");
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Add a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Rating Input */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium">
            Rating
          </label>
          <Rating name="no-value" onChange={()=>{setRating(event.target.value)}} value={rating} />
        </div>

        {/* Comment Input */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium">
            Comment
          </label>
          <Textarea
            id="comment"
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Submit Review
        </Button>
      </form>
    </div>
  );
};

export default AddReviewForm;

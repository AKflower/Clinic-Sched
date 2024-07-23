import React from 'react';
import Rating from 'react-rating';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

const StarRating = ({ rating }) => {
  return (
    <Rating
      initialRating={rating}
      emptySymbol={<StarBorderIcon style={{ color: '#ffd700', fontSize: '24px' }} />}
      fullSymbol={<StarIcon style={{ color: '#ffd700', fontSize: '24px' }} />}
      fractions={10}
      readonly
    />
  );
};

export default StarRating;
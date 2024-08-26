// JSDoc made by ChatGPT

import { styled } from '@mui/material/styles';
import { Avatar, Badge } from '@mui/material';

/**
 * StyledBadge component
 * 
 * A customized Badge component that applies additional styling to represent user presence
 * with a color-coded badge. This component uses Material-UI's styled function to create
 * a custom-styled Badge component.
 * 
 * @component
 * @param {Object} props - The props that are passed to the component.
 * @param {string} props.ballcolor - The color of the badge that indicates user presence status.
 * @returns {JSX.Element} The StyledBadge component.
 */
export const StyledBadge = styled(Badge)(({ theme, ballcolor }) => ({
  '& .MuiBadge-badge': {
    // Sets the background color of the badge to the value of the 'ballcolor' prop
    backgroundColor: ballcolor,

    // Sets the text color of the badge to the value of the 'ballcolor' prop
    color: ballcolor,

    // Adds a subtle shadow to the badge
    boxShadow: `0 0 0 2px rgba(255, 255, 255, 0.1)`,

    // Pseudo-element styling for a border effect around the badge
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      content: '""',
    },
  },
}));

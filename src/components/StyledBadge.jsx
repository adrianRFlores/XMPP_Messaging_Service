import { styled } from '@mui/material/styles';
import {Avatar, Badge } from "@mui/material";

export const StyledBadge = styled(Badge)(({ theme, ballcolor }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: ballcolor,
      color: ballcolor,
      boxShadow: `0 0 0 2px rgba(255, 255, 255, 0.1)`,
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
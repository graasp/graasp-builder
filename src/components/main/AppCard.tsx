import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';

import { buildItemFormAppOptionId } from '@/config/selectors';

import AddNewIcon from '../../resources/addNew.png';

export type Props = {
  url?: string;
  description?: string;
  name: string;
  extra?: { image?: string };
  handleSelect: any;
  selected?: boolean;
};

const AppCard = ({
  url,
  description,
  name,
  extra,
  handleSelect,
  selected = false,
}: Props): JSX.Element => {
  const clearApp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleSelect({ url: '', name: '' });
  };
  return (
    <Card
      sx={{
        maxWidth: 300,
        border: selected ? '2px solid #5050d2' : 'none',
        position: 'relative',
      }}
      onClick={() => {
        handleSelect({ url, description, name, extra });
      }}
      id={buildItemFormAppOptionId(name)}
    >
      {selected && (
        <IconButton
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 1,
            color: 'white',
          }}
          onClick={clearApp}
        >
          <CloseIcon />
        </IconButton>
      )}
      <CardActionArea>
        <CardMedia
          component="img"
          height="100"
          image={extra?.image || AddNewIcon}
          alt={name}
        />
        <CardContent>
          <Typography gutterBottom variant="subtitle2" component="div">
            {name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default AppCard;

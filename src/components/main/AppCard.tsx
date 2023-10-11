import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

import { buildItemFormAppOptionId } from '@/config/selectors';

import AddNewIcon from '../../resources/addNew.png';

export type Props = {
  description: string;
  name: string;
  image?: string;
  onClick: () => void;
  selected?: boolean;
};

const AppCard = ({
  description,
  name,
  image,
  onClick,
  selected = false,
}: Props): JSX.Element => (
  <Grid2 xs={12} sm={6} md={4} display="flex">
    <Card
      sx={{
        width: '100%',
        outline: selected ? '2px solid #5050d2' : '',
      }}
      onClick={onClick}
      id={buildItemFormAppOptionId(name)}
    >
      <CardActionArea
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          height: '100%',
        }}
      >
        <CardMedia
          component="img"
          // replace with aspectRatio: 1 to display a square image
          sx={{ height: 100 }}
          image={image || AddNewIcon}
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
  </Grid2>
);

export default AppCard;

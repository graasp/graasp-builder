import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Typography,
  styled,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

import { buildItemFormAppOptionId } from '@/config/selectors';

import defaultImage from '../../resources/defaultApp.png';

const StyledCardActionArea = styled(CardActionArea)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  height: '100%',
  width: '100%',
});

export type Props = {
  id?: string;
  description?: string;
  name?: string;
  image?: string;
  onClick?: () => void;
  selected?: boolean;
};

const AppCard = ({
  id,
  description,
  name,
  image,
  onClick,
  selected = false,
}: Props): JSX.Element => (
  <Card
    sx={{
      width: '100%',
      outline: selected ? '2px solid #5050d2' : '',
    }}
    onClick={onClick}
    id={buildItemFormAppOptionId(id ?? name)}
  >
    <StyledCardActionArea>
      <Grid2
        container
        direction="row"
        alignItems="center"
        width="100%"
        spacing={[0, 1]}
      >
        <Grid2 xs={2} p={[0, 1.5]}>
          <Box
            component="img"
            src={image ?? defaultImage}
            alt={name}
            width="100%"
            display="flex"
            flexShrink={0}
            minWidth={0}
            borderRadius={1}
            overflow="hidden"
          />
        </Grid2>
        <Grid2 xs={10}>
          <CardContent
            sx={{
              pt: 1,
              paddingBottom: '0 !important',
              minWidth: 0,
            }}
          >
            <Typography
              fontWeight="bold"
              gutterBottom
              variant="body1"
              component="div"
              width="100%"
              noWrap
            >
              {name ?? <Skeleton />}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              width="100%"
              sx={{
                display: { xs: 'none', sm: 'block', md: 'block' },
              }}
              noWrap
            >
              {description ?? <Skeleton height={20} />}
            </Typography>
          </CardContent>
        </Grid2>
      </Grid2>
    </StyledCardActionArea>
  </Card>
);
const AppCardWrapper = (props: Props): JSX.Element => (
  <Grid2 xs={12} display="flex">
    <AppCard
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  </Grid2>
);

export default AppCardWrapper;

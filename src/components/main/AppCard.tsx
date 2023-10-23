import {
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

import { buildItemFormAppOptionId } from '@/config/selectors';

const StyledCardActionArea = styled(CardActionArea)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  height: '100%',
  width: '100%',
});

export type Props = {
  description?: string;
  name?: string;
  image?: string;
  onClick?: () => void;
  selected?: boolean;
};

const AppCard = ({
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
    id={buildItemFormAppOptionId(name)}
  >
    <StyledCardActionArea>
      <Stack direction="row">
        <Stack
          sx={{
            height: { xs: 40, sm: 70 },
            width: { xs: 40, sm: 70 },
            background: 'black',
          }}
        >
          <img src={image} alt={name} width="100%" />
        </Stack>
        <Stack>
          <CardContent
            sx={{ width: '100%', pt: 1, paddingBottom: '0 !important' }}
          >
            <Typography
              fontWeight="bold"
              gutterBottom
              variant="body1"
              component="div"
              noWrap
            >
              {name ?? <Skeleton />}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: { xs: 'none', sm: 'block', md: 'block' },
              }}
            >
              {description ?? <Skeleton height={20} />}
            </Typography>
          </CardContent>
        </Stack>
      </Stack>
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

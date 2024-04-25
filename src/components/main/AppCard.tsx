import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Skeleton,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from '@mui/material';

import { buildItemFormAppOptionId } from '@/config/selectors';

import defaultImage from '../../resources/defaultApp.png';

const StyledCardActionArea = styled(CardActionArea)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
  padding: '8px',
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
}: Props): JSX.Element => {
  const theme = useTheme();
  return (
    <Tooltip title={description || ''}>
      <Card
        sx={{
          flex: '1 0 calc(50% - 8px)',
          outline: selected ? `2px solid ${theme.palette.primary.main}` : '',
        }}
        onClick={onClick}
        id={buildItemFormAppOptionId(id ?? name)}
      >
        <StyledCardActionArea>
          <Grid container direction="row" alignItems="center">
            <Grid xs={2} display="flex" justifyContent="center">
              <Box
                component="img"
                src={image ?? defaultImage}
                alt={name}
                width="100%"
                flexShrink={0}
                minWidth={0}
                borderRadius={1}
                overflow="hidden"
                justifyContent="center"
              />
            </Grid>
            <Grid xs={10}>
              <CardContent
                sx={{
                  minWidth: 0,
                  paddingBottom: '16px !important',
                }}
              >
                <Typography gutterBottom variant="label" component="div">
                  {name ?? <Skeleton />}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  noWrap
                >
                  {description ?? ''}
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        </StyledCardActionArea>
      </Card>
    </Tooltip>
  );
};

export default AppCard;

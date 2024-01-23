import { Box, styled } from '@mui/material';

// a way to expand button to include the text
const StyledBox = styled(Box)(({ theme }) => ({
  '& span': {
    maxWidth: theme.spacing(2),
  },
  '& button': {
    paddingRight: theme.spacing(12),
  },
}));

type ButtonWithTextProps = {
  children: JSX.Element;
  text: string;
  onClick: () => void;
};

const IconButtonWithText = ({
  children,
  text,
  onClick,
}: ButtonWithTextProps): JSX.Element => (
  <StyledBox
    onClick={onClick}
    px={1.5}
    py={0.8}
    display="flex"
    alignItems="center"
    gap={3}
  >
    {children} {text}
  </StyledBox>
);

export default IconButtonWithText;

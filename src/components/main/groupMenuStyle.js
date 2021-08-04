export default () => ({
  root: {
    color: '#36313d',
    font:
      "100%/1.5 -apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Helvetica Neue','Arial','Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'",
    fontKerning: 'normal',
    fontFeatureSettings: '"kern", "liga", "clig", "calt"',
    fontSize: 14,
    minHeight: 45,
    lineHeight: '21px',
    margin: 0,
    '&:before, &:after': {
      content: '" "',
      position: 'absolute',
      left: 0,
      height: 10,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
      transform: 'scale(1)',
      width: 5,
      background: 'rgb(255,255,255)',
      transition: 'width 0.5s, height 0.5s, transform 0.5s;',
    },
    '&:hover, &:focus': {
      background: 'rgba(241,222,250,0.275)',
      color: '#ffffff',
      '&:before': {
        background: '#ffffff',
        transform: 'scale(2)',
        transition: 'width 0.5s, height 0.5s, transform 0.5s;',
      },
    },
  },
  selected: {
    '&.Mui-selected': {
      color: 'rgb(138, 75, 175)',
      background: 'initial',
      fontWeight: 500,
      transform: 'scale(1)',
      '&:before': {
        transform: 'scale(0)',
      },
      '&:hover, &focus': {
        background: 'rgba(241,222,250,0.275)',
        color: '#ffffff',
        '&:before': {
          transform: 'scale(0)',
        },
      },
      '&:after': {
        width: 5,
        transform: 'scale(3)',
        transition: 'width 0.5s, height 0.5s, transform 0.5s;',
      },
    },
  },
});

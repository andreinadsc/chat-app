import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#380099',
            secondary: '#FFFFFF'
        },
        secondary: {
            main: '#9E0059',
            secondary: '#FF0054',
            default: '#FFBD00',
        },
        background: {
            paper: '#EFEFEF',
            search: '#F7F7F8'
        },
        details: {
            primary: '#FFFF'
        },
        text: {
            primary: '#380099'
        },
    },
    components: {
        MuiTabs: {
            styleOverrides: {
                scroller: {
                    overflow: 'unset !important',
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                input: ({ theme }) => ({
                    color: theme.palette.primary.main,
                    padding: '1.2rem !important'
                })
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    overflow: 'initial'
                }
            }
        },
        MuiCardMedia: {
            styleOverrides: {
                root: {
                    objectFit: 'contain'
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                endIcon: {
                    marginLeft: 0
                },
                root: {
                    cursor: 'pointer'
                }
            }
        },
        MuiGrid: {
            styleOverrides: {
                root: {
                    width: '100%',
                    paddingLeft: '20px'
                }
            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                endAdornment: {
                    top: '.9rem'
                },
                inputRoot: {
                    padding: 0
                },
                root: {
                    height: 'auto'
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#a0a0a0',
                    marginTop: '-.2rem'
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    width: '95%'
                }
            }
        }
    },
    typography: {
        fontFamily: [
            'Nunito Sans',
            'sans-serif'
        ].join(','),
    }
});

export default theme;

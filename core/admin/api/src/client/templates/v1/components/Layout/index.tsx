import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, MainWrapper } from '../../styled';
import { getIcon } from '../../helpers/icons';
import { MuiThemeProvider } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';

interface LayoutProps {
  websiteName: string;
  colorScheme: Record<string, any>;
  children: React.ReactChild | React.ReactChild[];
}

const Layout = ({ children, websiteName, colorScheme }: LayoutProps) => {
  const getIcons = (iconName: string) => {
    return getIcon(iconName);
  };

  const theme: any = { colors: colorScheme, icon: getIcons };
  const muiTheme: any = createTheme({
    palette: colorScheme,
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <MainWrapper>{children}</MainWrapper>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default Layout;
